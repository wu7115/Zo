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
import { TimeBasedTrackingCard } from './TimeBasedTrackingCard';
import { AiInsightCard } from './AiInsightCard';
import { SuggestedTopicCard } from './SuggestedTopicCard';
import { SuggestedProductCard } from './SuggestedProductCard';
import { ConsolidatedMissedTasksCard } from './ConsolidatedMissedTasksCard';
import { PostsSection } from './PostsSection';
import { LearnArticleFeedData } from '@/app/types/feed';

interface DynamicFeedCardProps {
  item: FeedItem;
}

interface TimeBasedTrackingFeedData {
  id: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  priorities?: Record<string, 'high' | 'medium' | 'low'>;
  anytimeAllocation?: Record<string, string>;
}

function LearnArticleCard({ data }: { data: LearnArticleFeedData }) {
  return (
    <div className="p-4 border rounded-lg bg-card shadow flex flex-col items-start">
      <h3 className="font-bold text-lg mb-2">{data.title}</h3>
      {data.imageUrl && (
        <img src={data.imageUrl} alt={data.title} className="mb-2 rounded w-full max-w-xs" />
      )}
      <p className="text-sm text-muted-foreground mb-2">{data.snippet}</p>
      <a href={data.link} target="_blank" rel="noopener noreferrer" className="text-primary underline mt-2">Read more</a>
    </div>
  );
}

export function DynamicFeedCard({ item }: DynamicFeedCardProps) {
  switch (item.type) {
    case 'greeting':
      return <GreetingCard data={item.data} />;
    case 'morningTracking':
      return <TimeBasedTrackingCard {...(item.data as TimeBasedTrackingFeedData)} />;
    case 'afternoonTracking':
      return <TimeBasedTrackingCard {...(item.data as TimeBasedTrackingFeedData)} />;
    case 'eveningTracking':
      return <TimeBasedTrackingCard {...(item.data as TimeBasedTrackingFeedData)} />;
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
      return <FriendActivityCard data={item.data} />;
    case 'recommendedLearning':
      // Pass Firestore articles if present
      return <RecommendedLearningCard articles={item.data.articles} />;
    case 'productRecommendations':
      return <ProductRecommendationsCard />; // Assumes ProductRecommendationsCard fetches/contains its own items
    case 'aiInsight':
      return <AiInsightCard data={item.data} />;
    case 'suggestedTopic':
      return <SuggestedTopicCard data={item.data} />;
    case 'suggestedProduct':
      return <SuggestedProductCard data={item.data} />;
    case 'consolidatedMissedTasks':
      return <ConsolidatedMissedTasksCard currentTimeOfDay={item.data.currentTimeOfDay} priorities={item.data?.priorities} />;
    case 'postsSection':
      return <PostsSection />;
    default:
      // Exhaustive check to ensure all types are handled.
      // If TypeScript complains here, it means a new FeedItem type was added without a case.
      const _exhaustiveCheck: never = item;
      console.warn('Unhandled feed item type:', _exhaustiveCheck);
      return null;
  }
}
