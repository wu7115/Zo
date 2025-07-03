'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, ArrowLeft, ClipboardList, PlusCircle, Brain, BarChart3, TrendingUp, Smile, Utensils, Activity, Heart, Droplets, Zap, Target, Dumbbell, Bed, Coffee, Sun, Moon } from 'lucide-react';
import { trackingQuestions } from '@/data/trackingQuestions';
import { getAnytimeTaskAllocation, resetAnytimeTaskAllocation } from '@/utils/taskAllocation';
import { useTrackingData } from '@/hooks/use-tracking-data';
import { AiPencilPanel } from '../components/AiPencilPanel';

interface TrackingTask {
  id: string;
  goal: string;
  question: string;
  inputType: 'rating-5' | 'text' | 'number' | 'options' | 'boolean' | 'bristol' | 'textarea' | 'time';
  time?: 'morning' | 'afternoon' | 'evening' | null;
  options?: string[];
  placeholder?: string;
  status?: string;
  value?: string | number | string[] | boolean;
}

interface TrackingCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  dailyTasks: TrackingTask[];
  weeklyTasks: TrackingTask[];
  badgeCount?: number;
}

const renderInputType = (task: TrackingTask, value: any, onChange: (val: any) => void, priorities?: Record<string, Record<string, 'high' | 'medium' | 'low'>>) => {
  switch (task.inputType) {
    case 'number':
      return (
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={task.placeholder || 'Enter number'}
          className="w-full"
        />
      );
    case 'text':
      return (
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={task.placeholder || 'Enter text'}
          className="w-full"
        />
      );
    case 'textarea':
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={task.placeholder || 'Enter text'}
          className="w-full"
        />
      );
    case 'options':
      return (
        <div className="space-y-2">
          {task.options?.map((option) => (
              <Button
              key={option}
              variant={value === option ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(option)}
              className="w-full justify-start"
              >
              {option}
              {value === option && <CheckCircle2 className="ml-2 h-4 w-4" />}
              </Button>
          ))}
        </div>
      );
    case 'boolean':
      return (
        <div className="space-y-2">
          <Button
            variant={value === 'true' ? "default" : "outline"}
            size="sm"
            onClick={() => onChange('true')}
            className="w-full justify-start"
          >
            Yes
            {value === 'true' && <CheckCircle2 className="ml-2 h-4 w-4" />}
          </Button>
          <Button
            variant={value === 'false' ? "default" : "outline"}
            size="sm"
            onClick={() => onChange('false')}
            className="w-full justify-start"
          >
            No
            {value === 'false' && <CheckCircle2 className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      );
    case 'rating-5':
      return (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              variant={value == rating ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(rating)}
              className="w-8 h-8 p-0"
            >
              {rating}
            </Button>
          ))}
        </div>
      );
    case 'bristol':
      return (
        <div className="space-y-2">
          {['Type 1', 'Type 2', 'Type 3', 'Type 4', 'Type 5', 'Type 6', 'Type 7'].map((type) => (
            <Button
              key={type}
              variant={value === type ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(type)}
              className="w-full justify-start"
            >
              {type}
              {value === type && <CheckCircle2 className="ml-2 h-4 w-4" />}
            </Button>
          ))}
        </div>
      );
    case 'time':
      return (
        <Input
          type="time"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
      );
    default:
      return <Input value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full" />;
  }
};

const getTaskPriority = (taskId: string, priorities: Record<string, Record<string, 'high' | 'medium' | 'low'>>): 'high' | 'medium' | 'low' => {
  for (const timePeriod of Object.keys(priorities)) {
    if (priorities[timePeriod][taskId]) {
      return priorities[timePeriod][taskId];
    }
  }
  return 'medium';
};

const sortTasksByTimeAndPriority = (tasks: TrackingTask[], priorities: Record<string, Record<string, 'high' | 'medium' | 'low'>>): TrackingTask[] => {
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const timeOrder = { morning: 1, afternoon: 2, evening: 3 };
  
  return tasks.sort((a, b) => {
    // First sort by time
    const aTime = a.time ? timeOrder[a.time] : 4;
    const bTime = b.time ? timeOrder[b.time] : 4;
    if (aTime !== bTime) return aTime - bTime;
    
    // Then sort by priority
    const aPriority = getTaskPriority(a.id, priorities);
    const bPriority = getTaskPriority(b.id, priorities);
    return priorityOrder[aPriority] - priorityOrder[bPriority];
  });
};

