'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ArrowLeft, FileText, Lightbulb, Loader2, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const scoreData = [
  { name: 'Lifestyle & Environment', value: 20, color: '#8884d8' }, // Light Blueish
  { name: 'Health Tracking', value: 15, color: '#82ca9d' },       // Greenish
  { name: 'Microbiome', value: 35, color: '#A0522D' },          // Brown/Maroon
  { name: 'Hydration & Diet', value: 30, color: '#FF8042' },      // Orange
];

const totalScore = scoreData.reduce((acc, curr) => acc + curr.value, 0);

const legendItems = [
  { name: 'Lifestyle & Environment', color: 'bg-[#8884d8]' },
  { name: 'Health Tracking', color: 'bg-[#82ca9d]' },
  { name: 'Microbiome', color: 'bg-[#A0522D]' },
  { name: 'Hydration & Diet', color: 'bg-[#FF8042]' },
];

export default function GutHealthScorePage() {
  const [onboardingInsight, setOnboardingInsight] = React.useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = React.useState(true);
  const [insightError, setInsightError] = React.useState<string | null>(null);

  // Debug: Track when component mounts
  React.useEffect(() => {
    // Component mounted
  }, []);

  // Debug: Track when insight changes
  React.useEffect(() => {
    // Insight changed
  }, [onboardingInsight]);

  React.useEffect(() => {
    const fetchOnboardingInsight = async () => {
      try {
        setIsLoadingInsight(true);
        setInsightError(null);
        const auth = getAuth(app);
        if (!auth.currentUser) {
          setInsightError('You must be signed in to view your insights.');
          setIsLoadingInsight(false);
          return;
        }
        const db = getFirestore(app);
        const docRef = doc(db, 'users', auth.currentUser.uid, 'onboarding', 'answers');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.initialInsight) {
            setOnboardingInsight(data.initialInsight);
          } else if (data && data.secondInsight) {
            setOnboardingInsight(data.secondInsight);
          } else {
            setInsightError('No personalized insights found. Please complete the diagnostic survey to get personalized insights.');
          }
        } else {
          setInsightError('No personalized insights found. Please complete the diagnostic survey to get personalized insights.');
        }
      } catch (error) {
        setInsightError("Sorry, I couldn't load your personalized insights right now. Please try again later.");
      } finally {
        setIsLoadingInsight(false);
      }
    };
    fetchOnboardingInsight();
  }, []);

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-app-content overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-2xl font-headline text-primary">
                Gut Health Score
              </CardTitle>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Link href="/gut-health-score/breakdown" className="block cursor-pointer">
              <div className="relative w-full h-64 md:h-72 flex items-center justify-center my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      innerRadius="70%"
                      outerRadius="100%"
                      fill="#8884d8"
                      dataKey="value"
                      stroke="hsl(var(--app-content-background))" 
                      strokeWidth={4}
                    >
                      {scoreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} itemStyle={{ color: 'hsl(var(--foreground))' }}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-5xl font-bold text-primary">{totalScore}</span>
                  <span className="text-md text-muted-foreground">Out of 100</span>
                </div>
              </div>
            </Link>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-4">
              {legendItems.map((item) => (
                <div key={item.name} className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${item.color.replace('[', '').replace(']', '')}`}></span>
                  <span className="text-xs text-foreground">{item.name}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 pt-4">
              <Button variant="outline" className="w-full justify-between items-center text-primary hover:bg-muted/50">
                Access your full Results now
                <FileText className="h-5 w-5" />
              </Button>
            </div>

            {isLoadingInsight && (
              <Card className="bg-secondary/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md font-semibold text-primary flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-accent" /> Your Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-muted" />
                  <Skeleton className="h-4 w-full bg-muted" />
                  <Skeleton className="h-4 w-5/6 bg-muted" />
                </CardContent>
              </Card>
            )}

            {insightError && !isLoadingInsight && (
              <Card className="bg-destructive/10 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md font-semibold text-destructive flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" /> Uh oh!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-destructive-foreground">{insightError}</p>
                </CardContent>
              </Card>
            )}

            {!isLoadingInsight && !insightError && onboardingInsight && (
               <Card className="bg-secondary/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md font-semibold text-primary flex items-center">
                     <Lightbulb className="h-5 w-5 mr-2 text-accent" /> Your Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-secondary-foreground leading-relaxed">{onboardingInsight}</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
