'use client';

import Link from 'next/link';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, ClipboardList, PlusCircle, BarChart3, Utensils, HeartPulse, Pill, BedDouble, Smile, Target, CheckCircle2, TrendingUp, Activity, Star, Edit3, ListChecks, Loader2, AlertTriangle, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { estimateActivityCalories, type EstimateActivityCaloriesInput, type EstimateActivityCaloriesOutput } from '@/ai/flows/estimate-activity-calories-flow';
import { useToast } from "@/hooks/use-toast";
import { trackingQuestions } from '@/data/trackingQuestions';
import { useEffect, useState } from 'react';
import { getQuestionTime, resetAnytimeTaskAllocation, getAnytimeTaskAllocation } from '@/utils/taskAllocation';


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

const renderInputType = (task: TrackingTask, value: any, onChange: (val: any) => void) => {
  const baseButtonClass = "rounded-full py-3 text-sm font-medium w-full justify-start px-4";
  const selectedButtonClass = "bg-primary text-primary-foreground hover:bg-primary/90";
  const unselectedButtonClass = "bg-secondary text-secondary-foreground hover:bg-secondary/80";

  switch (task.inputType) {
    case 'number':
      return (
        <Input
          type="number"
          placeholder={task.placeholder}
          className="mt-1 w-full"
          value={value ?? ''}
          onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
      );
    case 'text':
      return (
        <Input
          type="text"
          placeholder={task.placeholder}
          className="mt-1 w-full"
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
        />
      );
    case 'textarea':
      return (
        <Textarea
          placeholder={task.placeholder}
          className="mt-1 w-full"
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
        />
      );
    case 'options':
    case 'bristol': {
      const isBristol = task.inputType === 'bristol';
      return (
        <div className="mt-1 flex flex-col space-y-2">
          {task.options?.map(opt => {
            let optionValue = opt;
            const isSelected = value === optionValue;
            return (
              <Button
                key={opt}
                variant="outline"
                className={cn(baseButtonClass, isSelected ? selectedButtonClass : unselectedButtonClass)}
                onClick={() => onChange(optionValue)}
              >
                {opt}
                {isSelected && <CheckCircle2 className="ml-2 h-4 w-4 text-green-600" />}
              </Button>
            );
          })}
        </div>
      );
    }
    case 'boolean':
      return (
        <div className="mt-1 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button
            variant="outline"
            className={cn(baseButtonClass, "flex-1 justify-center", value === true ? selectedButtonClass : unselectedButtonClass)}
            onClick={() => onChange(true)}
          >
            Yes
            {value === true && <CheckCircle2 className="ml-2 h-4 w-4 text-green-600" />}
          </Button>
          <Button
            variant="outline"
            className={cn(baseButtonClass, "flex-1 justify-center", value === false ? selectedButtonClass : unselectedButtonClass)}
            onClick={() => onChange(false)}
          >
            No
            {value === false && <CheckCircle2 className="ml-2 h-4 w-4 text-green-600" />}
          </Button>
        </div>
      );
    case 'rating-5':
      return (
        <div className="mt-1 flex space-x-1 justify-center">
          {[1, 2, 3, 4, 5].map(starRating => (
            <Button
              key={starRating}
              variant="ghost"
              size="icon"
              className="p-1"
              onClick={() => onChange(starRating)}
            >
              <Star className={`h-6 w-6 ${ (value && typeof value === 'number' && value >= starRating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
            </Button>
          ))}
        </div>
      );
    default:
      return <p className="text-sm text-red-500 mt-1">Unsupported input type</p>;
  }
};

// Category to icon mapping
const categoryIconMap: Record<string, React.ElementType> = {
  'Diet & Nutrition': Utensils,
  'Digestive Health & Symptoms': HeartPulse,
  'Non-Gut Health Conditions': Pill,
  'Gut-to-Brain / Nervous System': Brain,
  'Medication & Supplement Use': Pill,
  'Lifestyle Factors': Activity,
  'Stress, Sleep, and Recovery': BedDouble,
};

// Helper function to get priority for a task
const getTaskPriority = (taskId: string, priorities: Record<string, Record<string, 'high' | 'medium' | 'low'>>): 'high' | 'medium' | 'low' => {
  // Search through all time periods for the task priority
  for (const timePeriod of ['morning', 'afternoon', 'evening']) {
    if (priorities[timePeriod] && priorities[timePeriod][taskId]) {
      return priorities[timePeriod][taskId];
    }
  }
  return 'medium'; // Default priority
};

// Helper function to sort tasks by time period and priority
const sortTasksByTimeAndPriority = (tasks: TrackingTask[], priorities: Record<string, Record<string, 'high' | 'medium' | 'low'>>): TrackingTask[] => {
  const timeOrder = { 'morning': 1, 'afternoon': 2, 'evening': 3 };
  const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
  
  return [...tasks].sort((a, b) => {
    // First sort by time period
    const aTimeOrder = a.time ? timeOrder[a.time] : 4; // null time goes last
    const bTimeOrder = b.time ? timeOrder[b.time] : 4;
    
    if (aTimeOrder !== bTimeOrder) {
      return aTimeOrder - bTimeOrder;
    }
    
    // Then sort by priority
    const aPriority = getTaskPriority(a.id, priorities);
    const bPriority = getTaskPriority(b.id, priorities);
    const aPriorityOrder = priorityOrder[aPriority];
    const bPriorityOrder = priorityOrder[bPriority];
    
    return aPriorityOrder - bPriorityOrder;
  });
};

// Helper function to convert trackingQuestions to the expected plan format
const convertTrackingQuestionsToPlan = (questions: typeof trackingQuestions) => {
  const categoryMapping = {
    'Digestive Health': 'digestive-health-&-symptoms',
    'Medication & Supplement Use': 'medication-&-supplement-use',
    'Nutrition & Diet Habits': 'diet-&-nutrition',
    'Personalized Goals & Achievements': 'lifestyle-factors',
    'Physical Activity & Movement': 'lifestyle-factors',
    'Stress, Sleep, and Recovery': 'sleep-&-recovery',
  };

  // Get persistent anytime allocation
  const anytimeAllocation = getAnytimeTaskAllocation();

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

// Helper: get ordered categories from trackingQuestions
const getTrackingCategories = () => {
  // Use the order from Object.keys(trackingQuestions)
  const iconMap: Record<string, React.ElementType> = {
    'Digestive Health': HeartPulse,
    'Medication & Supplement Use': Pill,
    'Nutrition & Diet Habits': Utensils,
    'Personalized Goals & Achievements': Star,
    'Physical Activity & Movement': Activity,
    'Stress, Sleep, and Recovery': BedDouble,
  };
  return Object.keys(trackingQuestions).map((cat) => ({
    id: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: cat,
    icon: iconMap[cat] || ClipboardList,
  }));
};

export default function TrackPage() {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const { toast } = useToast();

  const [isActivityLoggerOpen, setIsActivityLoggerOpen] = React.useState(false);
  const [activityName, setActivityName] = React.useState('');
  const [timeMinutes, setTimeMinutes] = React.useState('');
  const [effortLevel, setEffortLevel] = React.useState<number | null>(null);
  const [estimatedCalories, setEstimatedCalories] = React.useState<EstimateActivityCaloriesOutput | null>(null);
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [calculationError, setCalculationError] = React.useState<string | null>(null);

  const effortLevels = [
    { label: 'Very Light', value: 1 },
    { label: 'Light', value: 2 },
    { label: 'Moderate', value: 3 },
    { label: 'Very Intense', value: 4 },
  ];

  const resetLoggerState = () => {
    setActivityName('');
    setTimeMinutes('');
    setEffortLevel(null);
    setEstimatedCalories(null);
    setCalculationError(null);
    setIsCalculating(false);
  };

  const handleModalOpenChange = (open: boolean) => {
    setIsActivityLoggerOpen(open);
    if (!open) {
      resetLoggerState();
    }
  };

  const handleCalculateCalories = async () => {
    if (!activityName.trim() || !timeMinutes.trim() || !effortLevel) {
      setCalculationError("Please fill in all fields: Activity Name, Time, and Effort Level.");
      return;
    }
    const time = parseInt(timeMinutes, 10);
    if (isNaN(time) || time <= 0) {
      setCalculationError("Please enter a valid positive number for time.");
      return;
    }

    setIsCalculating(true);
    setCalculationError(null);
    setEstimatedCalories(null);

    try {
      const input: EstimateActivityCaloriesInput = {
        activityName,
        timeMinutes: time,
        effortLevel,
      };
      const result = await estimateActivityCalories(input);
      setEstimatedCalories(result);
    } catch (e: any) {
      console.error("Error estimating calories:", e);
      setCalculationError(e.message || "Failed to estimate calories. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleLogActivity = () => {
    // In a real app, this would save to a database or global state.
    console.log("Activity Logged:", {
      activityName,
      timeMinutes: parseInt(timeMinutes, 10),
      effortLevel,
      calories: estimatedCalories?.estimatedCalories,
    });
    toast({
        title: "Activity Logged!",
        description: `${activityName} for ${timeMinutes} min - ${estimatedCalories?.estimatedCalories} kcal (est.)`,
    });
    handleModalOpenChange(false); // Closes modal and resets state
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

  const [trackingData, setTrackingData] = React.useState<TrackingCategory[]>([]); // ← define this at the top

  const [trackingAnswers, setTrackingAnswers] = useState<{ [taskId: string]: any }>(() => {
    if (typeof window !== 'undefined') {
      const savedAnswers = localStorage.getItem('trackingAnswers');
      const savedDate = localStorage.getItem('trackingAnswersDate');
      const today = new Date().toISOString().split('T')[0];
      
      if (savedAnswers && savedDate === today) {
        return JSON.parse(savedAnswers);
      } else {
        // Reset answers if it's a new day
        localStorage.setItem('trackingAnswers', JSON.stringify({}));
        localStorage.setItem('trackingAnswersDate', today);
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('trackingAnswers', JSON.stringify(trackingAnswers));
    localStorage.setItem('trackingAnswersDate', new Date().toISOString().split('T')[0]);
  }, [trackingAnswers]);

  // Listen for trackingAnswersChanged and refresh trackingAnswers from localStorage
  useEffect(() => {
    const handleTrackingAnswersChanged = () => {
      // Reload answers from localStorage
      const savedAnswers = localStorage.getItem('trackingAnswers');
      const savedDate = localStorage.getItem('trackingAnswersDate');
      const today = new Date().toISOString().split('T')[0];
      if (savedAnswers && savedDate === today) {
        setTrackingAnswers(JSON.parse(savedAnswers));
      } else {
        setTrackingAnswers({});
      }
    };
    window.addEventListener('trackingAnswersChanged', handleTrackingAnswersChanged);
    return () => {
      window.removeEventListener('trackingAnswersChanged', handleTrackingAnswersChanged);
    };
  }, []);

  const [trackingPriorities, setTrackingPriorities] = React.useState<Record<string, Record<string, 'high' | 'medium' | 'low'>>>({});

  useEffect(() => {
    // Load priorities from localStorage
    const cacheKey = 'trackingQuestionPriorities';
    let allPriorities: Record<string, Record<string, 'high' | 'medium' | 'low'>> = {};
    try {
      allPriorities = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    } catch {}
    setTrackingPriorities(allPriorities);
  }, []);

  useEffect(() => {
    // Use the new hard-coded tracking questions from trackingQuestions.ts
    const hardcodedTrackingPlan = convertTrackingQuestionsToPlan(trackingQuestions);

    // Get categories in the same order and names as trackingQuestions
    const ALL_TRACKING_CATEGORIES = getTrackingCategories();

    const activityMap = new Map<string, { dailyTasks: TrackingTask[]; weeklyTasks: TrackingTask[] }>();
    for (const cat of hardcodedTrackingPlan as any[]) {
      // Sort daily tasks by time period and priority
      const sortedDailyTasks = sortTasksByTimeAndPriority(
        Array.isArray(cat.dailyTasks) ? cat.dailyTasks.map((t: any) => ({ ...t, inputType: t.inputType as TrackingTask['inputType'], status: 'Pending' })) : [],
        trackingPriorities
      );
      
      activityMap.set(cat.title, {
        dailyTasks: sortedDailyTasks,
        weeklyTasks: Array.isArray(cat.weeklyTasks) ? cat.weeklyTasks.map((t: any) => ({ ...t, inputType: t.inputType as TrackingTask['inputType'], status: 'Pending' })) : [],
      });
    }

    const fullCategories: TrackingCategory[] = ALL_TRACKING_CATEGORIES.map(({ id, title, icon }) => {
      const tasks = activityMap.get(title) || { dailyTasks: [], weeklyTasks: [] };
      // Count unanswered daily tasks (not present or empty in trackingAnswers)
      const unansweredCount = tasks.dailyTasks.filter(task => trackingAnswers[task.id] === undefined || trackingAnswers[task.id] === '').length;
      
      return {
        id,
        title,
        icon,
        badgeCount: unansweredCount,
        dailyTasks: tasks.dailyTasks,
        weeklyTasks: tasks.weeklyTasks,
      };
    });

    setTrackingData(fullCategories);
  }, [trackingAnswers, trackingPriorities]);

  const [defaultOpenItems, setDefaultOpenItems] = React.useState<string[]>([]);

  // Add reset button for anytime allocation
  const handleResetAllocation = () => {
    resetAnytimeTaskAllocation();
    window.location.reload();
  };

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
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
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
                              placeholder="e.g., Brisk Walking, Cycling"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="timeMinutes">Time (min)</Label>
                            <Input
                              id="timeMinutes"
                              type="number"
                              value={timeMinutes}
                              onChange={(e) => setTimeMinutes(e.target.value)}
                              placeholder="e.g., 30"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Effort Level (1-4)</Label>
                            <div className="flex space-x-2">
                              {effortLevels.map((level) => (
                                <Button
                                  key={level.value}
                                  variant={effortLevel === level.value ? "default" : "outline"}
                                  onClick={() => setEffortLevel(level.value)}
                                  className="flex-1"
                                >
                                  {level.value}
                                </Button>
                              ))}
                            </div>
                             {effortLevel && <p className="text-xs text-muted-foreground text-center mt-1">{effortLevels.find(l => l.value === effortLevel)?.label}</p>}
                          </div>
                           <Button onClick={handleCalculateCalories} disabled={isCalculating || !activityName || !timeMinutes || !effortLevel}>
                            {isCalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Calculate Calories
                          </Button>

                          {calculationError && (
                            <div className="mt-2 flex items-center space-x-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                <AlertTriangle className="h-4 w-4 shrink-0" />
                                <p>{calculationError}</p>
                            </div>
                          )}
                          {estimatedCalories && !calculationError && (
                            <div className="mt-4 p-3 bg-secondary/20 rounded-md text-center">
                              <p className="text-sm text-secondary-foreground">Estimated Calories Burned:</p>
                              <p className="text-2xl font-bold text-primary">{estimatedCalories.estimatedCalories} kcal</p>
                              {estimatedCalories.reasoning && <p className="text-xs text-muted-foreground mt-1">{estimatedCalories.reasoning}</p>}
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={handleLogActivity}
                            disabled={!estimatedCalories || isCalculating || !!calculationError}
                          >
                            Log Activity
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                </div>
                <Accordion type="multiple" defaultValue={defaultOpenItems} className="w-full space-y-3">
                  {trackingData.map((category) => (
                    <AccordionItem value={category.id} key={category.id} id={`diary-${category.id}`} className="rounded-lg border bg-card shadow-md overflow-hidden">
                      <AccordionTrigger className="bg-muted/20 hover:bg-muted/30 p-3 text-md font-semibold text-primary data-[state=open]:bg-muted/40 data-[state=open]:border-b">
                        <div className="flex items-center flex-1 text-left justify-between w-full">
                          <div className="flex items-center">
                            <category.icon className="h-5 w-5 mr-2 text-accent" />
                            {category.title}
                          </div>
                          {category.badgeCount !== undefined && category.badgeCount > 0 && (
                            <Badge className="h-5 min-w-[1.25rem] flex items-center justify-center p-1 text-xs bg-red-600 text-white">
                              {category.badgeCount}
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-0">
                        <div className="p-3 space-y-3 bg-card">
                          <div>
                            <h4 className="font-semibold text-primary mb-2">Daily Tasks</h4>
                            {category.dailyTasks.length === 0 && <p className="text-muted-foreground text-sm">No daily tasks for this category.</p>}
                            {category.dailyTasks.map((task) => {
                              const answered = trackingAnswers[task.id] !== undefined && trackingAnswers[task.id] !== '';
                              return (
                                <div
                                  key={task.id}
                                  className={cn(
                                    "mb-4 p-3 border rounded-lg flex flex-col gap-2 transition-all",
                                    answered ? "border-green-500 bg-green-50" : "bg-muted/10 border"
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-primary flex items-center">
                                      Goal: {task.goal}
                                    </span>
                                    {task.time && (
                                      <span className={
                                        task.time === 'morning' ? 'bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs ml-2' :
                                        task.time === 'afternoon' ? 'bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-xs ml-2' :
                                        task.time === 'evening' ? 'bg-purple-200 text-purple-800 px-2 py-0.5 rounded text-xs ml-2' :
                                        'bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs ml-2'
                                      }>
                                        {task.time.charAt(0).toUpperCase() + task.time.slice(1)}
                                      </span>
                                    )}
                                    {/* Priority indicator */}
                                    <div className="flex items-center gap-2">
                                      {(() => {
                                        const priority = getTaskPriority(task.id, trackingPriorities);
                                        const sunEmojis = priority === 'high' ? '☀️☀️☀️' : priority === 'medium' ? '☀️☀️' : '☀️';
                                        return (
                                          <span className="text-xs text-muted-foreground">
                                            Priority: {sunEmojis}
                                          </span>
                                        );
                                      })()}
                                    </div>
                                    {answered && <CheckCircle2 className="ml-2 h-5 w-5 text-green-600" />}
                                  </div>
                                  <hr className="my-1 border-muted" />
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground text-sm flex items-center">
                                      {task.question}
                                    </span>
                                  </div>
                                  {renderInputType(task, trackingAnswers[task.id], (val) => {
                                    const newAnswers = { ...trackingAnswers, [task.id]: val };
                                    setTrackingAnswers(newAnswers);
                                    localStorage.setItem('trackingAnswers', JSON.stringify(newAnswers));
                                  })}
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-4">
                            <h4 className="font-semibold text-primary mb-2">Weekly Tasks</h4>
                            {category.weeklyTasks.length === 0 && <p className="text-muted-foreground text-sm">No weekly tasks for this category.</p>}
                            {category.weeklyTasks.map((task) => (
                              <div key={task.id} className="mb-4 p-3 border rounded-lg bg-muted/10 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-primary flex items-center">
                                    Goal: {task.goal}
                                  </span>
                                </div>
                                <hr className="my-1 border-muted" />
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground text-sm flex items-center">
                                    {task.question}
                                  </span>
                                </div>
                                {renderInputType(task, trackingAnswers[task.id], (val) => {
                                  const newAnswers = { ...trackingAnswers, [task.id]: val };
                                  setTrackingAnswers(newAnswers);
                                  localStorage.setItem('trackingAnswers', JSON.stringify(newAnswers));
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="flex justify-center mt-6 space-x-2">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const emptyAnswers = {};
                      setTrackingAnswers(emptyAnswers);
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('trackingAnswers');
                        localStorage.removeItem('trackingAnswersDate');
                      }
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
    </main>
  );
}