// Helper function to convert trackingQuestions to the expected plan format (now async)
const convertTrackingQuestionsToPlan = async (questions: typeof trackingQuestions) => {
  const categoryMapping = {
    'Digestive Health': 'digestive-health-&-symptoms',
    'Medication & Supplement Use': 'medication-&-supplement-use',
    'Nutrition & Diet Habits': 'diet-&-nutrition',
    'Personalized Goals & Achievements': 'personalized-goals-&-achievements',
    'Physical Activity & Movement': 'physical-activity-&-movement',
    'Stress, Sleep, and Recovery': 'sleep-&-recovery',
  };

  // Get persistent anytime allocation
  const anytimeAllocation = await getAnytimeTaskAllocation();

  const plan = [];

  for (const [categoryName, questionsList] of Object.entries(questions)) {
    const categoryId = categoryMapping[categoryName as keyof typeof categoryMapping] || categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!categoryId) continue;

    const dailyTasks = (questionsList as any[]).map((q: any, index: number) => {
      // Use persistent anytime allocation for anytime questions
      let assignedTime = q.timeOfDay;
      if (q.timeOfDay === 'Anytime' && q.id && anytimeAllocation[q.id]) {
        assignedTime = anytimeAllocation[q.id];
      }
      const time = assignedTime === 'Morning' ? 'morning' : assignedTime === 'Afternoon' ? 'afternoon' : assignedTime === 'Evening' ? 'evening' : null;
      return {
        id: `${categoryId}__${q.id || index}`,
        goal: q.text,
        question: q.text,
        inputType: q.type === 'number' ? 'number' : 'options',
        time,
        options: q.options || [],
        placeholder: q.placeholder || undefined,
        status: 'Pending'
      };
    });

    plan.push({
      categoryId,
      title: categoryName,
      dailyTasks,
      weeklyTasks: [] // No weekly tasks in hard-coded version
    });
  }

  return plan;
};

const getTrackingCategories = () => [
  { id: 'digestive-health-&-symptoms', title: 'Digestive Health', icon: Activity },
  { id: 'medication-&-supplement-use', title: 'Medication & Supplement Use', icon: Heart },
  { id: 'diet-&-nutrition', title: 'Nutrition & Diet Habits', icon: Droplets },
  { id: 'personalized-goals-&-achievements', title: 'Personalized Goals & Achievements', icon: Target },
  { id: 'physical-activity-&-movement', title: 'Physical Activity & Movement', icon: Dumbbell },
  { id: 'sleep-&-recovery', title: 'Stress, Sleep, and Recovery', icon: Bed },
];

