
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TrendingUp, Clock, Star, Coffee, Droplets, ListChecks, BookOpen, Settings, PlusCircle, Edit3 } from 'lucide-react';
import { RecommendedLearningCard } from './components/RecommendedLearningCard';
import { useState } from 'react';
import { cn } from '@/lib/utils';


// Placeholder data for Home Feed
const homeFeedData = {
  greeting: "Good morning, Alex! 🌅",
  wearableSync: "Your wearable synced: 7h 15m sleep (11:15 PM - 6:30 AM).",
  accomplishment: "You hit your sleep duration goal! 🎉",
};

export default function HomePage() {
  const [selectedSleepQuality, setSelectedSleepQuality] = useState<number | null>(null);
  const [napsTaken, setNapsTaken] = useState<string | null>("No"); // Default based on mockup
  const [morningMood, setMorningMood] = useState<string | null>("Good"); // Default based on mockup
  const [waterIntake, setWaterIntake] = useState<string>("16oz"); // Default based on mockup

  const handleSleepQualitySelect = (rating: number) => {
    setSelectedSleepQuality(rating);
    // In a real app, you would log this data
    console.log(`Sleep quality rated: ${rating}`);
  };

  const handleNapSelect = (option: 'Yes' | 'No') => {
    setNapsTaken(option);
    // In a real app, log this
    console.log(`Naps taken: ${option}`);
  };
  
  const moodOptions = [
    { emoji: '😊', label: 'Excellent' },
    { emoji: '🙂', label: 'Good' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😟', label: 'Low' },
    { emoji: '😩', label: 'Very Low' },
  ];

  const handleMoodSelect = (mood: string) => {
    setMorningMood(mood);
    console.log(`Morning mood: ${mood}`);
  };

  const handleWaterIntake = (amount: string) => {
    // This is simplified; a real app might parse and sum amounts
    setWaterIntake(amount); 
    console.log(`Water intake: ${amount}`);
  };


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
                <div className="flex space-x-1 justify-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={`sleep-rating-${rating}`}
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "p-0 text-muted-foreground hover:text-yellow-500",
                        selectedSleepQuality !== null && rating <= selectedSleepQuality ? "text-yellow-400" : ""
                      )}
                      onClick={() => handleSleepQualitySelect(rating)}
                    >
                      <Star className={cn("h-6 w-6", selectedSleepQuality !== null && rating <= selectedSleepQuality ? "fill-yellow-400" : "fill-transparent")} />
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  Sleep Quality: {selectedSleepQuality ? `${selectedSleepQuality}/5 ⭐` : 'Pending'}
                  {selectedSleepQuality && ' ✅'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-foreground/90 mb-2">Did you take any naps or rest periods yesterday? (Ref: 3.6)</p>
                <div className="flex space-x-2">
                  <Button variant={napsTaken === 'Yes' ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => handleNapSelect('Yes')}>Yes</Button>
                  <Button variant={napsTaken === 'No' ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => handleNapSelect('No')}>No</Button>
                </div>
                 <p className="text-xs text-muted-foreground mt-1 text-right">
                  Naps Yesterday: {napsTaken || 'Pending'}
                  {napsTaken && ' ✅'}
                </p>
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
                <div className="flex justify-around text-2xl">
                    {moodOptions.map(opt => (
                         <Button
                            key={opt.label}
                            variant="ghost"
                            size="icon"
                            className={cn("hover:bg-accent/10", morningMood === opt.label ? "bg-accent/20 ring-2 ring-accent" : "")}
                            onClick={() => handleMoodSelect(opt.label)}
                            title={opt.label}
                         >
                            {opt.emoji}
                        </Button>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  Mood: {morningMood || 'Pending'}
                  {morningMood && ' ✅'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-foreground/90 mb-2">Let's start tracking your hydration: How much water did you drink so far today? (Ref: 1.1)</p>
                <div className="flex space-x-2">
                  <Button variant={waterIntake === '8oz' ? 'default' : 'outline'} size="sm" onClick={() => handleWaterIntake('8oz')}>+8oz</Button>
                  <Button variant={waterIntake === '16oz' ? 'default' : 'outline'} size="sm" onClick={() => handleWaterIntake('16oz')}>+16oz</Button>
                  {/* Basic input for custom amount - can be enhanced */}
                  {/* <Input type="text" placeholder="Or enter amount" className="flex-1 h-9 text-sm" onChange={(e) => handleWaterIntake(e.target.value)} /> */}
                </div>
                 <p className="text-xs text-muted-foreground mt-1 text-right">
                  Water: {waterIntake || 'Pending'}
                  {waterIntake && ' ✅'}
                </p>
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
                <Link href="/track#diary" className="flex items-center justify-center text-primary hover:text-accent font-semibold">
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

