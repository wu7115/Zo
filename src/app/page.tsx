'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { FeedItem, SuggestedTopicFeedData, SuggestedProductFeedData } from '@/app/types/feed';
import { DynamicFeedCard } from './components/DynamicFeedCard';
import { ConsolidatedMissedTasksCard } from './components/ConsolidatedMissedTasksCard';
import { PostsSection } from './components/PostsSection';
import InfiniteScroll from 'react-infinite-scroll-component';
import { trackingQuestions } from '@/data/trackingQuestions';
import { getQuestionTime, getAnytimeTaskAllocation } from '@/utils/taskAllocation';
import { useTrackingData } from '@/hooks/use-tracking-data';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { loadUserBuyProducts } from '@/lib/trackingService';
import { loadUserLearnArticles } from '@/lib/trackingService';
import { products as zoProducts } from '@/data/products';

type TrackingQuestionForLLM = {
  id: string;
  type: string;
  text: string;
  timeOfDay: string;
  options?: string[];
  placeholder?: string;
};

// List of images to use for community (LLM) posts, in order
const communityPostImages = [
  '/images/posts/ride_bike.jpeg',
  '/images/posts/yoga.jpeg',
  '/images/posts/exercise.jpeg',
  '/images/posts/diet.jpeg',
  '/images/posts/ride_bike2.jpeg',
  '/images/posts/person_in_sunset.png',
  '/images/posts/sunset.png',
];

async function fetchPersonalizedTopic(onboardingAnswers: any): Promise<SuggestedTopicFeedData> {
  const res = await fetch('/api/ai-topic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ onboardingAnswers }),
  });
  return await res.json();
}

async function fetchPersonalizedProduct(onboardingAnswers: any, batchIndex: number): Promise<SuggestedProductFeedData> {
  const res = await fetch('/api/ai-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ onboardingAnswers, batchIndex }),
  });
  return await res.json();
}

async function fetchAiProducts(onboardingAnswers: any, batchIndex: number): Promise<SuggestedProductFeedData[]> {
  const res = await fetch('/api/ai-product-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ onboardingAnswers, batchIndex }),
  });
  return await res.json();
}

async function fetchPersonalizedInsight(onboardingAnswers: any): Promise<{ id: string, title: string, statement: string, rationale: string, sourceUrl?: string }> {
  const res = await fetch('/api/ai-insight', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ onboardingAnswers }),
  });
  return res.json();
}

// Function to determine current time period
const getCurrentTimePeriod = (): 'morning' | 'afternoon' | 'evening' => {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour >= 3 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else {
    return 'evening';
  }
};

// Function to get appropriate greeting based on time
const getGreeting = (timePeriod: 'morning' | 'afternoon' | 'evening', userName?: string): string => {
  const name = userName || "there";
  switch (timePeriod) {
    case 'morning':
      return `Good morning, ${name}! 🌅`;
    case 'afternoon':
      return `Good afternoon, ${name}! ☀️`;
    case 'evening':
      return `Good evening, ${name}! 🌙`;
  }
};

