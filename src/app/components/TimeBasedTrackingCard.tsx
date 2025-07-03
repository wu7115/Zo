'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Sun, SunMedium, Moon, Coffee, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackingQuestions } from '@/data/trackingQuestions';
import { getQuestionTime } from '@/utils/taskAllocation';
import { useTrackingData } from '@/hooks/use-tracking-data';

export interface TrackingTask {
  id: string;
  question: string;
  inputType: 'number' | 'options';
  options?: string[];
  placeholder?: string;
  time: 'morning' | 'afternoon' | 'evening';
  category: string;
}

interface TimeBasedTrackingCardProps {
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  priorities?: Record<string, 'high' | 'medium' | 'low'>;
  anytimeAllocation?: Record<string, string>;
}

const getTimeIcon = (timeOfDay: string) => {
  switch (timeOfDay) {
    case 'morning': return Sun;
    case 'afternoon': return Coffee;
    case 'evening': return Moon;
    default: return Clock;
  }
};

const getTimeColor = (timeOfDay: string) => {
  switch (timeOfDay) {
    case 'morning': return 'text-yellow-600';
    case 'afternoon': return 'text-orange-600';
    case 'evening': return 'text-purple-600';
    default: return 'text-gray-600';
  }
};

const getTimeRange = (timeOfDay: string) => {
  switch (timeOfDay) {
    case 'morning': return '6 AM - 12 PM';
    case 'afternoon': return '12 PM - 6 PM';
    case 'evening': return '6 PM - 12 AM';
    default: return '';
  }
};

const renderInput = (task: TrackingTask, value: any, onChange: (val: any) => void) => {
  switch (task.inputType) {
    case 'number':
      return (
        <Input
          type="number"
          placeholder={task.placeholder}
          className="mt-2"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
      );
    case 'options':
      return (
        <div className="mt-2 space-y-2">
          {task.options?.map((option) => (
            <Button
              key={option}
              variant="outline"
              size="sm"
              className={cn(
                "w-full justify-start",
                value === option ? "bg-primary text-primary-foreground" : ""
              )}
              onClick={() => onChange(option)}
            >
              {option}
              {value === option && <CheckCircle2 className="ml-2 h-4 w-4" />}
            </Button>
          ))}
        </div>
      );
    default:
      return null;
  }
};

