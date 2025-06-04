import { WeeklySnapshotCard } from './components/WeeklySnapshotCard';
import { TodaysGoalCard } from './components/TodaysGoalCard';
import { EngagementNudgeCard } from './components/EngagementNudgeCard';
import { RecommendedLearningCard } from './components/RecommendedLearningCard';
import { UserActivityCard } from './components/UserActivityCard';
import { FriendActivityCard } from './components/FriendActivityCard';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-6 sm:py-12">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
          <TodaysGoalCard />
          <WeeklySnapshotCard />
          <EngagementNudgeCard />
          <UserActivityCard />
          <FriendActivityCard />
          <RecommendedLearningCard />
        </div>
      </main>
      <footer className="text-center py-8 mt-8 sm:mt-12">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Podium Pulse. Stay Active, Stay Inspired.</p>
      </footer>
    </div>
  );
}
