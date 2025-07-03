'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowLeft, BookOpenText, FileText, Podcast, PlayCircle, Bell, Menu, Plus } from 'lucide-react';
import * as React from 'react';
import { ItemDetailModal, type ModalItemData } from '@/app/components/ItemDetailModal';
import { AiPencilPanel } from '../components/AiPencilPanel';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { loadUserLearnArticles, addUserLearnArticles } from '@/lib/trackingService';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';

interface LearnItemData {
  id: string;
  title: string;
  snippet: string; // Used as description
  source?: string;
  duration?: string;
  type?: string; // e.g. article, video, podcast
  imageUrl: string;
  imageHint: string;
  link: string; // Link for card navigation
  category: string; // Main category like 'Articles', 'Podcasts'
}

interface LearnCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  items: LearnItemData[];
  defaultOpen?: boolean;
}

// Remove useSharedAiLearningFeed and all localStorage usage for articles
// Only use Firestore for reading articles

const learnCategories: LearnCategory[] = [
  {
    id: 'articles',
    title: 'Articles',
    icon: FileText,
    defaultOpen: true,
    items: [], // Will be populated dynamically with AI content
  },
  {
    id: 'podcasts',
    title: 'Podcasts',
    icon: Podcast,
    items: [
      { id: 'podcast-gut-health', title: 'The Gut Health Podcast Ep. 12', snippet: 'Discussion with Dr. Anya Sharma on fermented foods.', duration: '45 min', source: 'Gut Talks', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'podcast microphone', link: '#', category: 'Podcast', type: 'Podcast' },
      { id: 'podcast-sleep', title: 'Wellness Unpacked: Sleep', snippet: 'Exploring the critical link between quality sleep and digestion.', duration: '30 min', source: 'Holistic Health Radio', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'sleep podcast', link: '#', category: 'Podcast', type: 'Podcast' },
      { id: 'podcast-biohacking', title: 'Biohacking Your Gut', snippet: 'Tips and tricks from experts on optimizing digestive health.', duration: '55 min', source: 'The Optimal Human', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'biohacking tech', link: '#', category: 'Podcast', type: 'Podcast' },
    ],
  },
  {
    id: 'videos',
    title: 'Videos',
    icon: PlayCircle,
    items: [
      { id: 'video-digestion-guide', title: 'Animated Guide to Digestion', snippet: 'A visual journey through how your body processes food.', duration: '10 min', source: 'Science Explained YT', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'animation digestive system', link: '#', category: 'Video', type: 'Video' },
      { id: 'video-cooking-demo', title: 'Cooking for Gut Health Demo', snippet: 'Chef Leo prepares a delicious and gut-friendly meal.', duration: '15 min', source: 'HealthyEats TV', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'cooking show', link: '#', category: 'Video', type: 'Video' },
      { id: 'video-yoga-flow', title: 'Yoga for Digestion Flow', snippet: 'Follow along with this sequence to aid digestion and reduce bloating.', duration: '20 min', source: 'FlowWithGrace', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'yoga pose', link: '#', category: 'Video', type: 'Video' },
    ],
  },
  {
    id: 'partner-content',
    title: 'Partner Content',
    icon: FileText,
    items: [
      { id: 'partner-viome-guide', title: "Viome's Guide to Nutrition", snippet: 'Learn how Viome tailors recommendations.', type: 'Article Series', source: 'Viome', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'nutrition science', link: '#', category: 'Partner Content' },
      { id: 'partner-zobiome-webinar', title: 'ZoBiome Webinar: Gut Score', snippet: 'An expert-led session on understanding your results.', type: 'Webinar Recording', source: 'ZoBiome Inc.', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'webinar presentation', link: '#', category: 'Partner Content' },
      { id: 'partner-mbt-offer', title: 'MBT Test Kits Offer', snippet: 'A limited-time promotion for Podium users.', type: 'Promotion', source: 'MBT Labs', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'discount offer', link: '#', category: 'Partner Content' },
    ],
  },
];

// Helper to delete all learn articles for the current user
async function deleteAllLearnArticles(userId: string) {
  const db = getFirestore();
  const articlesRef = collection(db, 'users', userId, 'learnArticles');
  const snap = await getDocs(articlesRef);
  const deletePromises = snap.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}