export function TimeBasedTrackingCard({ timeOfDay, priorities, anytimeAllocation }: TimeBasedTrackingCardProps) {
  // Use Firestore real-time data
  const { dailyAnswers, updateAnswer, isTaskCompleted, getTimePeriodPriorities } = useTrackingData();
  const [tasks, setTasks] = useState<TrackingTask[]>([]);

  useEffect(() => {
    if (!anytimeAllocation) return;
    // Generate tasks for this time of day only
    const timeTasks: TrackingTask[] = [];
    const categoryMapping = {
      'Digestive Health': 'digestive-health-&-symptoms',
      'Medication & Supplement Use': 'medication-&-supplement-use',
      'Nutrition & Diet Habits': 'diet-&-nutrition',
      'Personalized Goals & Achievements': 'personalized-goals-&-achievements',
      'Physical Activity & Movement': 'physical-activity-&-movement',
      'Stress, Sleep, and Recovery': 'sleep-&-recovery',
    };
    Object.entries(trackingQuestions).forEach(([category, questions]) => {
      questions.forEach((q: any) => {
        const assignedTime = getQuestionTime(q.id, q.timeOfDay, anytimeAllocation);
        const taskTime = assignedTime === 'Morning' ? 'morning' : assignedTime === 'Afternoon' ? 'afternoon' : assignedTime === 'Evening' ? 'evening' : null;
        if (taskTime === timeOfDay) {
          const categoryId = categoryMapping[category as keyof typeof categoryMapping] || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          timeTasks.push({
            id: `${categoryId}__${q.id}`,
            question: q.text,
            inputType: q.type === 'number' ? 'number' : 'options',
            options: q.options,
            placeholder: q.placeholder,
            time: taskTime,
            category
          });
        }
      });
    });
    // Sort by priority
    const periodPriorities = getTimePeriodPriorities(timeOfDay);
    if (periodPriorities) {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      timeTasks.sort((a, b) => {
        const aPriority = periodPriorities[a.id] ?? 'medium';
        const bPriority = periodPriorities[b.id] ?? 'medium';
        return priorityOrder[aPriority] - priorityOrder[bPriority];
      });
    }
    setTasks(timeTasks);
  }, [timeOfDay, dailyAnswers, priorities, anytimeAllocation]);

  const handleAnswerChange = (taskId: string, value: any) => {
    updateAnswer(taskId, value);
  };

  const answeredCount = tasks.filter(task => isTaskCompleted(task.id)).length;
  const TimeIcon = getTimeIcon(timeOfDay);
  const timeColor = getTimeColor(timeOfDay);
  const timeRange = getTimeRange(timeOfDay);

  // Helper to compute missed tasks from previous periods
  const getMissedTasksSummary = () => {
    const categoryMapping = {
      'Digestive Health': 'digestive-health-&-symptoms',
      'Medication & Supplement Use': 'medication-&-supplement-use',
      'Nutrition & Diet Habits': 'diet-&-nutrition',
      'Personalized Goals & Achievements': 'personalized-goals-&-achievements',
      'Physical Activity & Movement': 'physical-activity-&-movement',
      'Stress, Sleep, and Recovery': 'sleep-&-recovery',
    };
    // Determine which time periods to check
    const timePeriodsToCheck: ('morning' | 'afternoon' | 'evening')[] = [];
    if (timeOfDay === 'afternoon') {
      timePeriodsToCheck.push('morning');
    } else if (timeOfDay === 'evening') {
      timePeriodsToCheck.push('morning', 'afternoon');
    }
    const missedByPeriod: Record<string, { missed: number; total: number }> = {};
    Object.entries(trackingQuestions).forEach(([category, questions]) => {
      questions.forEach((q: any) => {
        const assignedTime = getQuestionTime(q.id, q.timeOfDay, anytimeAllocation);
        const taskTime = assignedTime === 'Morning' ? 'morning' : assignedTime === 'Afternoon' ? 'afternoon' : assignedTime === 'Evening' ? 'evening' : null;
        if (taskTime && timePeriodsToCheck.includes(taskTime)) {
          const categoryId = categoryMapping[category as keyof typeof categoryMapping] || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const taskId = `${categoryId}__${q.id}`;
          const isAnswered = isTaskCompleted(taskId);
          
          if (!missedByPeriod[taskTime]) {
            missedByPeriod[taskTime] = { missed: 0, total: 0 };
          }
          missedByPeriod[taskTime].total += 1;
          if (!isAnswered) {
            missedByPeriod[taskTime].missed += 1;
          }
        }
      });
    });
    return missedByPeriod;
  };

  const missedTasksByPeriod = getMissedTasksSummary();
  const totalMissedTasks = Object.values(missedTasksByPeriod).reduce((sum, period) => sum + period.missed, 0);

  if (!anytimeAllocation) {
    return <div className="p-4 text-center text-muted-foreground">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return null; // Don't render card if no tasks for this time
  }

  return (
    <Card className="tracking-questions-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TimeIcon className={`h-5 w-5 ${timeColor}`} />
            <div>
              <CardTitle className="text-xl font-headline text-primary">
                Daily Tasks
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {timeRange}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className={timeColor}>
            {answeredCount}/{tasks.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex overflow-x-auto space-x-4 pb-2 -mx-4 px-4">
          {/* Always show missed tasks sub-card as the first sub-card */}
          <div className="tracking-question-subcard p-4 w-56 flex-shrink-0 border-4 !border-rose-300 bg-rose-50">
            {totalMissedTasks > 0 ? (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="font-semibold text-red-700 flex items-center">
                      <Clock className="h-4 w-4 mr-1" /> Missed Tasks
                    </span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {Object.entries(missedTasksByPeriod)
                      .sort(([a], [b]) => {
                        const timeOrder = { 'morning': 1, 'afternoon': 2, 'evening': 3 };
                        return timeOrder[a as keyof typeof timeOrder] - timeOrder[b as keyof typeof timeOrder];
                      })
                      .map(([period, count]) => (
                      <div key={period} className="flex items-center text-sm text-indigo-900">
                        <span className={
                          period === 'morning' ? 'bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs mr-2' :
                          period === 'afternoon' ? 'bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-xs mr-2' :
                          'bg-purple-200 text-purple-800 px-2 py-0.5 rounded text-xs mr-2'
                        }>
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </span>
                        {count.missed}/{count.total} missed
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => window.location.href = '/track'}
                    className="w-full"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" /> Go and Complete
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Complete these tasks to stay on track with your health goals
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-center items-center">
                <CheckCircle2 className="h-6 w-6 text-green-600 mb-1" />
                <span className="font-semibold text-green-700">All Caught Up!</span>
                <span className="text-xs text-muted-foreground text-center mt-1">Great job! You've completed all your tasks from earlier today.</span>
              </div>
            )}
          </div>
          {/* Render current time period's tasks */}
          {tasks.map((task) => {
            const isAnswered = isTaskCompleted(task.id);
            // Determine priority badge
            let priorityBadge = null;
            if (priorities) {
              const p = priorities[task.id] ?? 'medium';
              let badgeClass = '';
              let badgeText = '';
              if (p === 'high') {
                badgeClass = 'bg-red-100 text-red-700 border border-red-200';
                badgeText = '☀️☀️☀️';
              } else if (p === 'medium') {
                badgeClass = 'bg-yellow-50 text-yellow-700 border border-yellow-100';
                badgeText = '☀️☀️';
              } else {
                badgeClass = 'bg-gray-50 text-gray-600 border border-gray-100';
                badgeText = '☀️';
              }
              priorityBadge = (
                <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium align-middle ${badgeClass}`}>{badgeText}</span>
              );
            }
            
            // Add time period indicator for tasks from different time periods
            const timeIndicator = (
              <span className={
                task.time === 'morning' ? 'bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs ml-2' :
                task.time === 'afternoon' ? 'bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-xs ml-2' :
                task.time === 'evening' ? 'bg-purple-200 text-purple-800 px-2 py-0.5 rounded text-xs ml-2' :
                'bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs ml-2'
              }>
                {task.time.charAt(0).toUpperCase() + task.time.slice(1)}
              </span>
            );
            
            return (
              <div
                key={task.id}
                className={cn(
                  "tracking-question-subcard p-4 w-56 flex-shrink-0",
                  isAnswered && "answered"
                )}
              >
                <div className="flex flex-col gap-4 items-start h-full">
                  <div className="flex-1 flex flex-col w-full">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-md font-semibold text-primary line-clamp-2 flex-1">
                        {task.question}
                      </h3>
                      {isAnswered && (
                        <CheckCircle2 className="ml-2 h-5 w-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    {/* Category name under the question */}
                    <div className="mb-1">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{task.category}</span>
                    </div>
                    {/* Priority and time period badges in the same row */}
                    <div className="flex items-center justify-between mb-2 w-full">
                      {/* Time period badge on the left */}
                      <span className={
                        cn(
                          'px-2 py-0.5 rounded text-xs font-medium border',
                          task.time !== timeOfDay
                            ? 'bg-red-200 text-red-800 border-red-300'
                            : task.time === 'morning'
                              ? 'bg-yellow-200 text-yellow-800 border-yellow-300'
                              : task.time === 'afternoon'
                                ? 'bg-blue-200 text-blue-800 border-blue-300'
                                : task.time === 'evening'
                                  ? 'bg-purple-200 text-purple-800 border-purple-300'
                                  : 'bg-gray-200 text-gray-800 border-gray-300'
                        )
                      }>
                        {task.time.charAt(0).toUpperCase() + task.time.slice(1)}
                      </span>
                      {/* Benefit to You: sun emojis on the right */}
                      {priorities && (() => {
                        const p = priorities[task.id] ?? 'medium';
                        const badgeText = p === 'high' ? '☀️☀️☀️' : p === 'medium' ? '☀️☀️' : '☀️';
                        return (
                          <span className="text-[13px] align-middle whitespace-nowrap">Your Benefit {badgeText}</span>
                        );
                      })()}
                    </div>
                    {renderInput(task, dailyAnswers[task.id] || '', (value) => handleAnswerChange(task.id, value))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 