export default function TrackPage() {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [isActivityLoggerOpen, setIsActivityLoggerOpen] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [activityDuration, setActivityDuration] = useState('');
  const [activityIntensity, setActivityIntensity] = useState('');
  const [calculatedCalories, setCalculatedCalories] = useState<number | null>(null);
  const [loggedActivities, setLoggedActivities] = useState<Array<{ name: string; duration: string; intensity: string; calories: number }>>([]);

  // Use the new tracking service
  const { 
    priorities, 
    dailyAnswers, 
    isLoading: trackingLoading, 
    updateAnswer, 
    isTaskCompleted,
    getTimePeriodPriorities 
  } = useTrackingData();

  const resetLoggerState = () => {
    setActivityName('');
    setActivityDuration('');
    setActivityIntensity('');
    setCalculatedCalories(null);
  };

  const handleModalOpenChange = (open: boolean) => {
    setIsActivityLoggerOpen(open);
    if (!open) {
      resetLoggerState();
    }
  };

  const handleCalculateCalories = async () => {
    if (!activityName || !activityDuration || !activityIntensity) {
      alert('Please fill in all fields');
      return;
    }

    // Mock calorie calculation - in a real app, this would call an API
    const durationMinutes = parseInt(activityDuration);
    const baseCalories = {
      'low': 3,
      'moderate': 6,
      'high': 10
    };
    
    const calories = Math.round(durationMinutes * baseCalories[activityIntensity as keyof typeof baseCalories]);
    setCalculatedCalories(calories);
  };

  const handleLogActivity = () => {
    if (!activityName || !activityDuration || !activityIntensity || calculatedCalories === null) {
      alert('Please calculate calories first');
      return;
    }

    const newActivity = {
      name: activityName,
      duration: activityDuration,
      intensity: activityIntensity,
      calories: calculatedCalories
    };

    setLoggedActivities(prev => [...prev, newActivity]);
    resetLoggerState();
    setIsActivityLoggerOpen(false);
  };

  React.useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash === 'diary' || trackingData.some(cat => `diary-${cat.id}` === hash)) {
      setActiveTab('diary');
      if (trackingData.some(cat => `diary-${cat.id}` === hash)) {
        // Ensure accordions are rendered before trying to scroll
        const defaultOpenAccordion = trackingData.find(cat => `diary-${cat.id}` === hash);
        if (defaultOpenAccordion) {
            setDefaultOpenItems([defaultOpenAccordion.id]);
        }
        setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 150); // Increased timeout slightly
      }
    }
  }, []);

  const [trackingData, setTrackingData] = React.useState<TrackingCategory[]>([]);
  const [loadingAllocation, setLoadingAllocation] = React.useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoadingAllocation(true);
    (async () => {
    // Use the new hard-coded tracking questions from trackingQuestions.ts
      const hardcodedTrackingPlan = await convertTrackingQuestionsToPlan(trackingQuestions);
    // Get categories in the same order and names as trackingQuestions
    const ALL_TRACKING_CATEGORIES = getTrackingCategories();
    const activityMap = new Map<string, { dailyTasks: TrackingTask[]; weeklyTasks: TrackingTask[] }>();
    for (const cat of hardcodedTrackingPlan as any[]) {
      // Sort daily tasks by time period and priority
      const sortedDailyTasks = sortTasksByTimeAndPriority(
        Array.isArray(cat.dailyTasks) ? cat.dailyTasks.map((t: any) => ({ ...t, inputType: t.inputType as TrackingTask['inputType'], status: 'Pending' })) : [],
          priorities
      );
      activityMap.set(cat.title, {
        dailyTasks: sortedDailyTasks,
        weeklyTasks: Array.isArray(cat.weeklyTasks) ? cat.weeklyTasks.map((t: any) => ({ ...t, inputType: t.inputType as TrackingTask['inputType'], status: 'Pending' })) : [],
      });
    }
    const fullCategories: TrackingCategory[] = ALL_TRACKING_CATEGORIES.map(({ id, title, icon }) => {
      const tasks = activityMap.get(title) || { dailyTasks: [], weeklyTasks: [] };
        // Count unanswered daily tasks
        const unansweredCount = tasks.dailyTasks.filter(task => !isTaskCompleted(task.id)).length;
      return {
        id,
        title,
        icon,
        badgeCount: unansweredCount,
        dailyTasks: tasks.dailyTasks,
        weeklyTasks: tasks.weeklyTasks,
      };
    });
      if (isMounted) {
    setTrackingData(fullCategories);
        setLoadingAllocation(false);
      }
    })();
    return () => { isMounted = false; };
  }, [dailyAnswers, priorities, isTaskCompleted]);

  const [defaultOpenItems, setDefaultOpenItems] = React.useState<string[]>([]);

  // Add reset button for anytime allocation
  const handleResetAllocation = async () => {
    await resetAnytimeTaskAllocation();
    window.location.reload();
  };

  if (trackingLoading) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-6 bg-app-content">
        <p className="text-muted-foreground">Loading tracking data...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-app-content overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-2xl font-headline text-primary flex items-center">
                <ClipboardList className="h-7 w-7 mr-2 text-accent" />
                Track
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/notifications-test">
                    Test Notifications
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 pb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="diary">Diary</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard" className="mt-4 space-y-4">
                <div className="text-center py-2">
                  <p className="text-lg font-semibold text-primary">Alex's Dashboard</p>
                  <p className="text-sm text-muted-foreground">June 5, 2025</p>
                </div>
                <Card>
                  <CardHeader><CardTitle className="text-md text-primary">Sleep Duration vs. 7-day Average</CardTitle></CardHeader>
                  <CardContent className="h-32 flex items-center justify-center bg-muted/30 rounded-md">
                    <BarChart3 className="h-12 w-12 text-primary/30" />
                    <p className="ml-2 text-muted-foreground">Chart Placeholder</p>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader><CardTitle className="text-md text-primary">Steps vs. Goal</CardTitle></CardHeader>
                  <CardContent className="h-20 flex items-center justify-center bg-muted/30 rounded-md">
                     <TrendingUp className="h-10 w-10 text-primary/30" />
                    <p className="ml-2 text-muted-foreground">Progress Placeholder</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-md text-primary">Mood Trend</CardTitle></CardHeader>
                  <CardContent className="h-32 flex items-center justify-center bg-muted/30 rounded-md">
                    <Smile className="h-12 w-12 text-primary/30" />
                    <p className="ml-2 text-muted-foreground">Chart Placeholder</p>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader><CardTitle className="text-md text-primary">Water Intake Progress</CardTitle></CardHeader>
                  <CardContent className="h-20 flex items-center justify-center bg-muted/30 rounded-md">
                    <Utensils className="h-10 w-10 text-primary/30" />
                    <p className="ml-2 text-muted-foreground">Progress Placeholder</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="diary" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-lg font-semibold text-primary">Alex's Diary</p>
                        <p className="text-sm text-muted-foreground">June 5, 2025</p>
                    </div>
                    <Dialog open={isActivityLoggerOpen} onOpenChange={handleModalOpenChange}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Entry
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-headline text-primary flex items-center">
                            <Brain className="mr-2 h-6 w-6 text-accent"/> AI Activity Logger
                          </DialogTitle>
                          <DialogDescription>
                            Log any activity and let AI estimate the calories.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <h3 className="text-lg font-semibold text-primary">Log New Activity</h3>
                          <div className="grid gap-2">
                            <Label htmlFor="activityName">Activity Name</Label>
                            <Input
                              id="activityName"
                              value={activityName}
                              onChange={(e) => setActivityName(e.target.value)}
                              placeholder="e.g., Walking, Running, Yoga"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="activityDuration">Duration (minutes)</Label>
                            <Input
                              id="activityDuration"
                              type="number"
                              value={activityDuration}
                              onChange={(e) => setActivityDuration(e.target.value)}
                              placeholder="30"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="activityIntensity">Intensity</Label>
                            <Select value={activityIntensity} onValueChange={setActivityIntensity}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select intensity" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleCalculateCalories} className="flex-1">
                            Calculate Calories
                          </Button>
                            {calculatedCalories !== null && (
                              <div className="flex items-center justify-center px-4 bg-muted rounded-md">
                                <span className="font-semibold text-primary">{calculatedCalories} cal</span>
                            </div>
                          )}
                            </div>
                          {calculatedCalories !== null && (
                            <Button onClick={handleLogActivity} className="w-full">
                              Log Activity
                            </Button>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                </div>
                <Accordion type="multiple" value={defaultOpenItems} onValueChange={setDefaultOpenItems} className="space-y-3">
                  {loadingAllocation ? (
                    <div className="flex justify-center items-center h-32">Loading task allocation...</div>
                  ) : (
                    trackingData.map((category) => (
                    <AccordionItem value={category.id} key={category.id} id={`diary-${category.id}`} className="rounded-lg border bg-card shadow-md overflow-hidden">
                        <AccordionTrigger className="px-4 py-3 font-semibold text-primary text-base rounded-lg hover:bg-primary/5 focus:outline-none">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-1">
                              <category.icon className="h-4 w-4 text-accent" />
                              <span className="text-sm whitespace-nowrap">{category.title}</span>
                          </div>
                            {category.badgeCount && category.badgeCount > 0 && (
                              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                              {category.badgeCount}
                              </span>
                          )}
                        </div>
                      </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-primary mb-2">Daily Tasks</h4>
                            {category.dailyTasks.length === 0 && <p className="text-muted-foreground text-sm">No daily tasks for this category.</p>}
                            {category.dailyTasks.map((task) => {
                                const answered = isTaskCompleted(task.id);
                                const taskPriority = getTaskPriority(task.id, priorities);

                              return (
                                <div
                                  key={task.id}
                                    className={`tracking-question-subcard${answered ? ' answered' : ''} mb-4 p-3 flex flex-col gap-2`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-primary flex items-center">
                                      Goal: {task.goal}
                                    </span>
                                      {answered && <CheckCircle2 className="ml-2 h-5 w-5 text-green-600" />}
                                  </div>
                                  <hr className="my-1 border-muted" />
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground text-sm flex items-center">
                                      {task.question}
                                    </span>
                                  </div>
                                    {/* Time period and priority badges */}
                                    <div className="flex items-center justify-between mb-2 w-full">
                                      {/* Time period badge on the left */}
                                      {task.time && (
                                        <span className={
                                          task.time === 'morning'
                                            ? 'bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium border border-yellow-300'
                                            : task.time === 'afternoon'
                                              ? 'bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-xs font-medium border border-blue-300'
                                              : task.time === 'evening'
                                                ? 'bg-purple-200 text-purple-800 px-2 py-0.5 rounded text-xs font-medium border border-purple-300'
                                                : 'bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs font-medium border border-gray-300'
                                        }>
                                          {task.time.charAt(0).toUpperCase() + task.time.slice(1)}
                                        </span>
                                      )}
                                      {/* Priority badge on the right */}
                                      <span className="text-[13px] align-middle whitespace-nowrap">
                                        Your Benefit {
                                          taskPriority === 'high' ? '☀️☀️☀️' : 
                                          taskPriority === 'medium' ? '☀️☀️' : '☀️'
                                        }
                                      </span>
                                    </div>
                                    {renderInputType(task, dailyAnswers[task.id], (val) => {
                                      updateAnswer(task.id, val);
                                    }, priorities)}
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-4">
                            <h4 className="font-semibold text-primary mb-2">Weekly Tasks</h4>
                            {category.weeklyTasks.length === 0 && <p className="text-muted-foreground text-sm">No weekly tasks for this category.</p>}
                              {category.weeklyTasks.map((task) => {
                                const answered = isTaskCompleted(task.id);
                                const taskPriority = getTaskPriority(task.id, priorities);

                                return (
                                  <div
                                    key={task.id}
                                    className={`tracking-question-subcard${answered ? ' answered' : ''} mb-4 p-3 flex flex-col gap-2`}
                                  >
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-primary flex items-center">
                                    Goal: {task.goal}
                                  </span>
                                      {answered && <CheckCircle2 className="ml-2 h-5 w-5 text-green-600" />}
                                </div>
                                <hr className="my-1 border-muted" />
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground text-sm flex items-center">
                                    {task.question}
                                  </span>
                                </div>
                                    {/* Time period and priority badges */}
                                    <div className="flex items-center justify-between mb-2 w-full">
                                      {/* Time period badge on the left */}
                                      {task.time && (
                                        <span className={
                                          task.time === 'morning'
                                            ? 'bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium border border-yellow-300'
                                            : task.time === 'afternoon'
                                              ? 'bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-xs font-medium border border-blue-300'
                                              : task.time === 'evening'
                                                ? 'bg-purple-200 text-purple-800 px-2 py-0.5 rounded text-xs font-medium border border-purple-300'
                                                : 'bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs font-medium border border-gray-300'
                                        }>
                                          {task.time.charAt(0).toUpperCase() + task.time.slice(1)}
                                        </span>
                                      )}
                                      {/* Priority badge on the right */}
                                      <span className="text-[13px] align-middle whitespace-nowrap">
                                        Your Benefit {
                                          taskPriority === 'high' ? '☀️☀️☀️' : 
                                          taskPriority === 'medium' ? '☀️☀️' : '☀️'
                                        }
                                      </span>
                                    </div>
                                    {renderInputType(task, dailyAnswers[task.id], (val) => {
                                      updateAnswer(task.id, val);
                                    }, priorities)}
                              </div>
                                );
                              })}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    ))
                  )}
                </Accordion>
                <div className="flex justify-center mt-6 space-x-2">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      // Clear all answers - this would need to be implemented in the tracking service
                      console.log('Clear all answers functionality to be implemented');
                    }}
                    className="w-full max-w-xs"
                  >
                    Clear All Answers
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleResetAllocation}
                    className="w-full max-w-xs"
                  >
                    Re-allocate Anytime Tasks
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <AiPencilPanel page="track" />
    </main>
  );
}