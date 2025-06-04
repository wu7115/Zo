import { WeeklySnapshotCard } from './components/WeeklySnapshotCard';
import { TodaysGoalCard } from './components/TodaysGoalCard';
import { EngagementNudgeCard } from './components/EngagementNudgeCard';
import { RecommendedLearningCard } from './components/RecommendedLearningCard';
import { UserActivityCard } from './components/UserActivityCard';
import { FriendActivityCard } from './components/FriendActivityCard';
import { Activity } from 'lucide-react'; // Generic icon for title

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-6 sm:py-12">
      <header className="mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary text-center flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 sm:w-12 sm:h-12 mr-3 text-accent"
            aria-hidden="true"
          >
            <path d="M12.0001 1.5C12.5397 1.5 12.9839 1.90341 13.0492 2.43535L13.3214 4.99994H16.5001C17.0524 4.99994 17.5001 5.44765 17.5001 5.99994C17.5001 6.10149 17.4848 6.20121 17.4551 6.29606L16.0621 10.8038C16.0039 11.0003 15.8631 11.167 15.6763 11.266L12.5001 13.066V20.5H14.0001C14.5524 20.5 15.0001 20.9477 15.0001 21.5C15.0001 22.0522 14.5524 22.5 14.0001 22.5H10.0001C9.44778 22.5 9.00006 22.0522 9.00006 21.5C9.00006 20.9477 9.44778 20.5 10.0001 20.5H11.5001V13.066L8.32384 11.266C8.13711 11.167 7.99626 11.0003 7.93804 10.8038L6.54505 6.29606C6.51536 6.20121 6.50006 6.10149 6.50006 5.99994C6.50006 5.44765 6.94778 4.99994 7.50006 4.99994H10.6788L10.951 2.43535C11.0162 1.90341 11.4605 1.5 12.0001 1.5ZM11.5001 6.49994H8.0716L9.19097 10.203L11.5001 11.566V6.49994ZM12.5001 6.49994V11.566L14.8092 10.203L15.9286 6.49994H12.5001Z"></path>
          </svg>
          Podium Pulse
        </h1>
        <p className="text-center text-muted-foreground mt-2 text-sm sm:text-base">Your daily dash to wellness and achievement.</p>
      </header>
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