// Function to generate priorities for all time periods
const generateAllTimePeriodPriorities = async (onboardingAnswers: any, priorities: any, savePriorities: any) => {
  const timePeriods: ('morning' | 'afternoon' | 'evening')[] = ['morning', 'afternoon', 'evening'];
  const categoryMapping: Record<string, string> = {
    'Digestive Health': 'digestive-health-&-symptoms',
    'Medication & Supplement Use': 'medication-&-supplement-use',
    'Nutrition & Diet Habits': 'diet-&-nutrition',
    'Personalized Goals & Achievements': 'personalized-goals-&-achievements',
    'Physical Activity & Movement': 'physical-activity-&-movement',
    'Stress, Sleep, and Recovery': 'sleep-&-recovery',
  };

  const newPriorities = { ...priorities };

  for (const timePeriod of timePeriods) {
    // Skip if priorities already exist for this time period
    if (Object.keys(newPriorities[timePeriod] || {}).length > 0) {
      continue;
    }

    const timeTasks: TrackingQuestionForLLM[] = [];
    
    Object.entries(trackingQuestions).forEach(([category, questions]) => {
      questions.forEach((q: any) => {
        const assignedTime = getQuestionTime(q.id, q.timeOfDay);
        if (assignedTime === timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)) {
          const categoryId = categoryMapping[category] || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          timeTasks.push({
            id: `${categoryId}__${q.id}`,
            type: q.type,
            text: q.text,
            timeOfDay: q.timeOfDay,
            options: q.options,
            placeholder: q.placeholder,
          });
        }
      });
    });

    if (timeTasks.length > 0) {
      try {
        const res = await fetch('/api/ai-prioritize-tracking-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ onboardingAnswers, trackingQuestions: timeTasks }),
        });
        const prioritiesArr = await res.json();
        const prioritiesMap: Record<string, 'high' | 'medium' | 'low'> = {};
        
        if (Array.isArray(prioritiesArr)) {
          prioritiesArr.forEach((item) => {
            if (item && typeof item.id === 'string' && ['high', 'medium', 'low'].includes(item.priority)) {
              prioritiesMap[item.id] = item.priority;
            }
          });
        }
        
        newPriorities[timePeriod] = prioritiesMap;
      } catch (e) {
        // fallback: all medium
        const prioritiesMap: Record<string, 'high' | 'medium' | 'low'> = {};
        timeTasks.forEach((q) => { prioritiesMap[q.id] = 'medium'; });
        newPriorities[timePeriod] = prioritiesMap;
      }
    }
  }

  // Save all priorities at once
  await savePriorities(newPriorities);
  return newPriorities;
};

// Helper to fetch AI-generated community post
const fetchAiCommunityPost = async (onboardingAnswers: any, batchIndex: number) => {
  try {
    const res = await fetch('/api/ai-community-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ onboardingAnswers, batchIndex }),
    });
    const communityPost = await res.json();
    return communityPost;
  } catch (error) {
    console.error('Error fetching AI community post:', error);
    // Return fallback data
    return {
      friendName: "Alex Johnson",
      friendAvatarUrl: "https://placehold.co/40x40.png?text=AJ",
      friendAvatarFallback: "AJ",
      friendAvatarHint: "profile person",
      timestamp: "2 hours ago",
      activityDetails: "Just completed a 5K run! Feeling energized and ready for the day. 🏃‍♂️ #RunningGoals",
      activityImageUrl: "https://placehold.co/600x400.png",
      activityImageAlt: "Community member's activity post",
      activityImageHint: "running trail",
      likes: 12,
      comments: 3,
    };
  }
};

