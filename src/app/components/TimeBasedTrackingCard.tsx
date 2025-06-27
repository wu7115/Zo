'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Sun, SunMedium, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackingQuestions } from '@/data/trackingQuestions';
import { getQuestionTime } from '@/utils/taskAllocation';

interface TrackingTask {
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
}

const getTimeIcon = (time: 'morning' | 'afternoon' | 'evening') => {
  switch (time) {
    case 'morning': return Sun;
    case 'afternoon': return SunMedium;
    case 'evening': return Moon;
  }
};

const getTimeColor = (time: 'morning' | 'afternoon' | 'evening') => {
  switch (time) {
    case 'morning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'afternoon': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'evening': return 'bg-purple-100 text-purple-800 border-purple-200';
  }
};

const getTimeRange = (time: 'morning' | 'afternoon' | 'evening'): string => {
  switch (time) {
    case 'morning': return '3:00 AM - 11:59 AM';
    case 'afternoon': return '12:00 PM - 6:00 PM';
    case 'evening': return '6:01 PM - 2:59 AM';
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

export function TimeBasedTrackingCard({ timeOfDay, priorities }: TimeBasedTrackingCardProps) {
  const [tasks, setTasks] = useState<TrackingTask[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
    
    // Load existing answers from localStorage with date check
    const savedAnswers = localStorage.getItem('trackingAnswers');
    const savedDate = localStorage.getItem('trackingAnswersDate');
    
    if (savedAnswers && savedDate === today) {
      setAnswers(JSON.parse(savedAnswers));
    } else {
      // Reset answers if it's a new day
      setAnswers({});
      localStorage.setItem('trackingAnswers', JSON.stringify({}));
      localStorage.setItem('trackingAnswersDate', today);
    }
  }, []);

  useEffect(() => {
    // Generate tasks for this time of day and previous unfinished time periods
    const timeTasks: TrackingTask[] = [];
    
    // Category mapping to match track page format
    const categoryMapping = {
      'Digestive Health': 'digestive-health-&-symptoms',
      'Medication & Supplement Use': 'medication-&-supplement-use',
      'Nutrition & Diet Habits': 'diet-&-nutrition',
      'Personalized Goals & Achievements': 'lifestyle-factors',
      'Physical Activity & Movement': 'lifestyle-factors',
      'Stress, Sleep, and Recovery': 'sleep-&-recovery',
    };
    
    // Determine which time periods to include based on current time
    const timePeriodsToInclude: ('morning' | 'afternoon' | 'evening')[] = [];
    if (timeOfDay === 'morning') {
      timePeriodsToInclude.push('morning');
    } else if (timeOfDay === 'afternoon') {
      timePeriodsToInclude.push('morning', 'afternoon');
    } else if (timeOfDay === 'evening') {
      timePeriodsToInclude.push('morning', 'afternoon', 'evening');
    }
    
    Object.entries(trackingQuestions).forEach(([category, questions]) => {
      questions.forEach((q: any) => {
        const assignedTime = getQuestionTime(q.id, q.timeOfDay);
        const taskTime = assignedTime === 'Morning' ? 'morning' : assignedTime === 'Afternoon' ? 'afternoon' : assignedTime === 'Evening' ? 'evening' : null;
        
        // Only include tasks from relevant time periods
        if (taskTime && timePeriodsToInclude.includes(taskTime)) {
          // Use the same category ID format as track page
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
    
    // Filter out answered tasks from previous time periods (only for current day)
    const filteredTasks = timeTasks.filter(task => {
      const isAnswered = answers[task.id] !== undefined && answers[task.id] !== '';
      // Keep current time period tasks regardless of answer status
      if (task.time === timeOfDay) {
        return true;
      }
      // Only keep previous time period tasks if they're unanswered (for current day)
      return !isAnswered;
    });
    
    // Sort by time period first, then by priority
    if (priorities) {
      const timeOrder = { 'morning': 1, 'afternoon': 2, 'evening': 3 };
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      
      filteredTasks.sort((a, b) => {
        // First sort by time period
        const aTimeOrder = timeOrder[a.time];
        const bTimeOrder = timeOrder[b.time];
        
        if (aTimeOrder !== bTimeOrder) {
          return aTimeOrder - bTimeOrder;
        }
        
        // Then sort by priority
        const aPriority = priorities[a.id] ?? 'medium';
        const bPriority = priorities[b.id] ?? 'medium';
        const aPriorityOrder = priorityOrder[aPriority];
        const bPriorityOrder = priorityOrder[bPriority];
        
        return aPriorityOrder - bPriorityOrder;
      });
    }
    
    setTasks(filteredTasks);
  }, [timeOfDay, priorities, Object.keys(answers).length, currentDate]);

  const handleAnswerChange = (taskId: string, value: any) => {
    const newAnswers = { ...answers, [taskId]: value };
    setAnswers(newAnswers);
    localStorage.setItem('trackingAnswers', JSON.stringify(newAnswers));
    localStorage.setItem('trackingAnswersDate', currentDate);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('trackingAnswersChanged', {
      detail: { taskId, value, allAnswers: newAnswers }
    }));
  };

  // Listen for changes from other components
  useEffect(() => {
    const handleTrackingAnswersChange = (event: CustomEvent) => {
      setAnswers(event.detail.allAnswers);
    };

    window.addEventListener('trackingAnswersChanged', handleTrackingAnswersChange as EventListener);
    
    return () => {
      window.removeEventListener('trackingAnswersChanged', handleTrackingAnswersChange as EventListener);
    };
  }, []);

  const answeredCount = tasks.filter(task => 
    answers[task.id] !== undefined && answers[task.id] !== ''
  ).length;

  const TimeIcon = getTimeIcon(timeOfDay);
  const timeColor = getTimeColor(timeOfDay);
  const timeRange = getTimeRange(timeOfDay);

  if (tasks.length === 0) {
    return null; // Don't render card if no tasks for this time
  }

  return (
    <Card className="tracking-questions-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TimeIcon className="h-5 w-5" />
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
          {tasks.map((task) => {
            const isAnswered = answers[task.id] !== undefined && answers[task.id] !== '';
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
                    {renderInput(task, answers[task.id], (value) => handleAnswerChange(task.id, value))}
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