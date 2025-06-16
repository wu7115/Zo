// src/app/components/DynamicFeedCard.tsx
import type { FeedItem } from '@/app/types/feed';
import { UserActivityCard } from './UserActivityCard';
import { FriendActivityCard } from './FriendActivityCard';
import { TodaysGoalCard } from './TodaysGoalCard';
import { WeeklySnapshotCard } from './WeeklySnapshotCard';
import { EngagementNudgeCard } from './EngagementNudgeCard';
import { RecommendedLearningCard } from './RecommendedLearningCard';
import { ProductRecommendationsCard } from './ProductRecommendationsCard';
import { GreetingCard } from './GreetingCard';

interface DynamicFeedCardProps {
  item: FeedItem;
}

export function DynamicFeedCard({ item }: DynamicFeedCardProps) {
  switch (item.type) {
    case 'greeting':
      return <GreetingCard data={item.data} />;
    case 'weeklySnapshot':
      return <WeeklySnapshotCard />; // Assumes WeeklySnapshotCard has its own data
    case 'todaysGoal':
      return <TodaysGoalCard />; // Assumes TodaysGoalCard fetches its own data
    case 'engagementNudge':
      return <EngagementNudgeCard />; // Static card
    case 'userActivity':
      // UserActivityCard currently renders its own static content.
      // To make it truly dynamic with item.data, UserActivityCard needs prop-based rendering.
      // console.log("Rendering UserActivityCard with (currently unused) data:", item.data);
      return <UserActivityCard />;
    case 'friendActivity':
      // FriendActivityCard currently renders its own static content.
      // console.log("Rendering FriendActivityCard with (currently unused) data:", item.data);
      return <FriendActivityCard />;
    case 'recommendedLearning':
      return <RecommendedLearningCard />; // Assumes RecommendedLearningCard fetches/contains its own items
    case 'productRecommendations':
      return <ProductRecommendationsCard />; // Assumes ProductRecommendationsCard fetches/contains its own items
    default:
      // Exhaustive check to ensure all types are handled.
      // If TypeScript complains here, it means a new FeedItem type was added without a case.
      const _exhaustiveCheck: never = item;
      console.warn('Unhandled feed item type:', _exhaustiveCheck);
      return null;
  }
}