export default function HomePage() {
  const router = useRouter();
  const [isLoadingRedirect, setIsLoadingRedirect] = useState(true);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loadingAI, setLoadingAI] = useState(true);
  const [batchIndex, setBatchIndex] = useState(0);
  const [onboardingAnswers, setOnboardingAnswers] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [anytimeAllocation, setAnytimeAllocation] = useState<Record<string, string> | null>(null);
  const [userBuyProducts, setUserBuyProducts] = useState<any[]>([]);
  const [userLearnArticles, setUserLearnArticles] = useState<any[]>([]);
  
  // Use the new tracking service
  const { 
    priorities, 
    dailyAnswers, 
    isLoading: trackingLoading, 
    savePriorities, 
    getTimePeriodPriorities 
  } = useTrackingData();

  // Listen for auth state changes
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Load onboarding answers from Firestore
  useEffect(() => {
    const loadOnboardingAnswers = async () => {
      try {
        if (user) {
          const db = getFirestore(app);
          const docRef = doc(db, 'users', user.uid, 'onboarding', 'answers');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setOnboardingAnswers(data || {});
          } else {
            setOnboardingAnswers({});
          }
        } else {
          setOnboardingAnswers({});
        }
        setIsLoadingRedirect(false);
      } catch (error) {
        console.error('Error loading onboarding answers:', error);
        setOnboardingAnswers({});
        setIsLoadingRedirect(false);
      }
    };
    if (user !== undefined) {
      loadOnboardingAnswers();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const allocation = await getAnytimeTaskAllocation();
      setAnytimeAllocation(allocation);
    })();
  }, [user]);

  // Load LLM buy products from Firestore
  useEffect(() => {
    if (!user) return;
    (async () => {
      const products = await loadUserBuyProducts(user.uid);
      setUserBuyProducts(products);
      const articles = await loadUserLearnArticles(user.uid);
      setUserLearnArticles(articles);
    })();
  }, [user]);

  // Helper to generate a batch of feed items with unique keys
  const generateFeedBatch = async (batchNum: number): Promise<FeedItem[]> => {
    // Fetch all needed data in parallel
    const [insight, topic, community] = await Promise.all([
      fetchPersonalizedInsight({ ...onboardingAnswers, batchIndex: batchNum }),
      fetchPersonalizedTopic(onboardingAnswers),
      fetchAiCommunityPost(onboardingAnswers, batchNum),
    ]);

    // Learn card: show only one article per batch, matching batchNum
    let learnItem: FeedItem[] = [];
    if (userLearnArticles.length > batchNum) {
      const article = userLearnArticles[batchNum];
      learnItem = [{
        type: 'recommendedLearning' as const,
        id: `recommended-learning-${batchNum}`,
        data: { id: `recommended-learning-${batchNum}`, articles: [article] }
      }];
    }

    // Buy card: show all Zo products first, then LLM products from Firestore
    let productItem: FeedItem[] = [];
    if (batchNum < zoProducts.length) {
      const zoProduct = zoProducts[batchNum];
      productItem = [{
        type: 'suggestedProduct' as const,
        id: `zo-product-${batchNum}-${zoProduct.id}`,
        data: zoProduct
      }];
    } else if (userBuyProducts.length > 0 && batchNum - zoProducts.length < userBuyProducts.length) {
      // Show LLM products from Firestore
      const idx = batchNum - zoProducts.length;
      const llmProduct = userBuyProducts[idx];
      productItem = [{
        type: 'suggestedProduct' as const,
        id: `llm-product-${idx}-${llmProduct.id}`,
        data: llmProduct
      }];
    }

    const communityId = `community-${batchNum + 1}`;
    const insightId = `insight-${batchNum + 1}`;
    const topicId = `topic-${batchNum + 1}`;

    // Always: insight → learn → community → buy
    return [
      {
        type: 'aiInsight' as const,
        id: insightId,
        data: insight
      },
      ...learnItem,
      {
        type: 'friendActivity' as const,
        id: communityId,
        data: community
      },
      ...productItem
    ];
  };

  // Initial load: greeting, tracking, and first batch
  useEffect(() => {
    if (!isLoadingRedirect && onboardingAnswers && !trackingLoading && user && anytimeAllocation) {
      (async () => {
        setLoadingAI(true);
        const currentTimePeriod = getCurrentTimePeriod();
        // --- LLM Prioritization for tracking questions ---
        // Check if onboarding was just completed
        const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
        if (onboardingCompleted) {
          // Clear the flag
          localStorage.removeItem('onboardingCompleted');
          // Generate priorities for all time periods using the tracking service
          await generateAllTimePeriodPriorities(onboardingAnswers, priorities, savePriorities);
        }
        // Use priorities from Firestore for current time period
        const prioritiesMap = getTimePeriodPriorities(currentTimePeriod);
        const greeting: FeedItem = {
          type: 'greeting',
          id: 'greeting-1',
          data: {
            id: 'greeting-1',
            greetingText: getGreeting(currentTimePeriod, onboardingAnswers.userName),
            syncStatus: "Your wearable synced: 7h 15m sleep (11:15 PM - 6:30 AM).",
            accomplishment: "You hit your sleep duration goal! 🎉",
          },
        };
        const timeTrackingCard: FeedItem = {
          type: `${currentTimePeriod}Tracking` as 'morningTracking' | 'afternoonTracking' | 'eveningTracking',
          id: `${currentTimePeriod}-tracking-1`,
          data: {
            id: `${currentTimePeriod}-tracking-1`,
            timeOfDay: currentTimePeriod,
            priorities: prioritiesMap,
            anytimeAllocation: anytimeAllocation,
          } as any,
        };
        const postsSection: FeedItem = {
          type: 'postsSection',
          id: 'posts-section-1',
          data: {
            id: 'posts-section-1',
          },
        };
        const firstBatch = await generateFeedBatch(0);
        setFeedItems([greeting, timeTrackingCard, postsSection, ...firstBatch]);
        setBatchIndex(1);
        setLoadingAI(false);
      })();
    }
  }, [isLoadingRedirect, onboardingAnswers, trackingLoading, priorities, getTimePeriodPriorities, savePriorities, user, anytimeAllocation]);

  // Listen for trackingAnswersChanged and refresh tracking priorities/feed
  useEffect(() => {
    const handleTrackingAnswersChanged = () => {
      // Re-run the same logic as initial load to update priorities and feed
      (async () => {
        setLoadingAI(true);
        const currentTimePeriod = getCurrentTimePeriod();
        const prioritiesMap = getTimePeriodPriorities(currentTimePeriod);
        
        const greeting: FeedItem = {
          type: 'greeting',
          id: 'greeting-1',
          data: {
            id: 'greeting-1',
            greetingText: getGreeting(currentTimePeriod, onboardingAnswers.userName),
            syncStatus: "Your wearable synced: 7h 15m sleep (11:15 PM - 6:30 AM).",
            accomplishment: "You hit your sleep duration goal! 🎉",
          },
        };
        const timeTrackingCard: FeedItem = {
          type: `${currentTimePeriod}Tracking` as 'morningTracking' | 'afternoonTracking' | 'eveningTracking',
          id: `${currentTimePeriod}-tracking-1`,
          data: {
            id: `${currentTimePeriod}-tracking-1`,
            timeOfDay: currentTimePeriod,
            priorities: prioritiesMap,
            anytimeAllocation: anytimeAllocation,
          } as any,
        };
        const postsSection: FeedItem = {
          type: 'postsSection',
          id: 'posts-section-1',
          data: {
            id: 'posts-section-1',
          },
        };
        const firstBatch = await generateFeedBatch(0);
        setFeedItems([greeting, timeTrackingCard, postsSection, ...firstBatch]);
        setBatchIndex(1);
        setLoadingAI(false);
      })();
    };
    window.addEventListener('trackingAnswersChanged', handleTrackingAnswersChanged);
    return () => {
      window.removeEventListener('trackingAnswersChanged', handleTrackingAnswersChanged);
    };
  }, [onboardingAnswers, getTimePeriodPriorities, anytimeAllocation]);

  // Listen for new post creation to refresh feed immediately
  useEffect(() => {
    const handleNewPostCreated = () => {
      // Force a re-render of the feed items to show the new post
      setFeedItems(prevItems => [...prevItems]);
    };
    
    window.addEventListener('newPostCreated', handleNewPostCreated);
    return () => {
      window.removeEventListener('newPostCreated', handleNewPostCreated);
    };
  }, []);

  // Fetch more data for infinite scroll
  const fetchMoreData = async () => {
    setLoadingAI(true);
    const newBatch = await generateFeedBatch(batchIndex);
    setFeedItems(prev => [...prev, ...newBatch]);
    setBatchIndex(prev => prev + 1);
    setLoadingAI(false);
  };

  if (isLoadingRedirect || trackingLoading || (loadingAI && feedItems.length === 0) || !anytimeAllocation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-6 sm:py-12">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <InfiniteScroll
            dataLength={feedItems.length}
            next={fetchMoreData}
            hasMore={true}
            loader={<p className="text-center text-muted-foreground py-4">Loading more...</p>}
            endMessage={<p className="text-center text-muted-foreground py-4">You've reached the end!</p>}
          >
            <div className="space-y-6">
              {feedItems.map((item) => (
                <DynamicFeedCard key={item.id} item={item} />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </main>
      <footer className="text-center py-8 mt-8 sm:mt-12">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Podium. Stay Active, Stay Inspired.</p>
      </footer>
    </div>
  );
}