export default function LearnPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = React.useState<ModalItemData | null>(null);
  const currentUserContext = "interested in learning more about wellness"; // Example context

  // Auth state
  const [user, setUser] = React.useState<any>(null);
  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Onboarding answers (for LLM context)
  const [onboardingAnswers, setOnboardingAnswers] = React.useState<any>({});
  React.useEffect(() => {
    setOnboardingAnswers(JSON.parse(localStorage.getItem('onboardingAnswers') || '{}'));
  }, []);

  // LLM articles from Firestore
  const [aiArticles, setAiArticles] = React.useState<any[]>([]);
  const [loadingAiArticles, setLoadingAiArticles] = React.useState(false);

  // Load all LLM articles from Firestore
  const loadArticlesFromDB = React.useCallback(async () => {
    if (!user) return;
    setLoadingAiArticles(true);
    const articles = await loadUserLearnArticles(user.uid);
    setAiArticles(articles);
    setLoadingAiArticles(false);
  }, [user]);

  React.useEffect(() => {
    if (user) {
      loadArticlesFromDB().then(() => {
        console.log('LearnPage: loaded articles', aiArticles, 'for user', user?.uid);
      });
    }
  }, [user, loadArticlesFromDB]);

  // Trigger LLM and store new articles in Firestore
  const handleFetchMoreArticles = async () => {
    if (!user) return;
    setLoadingAiArticles(true);
    try {
      const res = await fetch('/api/ai-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingAnswers, batchIndex: aiArticles.length }),
      });
      const newTopic = await res.json();
      // Convert AI topic to LearnItemData format
      const newLearningItem = {
        id: newTopic.id,
        title: newTopic.title,
        snippet: newTopic.description,
        source: 'AI Generated',
        type: 'Article',
        imageUrl: newTopic.imageUrl,
        imageHint: 'ai generated content',
        link: newTopic.link,
        category: 'Article',
      };
      await addUserLearnArticles(user.uid, [newLearningItem]);
      await loadArticlesFromDB();
    } catch (e) {
      // fallback: do nothing
    }
    setLoadingAiArticles(false);
  };

  // Use only LLM-generated content for articles
  const allArticles = aiArticles;

  const handleOpenModal = (item: LearnItemData) => {
    setSelectedItemForModal({
      id: item.id,
      name: item.title,
      description: item.snippet,
      imageUrl: item.imageUrl,
      imageHint: item.imageHint,
      category: item.type || item.category, // Use item.type if available, otherwise main category
    });
    setIsModalOpen(true);
  };

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-app-content overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                 <Button variant="ghost" size="icon" className="mr-2" asChild>
                  <Link href="/">
                    <ArrowLeft className="h-5 w-5 text-primary" />
                  </Link>
                </Button>
                <CardTitle className="text-2xl font-headline text-primary flex items-center">
                  <BookOpenText className="h-7 w-7 mr-2 text-accent" />
                  Learn
                </CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5 text-primary" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5 text-primary" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 pb-4">
             <Accordion type="multiple" defaultValue={learnCategories.filter(c => c.defaultOpen).map(c => c.id)} className="w-full">
              {learnCategories.map((category) => {
                // Use combined articles for the articles category
                const items = category.id === 'articles' ? allArticles : category.items;
                return (
                <AccordionItem value={category.id} key={category.id} className="mb-2 rounded-lg border bg-card overflow-hidden">
                  <AccordionTrigger className="hover:bg-muted/20 data-[state=open]:bg-muted/30 p-3 text-primary font-semibold no-underline">
                    <div className="flex items-center flex-1 text-left">
                      <category.icon className="h-5 w-5 mr-3 text-accent shrink-0" />
                      {category.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-background p-0">
                    {category.id === 'articles' ? (
                      <div className="flex flex-col items-center p-3">
                        {items.length > 0 ? (
                          <div className="flex overflow-x-auto space-x-3 w-full">
                            {items.map((item) => (
                              <Card key={item.id} className="w-[171px] h-[200px] flex-shrink-0 flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-lg border">
                                <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-[150px] relative rounded-t-lg overflow-hidden">
                                  <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    layout="fill"
                                    objectFit="cover"
                                    data-ai-hint={item.imageHint}
                                  />
                                </Link>
                                <div className="p-2 flex-grow flex flex-col justify-between items-center">
                                  <h4 className="font-semibold text-xs text-primary line-clamp-2 text-center flex-grow mb-1">{item.title}</h4>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 bg-card hover:bg-muted/50 text-primary rounded-full p-1 self-end shrink-0 border-primary/50"
                                    onClick={() => handleOpenModal(item)}
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center w-full">
                            <p className="text-sm text-muted-foreground mb-2">No articles yet. Click '+ More' to generate recommendations!</p>
                          </div>
                        )}
                        <Button onClick={handleFetchMoreArticles} disabled={loadingAiArticles} className="min-w-[120px] h-[200px] mt-2 flex-shrink-0 flex flex-col items-center justify-center border-dashed border-2 border-primary/30 bg-muted/30 hover:bg-muted/50">
                          {loadingAiArticles ? 'Loading...' : '+ More'}
                        </Button>
                      </div>
                    ) : (
                      items.length > 0 ? (
                        <div className="flex overflow-x-auto space-x-3 p-3">
                          {items.map((item) => (
                            <Card key={item.id} className="w-[171px] h-[200px] flex-shrink-0 flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-lg border">
                              <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-[150px] relative rounded-t-lg overflow-hidden">
                                <Image
                                  src={item.imageUrl}
                                  alt={item.title}
                                  layout="fill"
                                  objectFit="cover"
                                  data-ai-hint={item.imageHint}
                                />
                              </Link>
                              <div className="p-2 flex-grow flex flex-col justify-between items-center">
                                <h4 className="font-semibold text-xs text-primary line-clamp-2 text-center flex-grow mb-1">{item.title}</h4>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 bg-card hover:bg-muted/50 text-primary rounded-full p-1 self-end shrink-0 border-primary/50"
                                  onClick={() => handleOpenModal(item)}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-sm text-muted-foreground">Coming soon!</p>
                        </div>
                      )
                    )}
                  </AccordionContent>
                </AccordionItem>
                );
              })}
            </Accordion>
            {user && (
              <Button
                variant="destructive"
                className="mb-4"
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete ALL your learn articles? This cannot be undone.')) {
                    await deleteAllLearnArticles(user.uid);
                    await loadArticlesFromDB();
                    alert('All learn articles deleted.');
                  }
                }}
              >
                Delete All Learn Articles (Testing)
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      <ItemDetailModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        item={selectedItemForModal}
        userContext={currentUserContext}
      />
      <AiPencilPanel page="learn" />
    </main>
  );
}
