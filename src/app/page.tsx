
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TrendingUp, CheckCircle2, Clock, Star, Coffee, Droplets, ListChecks, BookOpen, Settings, PlusCircle, Edit3 } from 'lucide-react';
import { RecommendedLearningCard } from './components/RecommendedLearningCard'; // Keep this as it's in the mock

// Placeholder data for Home Feed
const homeFeedData = {
  greeting: "Good morning, Alex! 🌅",
  wearableSync: "Your wearable synced: 7h 15m sleep (11:15 PM - 6:30 AM).",
  accomplishment: "You hit your sleep duration goal! 🎉",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-6 sm:py-12">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">

          {/* Card 1: Greeting & Sleep Accomplishment */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-headline text-primary">{homeFeedData.greeting}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90">{homeFeedData.wearableSync}</p>
              <p className="text-green-600 font-semibold mt-1">{homeFeedData.accomplishment}</p>
            </CardContent>
          </Card>

          {/* Card 2: Tracking Prompt - Sleep Quality & Naps */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary flex items-center">
                <Clock className="mr-2 h-5 w-5 text-accent" /> Your Rest
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-foreground/90 mb-2">How would you rate your sleep quality? (Ref: 3.5)</p>
                <div className="flex space-x-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <Button key={rating} variant="outline" size="sm" className="flex-1">
                      {Array(rating).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                      {Array(5-rating).fill(0).map((_, i) => <Star key={i+rating} className="h-4 w-4 text-muted-foreground" />)}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">Sleep Quality: Good ✅</p>
              </div>
              <Separator />
              <div>
                <p className="text-foreground/90 mb-2">Did you take any naps or rest periods yesterday? (Ref: 3.6)</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">Yes</Button>
                  <Button variant="default" size="sm" className="flex-1">No</Button>
                </div>
                 <p className="text-xs text-muted-foreground mt-1 text-right">Naps Yesterday: No ✅</p>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Tracking Prompt - Morning Mood & Water Start */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-accent" /> Morning Check-in
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-foreground/90 mb-2">How would you rate your mood this morning? (Ref: 4.4)</p>
                {/* Placeholder for emoji scale or options */}
                <div className="flex justify-around">
                    <span>😊</span><span>🙂</span><span>😐</span><span>😟</span><span>😩</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">Mood: Good ✅</p>
              </div>
              <Separator />
              <div>
                <p className="text-foreground/90 mb-2">Let's start tracking your hydration: How much water did you drink so far today? (Ref: 1.1)</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">+8oz</Button>
                  <Button variant="outline" size="sm">+16oz</Button>
                  {/* Placeholder for input field */}
                </div>
                 <p className="text-xs text-muted-foreground mt-1 text-right">Water: 16oz ✅</p>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Learning Recommendation */}
          <RecommendedLearningCard />


          {/* Card 5: Gentle Reminder - Supplements */}
          <Card className="shadow-lg bg-secondary/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary">Remember to log any supplements you take today. (Ref: 1.2)</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/track#diary-medication-&-supplement-use">
                    <Edit3 className="mr-2 h-4 w-4" /> Log Supplements
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Add Teaser to full Track Page */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
                <Link href="/track" className="flex items-center justify-center text-primary hover:text-accent font-semibold">
                    <ListChecks className="mr-2 h-5 w-5" />
                    View Full Daily Diary / Log More
                </Link>
            </CardContent>
          </Card>

        </div>
      </main>
      <footer className="text-center py-8 mt-8 sm:mt-12">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Podium. Stay Active, Stay Inspired.</p>
      </footer>
    </div>
  );
}
