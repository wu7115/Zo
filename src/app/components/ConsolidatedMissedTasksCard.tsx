'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackingQuestions } from '@/data/trackingQuestions';
import { getQuestionTime } from '@/utils/taskAllocation';
import { useTrackingData } from '@/hooks/use-tracking-data';

interface ConsolidatedMissedTasksCardProps {
  currentTimeOfDay: 'morning' | 'afternoon' | 'evening';
  priorities?: Record<string, 'high' | 'medium' | 'low'>;
}

const getTimePeriodName = (time: 'morning' | 'afternoon' | 'evening'): string => {
  switch (time) {
    case 'morning': return 'Morning';
    case 'afternoon': return 'Afternoon';
    case 'evening': return 'Evening';
  }
};

const getTimeColor = (time: 'morning' | 'afternoon' | 'evening') => {
  switch (time) {
    case 'morning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'afternoon': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'evening': return 'bg-purple-100 text-purple-800 border-purple-200';
  }
};

export function ConsolidatedMissedTasksCard({ currentTimeOfDay, priorities }: ConsolidatedMissedTasksCardProps) {
  const { dailyAnswers } = useTrackingData();
  const [missedTasksByPeriod, setMissedTasksByPeriod] = useState<Record<string, number>>({});
  const [totalMissedTasks, setTotalMissedTasks] = useState(0);

  useEffect(() => {
    calculateMissedTasks(dailyAnswers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyAnswers, currentTimeOfDay]);

  const calculateMissedTasks = (answers: Record<string, any>) => {
    const categoryMapping = {
      'Digestive Health': 'digestive-health-&-symptoms',
      'Medication & Supplement Use': 'medication-&-supplement-use',
      'Nutrition & Diet Habits': 'diet-&-nutrition',
      'Personalized Goals & Achievements': 'personalized-goals-&-achievements',
      'Physical Activity & Movement': 'physical-activity-&-movement',
      'Stress, Sleep, and Recovery': 'sleep-&-recovery',
    };
    // Determine which time periods to check based on current time
    const timePeriodsToCheck: ('morning' | 'afternoon' | 'evening')[] = [];
    if (currentTimeOfDay === 'afternoon') {
      timePeriodsToCheck.push('morning');
    } else if (currentTimeOfDay === 'evening') {
      timePeriodsToCheck.push('morning', 'afternoon');
    }
    const missedByPeriod: Record<string, number> = {};
    Object.entries(trackingQuestions).forEach(([category, questions]) => {
      questions.forEach((q: any) => {
        const assignedTime = getQuestionTime(q.id, q.timeOfDay);
        const taskTime = assignedTime === 'Morning' ? 'morning' : assignedTime === 'Afternoon' ? 'afternoon' : assignedTime === 'Evening' ? 'evening' : null;
        // Only check tasks from previous time periods
        if (taskTime && timePeriodsToCheck.includes(taskTime)) {
          const categoryId = categoryMapping[category as keyof typeof categoryMapping] || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const taskId = `${categoryId}__${q.id}`;
          // Check if task is missed (not answered)
          const isAnswered = answers[taskId] !== undefined && answers[taskId] !== '';
          if (!isAnswered) {
            missedByPeriod[taskTime] = (missedByPeriod[taskTime] || 0) + 1;
          }
        }
      });
    });
    setMissedTasksByPeriod(missedByPeriod);
    setTotalMissedTasks(Object.values(missedByPeriod).reduce((sum, count) => sum + count, 0));
  };

  const handleGoToTrack = () => {
    window.location.href = '/track';
  };

  // Don't render if no missed tasks
  if (totalMissedTasks === 0) {
    return (
      <Card className="tracking-questions-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <CardTitle className="text-xl font-headline text-primary">
              All Caught Up! 🎉
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Great job! You've completed all your tasks from earlier today. Keep up the excellent work!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="tracking-questions-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-xl font-headline text-primary">
              Missed Tasks
            </CardTitle>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
            {totalMissedTasks} pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {Object.entries(missedTasksByPeriod).map(([period, count]) => (
              <div key={period} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className={cn('text-xs', getTimeColor(period as 'morning' | 'afternoon' | 'evening'))}
                  >
                    {getTimePeriodName(period as 'morning' | 'afternoon' | 'evening')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {count} task{count !== 1 ? 's' : ''} missed
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-2">
            <Button 
              onClick={handleGoToTrack}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Go and Complete
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Complete these tasks to stay on track with your health goals
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 