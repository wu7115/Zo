'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { FeedItem, SuggestedTopicFeedData, SuggestedProductFeedData } from '@/app/types/feed';
import { DynamicFeedCard } from './components/DynamicFeedCard';
import { ConsolidatedMissedTasksCard } from './components/ConsolidatedMissedTasksCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { trackingQuestions } from '@/data/trackingQuestions';
import { getQuestionTime } from '@/utils/taskAllocation';

type TrackingQuestionForLLM = {
  id: string;
  type: string;
  text: string;
  timeOfDay: string;
  options?: string[];
  placeholder?: string;
};

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
  const [trackingPriorities, setTrackingPriorities] = useState<Record<string, 'high' | 'medium' | 'low'>>({});

  // Helper to generate a batch of feed items with unique keys
  const generateFeedBatch = async (batchNum: number): Promise<FeedItem[]> => {
    let productItems: FeedItem[] = [];
    
    // Show all 8 Zo products first (batches 0-7), then switch to AI products
    if (batchNum < 8) {
      // Show 1 Zo product per batch for the first 8 batches
      const zoProduct = await fetchPersonalizedProduct(onboardingAnswers, batchNum);
      productItems = [{
        type: 'suggestedProduct' as const,
        id: `zo-product-${batchNum}-${zoProduct.id}`,
        data: zoProduct
      }];
    } else {
      // After all 8 Zo products are shown, show 2 AI products per batch
      const aiProducts = await fetchAiProducts(onboardingAnswers, batchNum);
      productItems = aiProducts.map((product, index) => ({
        type: 'suggestedProduct' as const,
        id: `ai-product-${batchNum}-${index + 1}-${product.id}`,
        data: product
      }));
    }

    // Fetch other content - generate unique insight for each batch
    const [insight, topic, community] = await Promise.all([
      fetchPersonalizedInsight({ ...onboardingAnswers, batchIndex: batchNum }), // Pass batch index to ensure uniqueness
      fetchPersonalizedTopic(onboardingAnswers),
      fetchAiCommunityPost(onboardingAnswers, batchNum), // Fetch AI-generated community post
    ]);
    
    const communityId = `community-${batchNum + 1}`;
    
    return [
      { type: 'aiInsight', id: `insight-${batchNum + 1}-${insight.id}`, data: insight },
      { type: 'friendActivity', id: communityId, data: { ...community, id: communityId } },
      { type: 'suggestedTopic', id: `topic-${batchNum + 1}-${topic.id}`, data: topic },
      ...productItems, // This will be either 1 Zo product or 2 AI products
    ];
  };

  useEffect(() => {
    const isOnboarded = localStorage.getItem('isOnboarded');
    if (!isOnboarded) {
      router.replace('/launch');
    } else {
      setIsLoadingRedirect(false);
      setOnboardingAnswers(JSON.parse(localStorage.getItem('onboardingAnswers') || '{}'));
    }
  }, [router]);

  // Initial load: greeting, tracking, and first batch
  useEffect(() => {
    if (!isLoadingRedirect && onboardingAnswers) {
      (async () => {
        setLoadingAI(true);
        const currentTimePeriod = getCurrentTimePeriod();

        // --- LLM Prioritization for tracking questions ---
        // Use cached priorities for all time periods
        const cacheKey = 'trackingQuestionPriorities';
        let allPriorities: Record<string, Record<string, 'high' | 'medium' | 'low'>> = {};
        try {
          allPriorities = JSON.parse(localStorage.getItem(cacheKey) || '{}');
        } catch {}
        let prioritiesMap: Record<string, 'high' | 'medium' | 'low'> = allPriorities[currentTimePeriod] || {};
        if (!Object.keys(prioritiesMap).length) {
          // Gather all tracking questions for this time period
          const timeTasks: TrackingQuestionForLLM[] = [];
          const categoryMapping: Record<string, string> = {
            'Digestive Health': 'digestive-health-&-symptoms',
            'Medication & Supplement Use': 'medication-&-supplement-use',
            'Nutrition & Diet Habits': 'diet-&-nutrition',
            'Personalized Goals & Achievements': 'lifestyle-factors',
            'Physical Activity & Movement': 'lifestyle-factors',
            'Stress, Sleep, and Recovery': 'sleep-&-recovery',
          };
          Object.entries(trackingQuestions).forEach(([category, questions]) => {
            questions.forEach((q: any) => {
              const assignedTime = getQuestionTime(q.id, q.timeOfDay);
              if (assignedTime === currentTimePeriod.charAt(0).toUpperCase() + currentTimePeriod.slice(1)) {
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
          try {
            const res = await fetch('/api/ai-prioritize-tracking-questions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ onboardingAnswers, trackingQuestions: timeTasks }),
            });
            const prioritiesArr = await res.json();
            prioritiesMap = {};
            if (Array.isArray(prioritiesArr)) {
              prioritiesArr.forEach((item) => {
                if (item && typeof item.id === 'string' && ['high', 'medium', 'low'].includes(item.priority)) {
                  prioritiesMap[item.id] = item.priority;
                }
              });
            }
            // Save/merge to cache for all time periods
            allPriorities[currentTimePeriod] = prioritiesMap;
            localStorage.setItem(cacheKey, JSON.stringify(allPriorities));
          } catch (e) {
            // fallback: all medium
            timeTasks.forEach((q) => { prioritiesMap[q.id] = 'medium'; });
            allPriorities[currentTimePeriod] = prioritiesMap;
            localStorage.setItem(cacheKey, JSON.stringify(allPriorities));
          }
        }
        setTrackingPriorities(prioritiesMap);
        // --- END LLM Prioritization ---

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
          } as any,
        };
        const firstBatch = await generateFeedBatch(0);
        setFeedItems([greeting, timeTrackingCard, ...firstBatch]);
        setBatchIndex(1);
        setLoadingAI(false);
      })();
    }
  }, [isLoadingRedirect, onboardingAnswers]);

  // Listen for trackingAnswersChanged and refresh tracking priorities/feed
  useEffect(() => {
    const handleTrackingAnswersChanged = () => {
      // Re-run the same logic as initial load to update priorities and feed
      (async () => {
        setLoadingAI(true);
        const currentTimePeriod = getCurrentTimePeriod();
        const cacheKey = 'trackingQuestionPriorities';
        let allPriorities: Record<string, Record<string, 'high' | 'medium' | 'low'>> = {};
        try {
          allPriorities = JSON.parse(localStorage.getItem(cacheKey) || '{}');
        } catch {}
        let prioritiesMap: Record<string, 'high' | 'medium' | 'low'> = allPriorities[currentTimePeriod] || {};
        setTrackingPriorities(prioritiesMap);
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
          } as any,
        };
        const firstBatch = await generateFeedBatch(0);
        setFeedItems([greeting, timeTrackingCard, ...firstBatch]);
        setBatchIndex(1);
        setLoadingAI(false);
      })();
    };
    window.addEventListener('trackingAnswersChanged', handleTrackingAnswersChanged);
    return () => {
      window.removeEventListener('trackingAnswersChanged', handleTrackingAnswersChanged);
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

  if (isLoadingRedirect || loadingAI && feedItems.length === 0) {
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
            loader={<p className="text-center text-muted-foreground">Loading more...</p>}
          >
            <div className="space-y-6 sm:space-y-8">
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
