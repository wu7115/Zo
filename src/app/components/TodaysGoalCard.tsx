'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Target, AlertTriangle, Lightbulb } from "lucide-react";
import { suggestDailyGoal, type SuggestDailyGoalOutput } from '@/ai/flows/suggest-daily-goal';
import { Skeleton } from '@/components/ui/skeleton';

export function TodaysGoalCard() {
  const [goalData, setGoalData] = useState<SuggestDailyGoalOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoal = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userProfile = "Loves cardio, wants to improve stamina, busy schedule on weekdays. Prefers outdoor activities.";
      const pastActivity = "Last week: 2x 30min runs, 1x 45min cycling. Average sleep 6 hours. Reported feeling tired on Wednesday.";
      const result = await suggestDailyGoal({ userProfile, pastActivity });
      setGoalData(result);
    } catch (e) {
      setError("Failed to suggest a goal. Please try again later.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, []);

  return (
    <Card className="shadow-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Target className="h-6 w-6" />
          <CardTitle className="text-xl font-headline">Today's Focus</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && (
          <>
            <Skeleton className="h-6 w-3/4 bg-primary-foreground/30" />
            <Skeleton className="h-4 w-full bg-primary-foreground/30" />
            <Skeleton className="h-4 w-5/6 bg-primary-foreground/30" />
          </>
        )}
        {error && !isLoading && (
          <div className="flex items-center space-x-2 text-destructive-foreground bg-destructive/80 p-3 rounded-md">
            <AlertTriangle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}
        {!isLoading && !error && goalData && (
          <>
            <CardDescription className="text-lg font-semibold text-primary-foreground">
              {goalData.goal}
            </CardDescription>
            <div className="flex items-start space-x-2 pt-1 text-sm text-primary-foreground/90">
              <Lightbulb className="h-5 w-5 shrink-0 mt-0.5" />
              <p>{goalData.reason}</p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button variant="secondary" size="sm" onClick={fetchGoal} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
          Suggest Again
        </Button>
        <Button variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" size="sm">
          Customize Goal
        </Button>
      </CardFooter>
    </Card>
  );
}
