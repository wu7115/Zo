
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { FeedItem } from '@/app/types/feed'; // Import the FeedItem type
import { DynamicFeedCard } from './components/DynamicFeedCard'; // Import the dynamic card renderer

// Mock data for the feed - this would eventually come from an API or state management
const mockFeedItems: FeedItem[] = [
  {
    type: 'greeting',
    id: 'greeting-1',
    data: {
      id: 'greeting-1',
      greetingText: "Good morning, Alex! 🌅",
      syncStatus: "Your wearable synced: 7h 15m sleep (11:15 PM - 6:30 AM).",
      accomplishment: "You hit your sleep duration goal! 🎉",
    },
  },
  {
    type: 'weeklySnapshot',
    id: 'weekly-snapshot-1',
    data: { id: 'weekly-snapshot-1' },
  },
  {
    type: 'todaysGoal',
    id: 'todays-goal-1',
    data: { id: 'todays-goal-1' },
  },
  {
    type: 'engagementNudge',
    id: 'engagement-nudge-1',
    data: { id: 'engagement-nudge-1' },
  },
  {
    type: 'userActivity',
    id: 'user-activity-1',
    data: { // This data is structured but UserActivityCard isn't using it yet
      id: 'user-activity-1',
      timestamp: "2 hours ago",
      activityType: "Evening Run",
      details: "Completed a 5km run through the park. Felt invigorating!",
      metrics: [
        { iconName: "Zap", label: "Distance", value: "5 km" },
        { iconName: "Flame", label: "Calories", value: "350 kcal" },
        { iconName: "Smile", label: "Mood", value: "Energized" },
      ],
    },
  },
  {
    type: 'friendActivity',
    id: 'friend-activity-1',
    data: { // This data is structured but FriendActivityCard isn't using it yet
      id: 'friend-activity-1',
      friendName: "Jane Runner",
      friendAvatarUrl: "https://placehold.co/40x40.png?text=JR",
      friendAvatarFallback: "JR",
      timestamp: "Yesterday, 6:30 PM",
      activityDetails: "Just crushed a 20km bike ride! Feeling fantastic. 🚴‍♀️ #CyclingLife",
      activityImageUrl: "https://placehold.co/600x400.png",
      activityImageAlt: "Friend's cycling activity post",
      activityImageHint: "cycling landscape",
      likes: 15,
      comments: 3,
    },
  },
  {
    type: 'recommendedLearning',
    id: 'recommended-learning-1',
    data: { id: 'recommended-learning-1' },
  },
  {
    type: 'productRecommendations',
    id: 'product-recommendations-1',
    data: { id: 'product-recommendations-1' },
  },
  // Add more mock items here to test different card types and ordering
];


export default function HomePage() {
  const router = useRouter();
  const [isLoadingRedirect, setIsLoadingRedirect] = useState(true);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    const isOnboarded = localStorage.getItem('isOnboarded');
    if (!isOnboarded) {
      router.replace('/launch');
    } else {
      setIsLoadingRedirect(false);
      // Simulate fetching feed data
      setFeedItems(mockFeedItems);
    }
  }, [router]);

  if (isLoadingRedirect) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-6 sm:py-12">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
          {feedItems.map((item) => (
            <DynamicFeedCard key={item.id} item={item} />
          ))}
        </div>
      </main>
      <footer className="text-center py-8 mt-8 sm:mt-12">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Podium. Stay Active, Stay Inspired.</p>
      </footer>
    </div>
  );
}
