
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


interface TrackingQuestion {
  id: string;
  ref: string;
  text: string;
  inputType: 'rating-5' | 'text' | 'number' | 'options' | 'boolean' | 'bristol' | 'textarea' | 'time';
  options?: string[];
  placeholder?: string;
  status: string;
  value?: string | number | string[] | boolean;
}

interface TrackingCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  questions: TrackingQuestion[];
  badgeCount?: number;
}

const trackingData: TrackingCategory[] = [
  {
    id: 'nutrition-&-diet-habits',
    title: 'Nutrition & Diet Habits',
    icon: Utensils,
    questions: [
      { id: 'q1.1', ref: '1.1', text: 'How much water did you drink today?', inputType: 'text', placeholder: 'e.g., 64 oz or 2 liters', status: '16oz ✅', value: '16oz' },
      { id: 'q1.2', ref: '1.2', text: 'Did you take any supplements today?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
      { id: 'q1.3', ref: '1.3', text: 'How many servings of fruits and vegetables did you eat today?', inputType: 'number', placeholder: 'e.g., 5', status: 'Pending' },
      { id: 'q1.4', ref: '1.4', text: 'Approximate fiber intake today (grams):', inputType: 'number', placeholder: 'e.g., 25', status: 'Pending' },
      { id: 'q1.5', ref: '1.5', text: 'Did you consume fermented foods today?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
      { id: 'q1.6', ref: '1.6', text: 'Did you consume processed foods today?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
      { id: 'q1.7', ref: '1.7', text: 'Did you avoid your known trigger foods today?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
      { id: 'q1.8', ref: '1.8', text: 'How many meals did you have today?', inputType: 'number', placeholder: 'e.g., 3', status: 'Pending' },
      { id: 'q1.9', ref: '1.9', text: 'Did you consume any alcohol today?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
      { id: 'q1.10', ref: '1.10', text: 'Did you consume caffeine today?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
    ],
  },
  {
    id: 'physical-activity-&-movement',
    title: 'Physical Activity & Movement',
    icon: Activity,
    questions: [
      { id: 'q2.1', ref: '2.1', text: 'How many steps did you take today?', inputType: 'number', placeholder: 'e.g., 10000', status: '850 ✅ (Synced)', value: 850 },
      { id: 'q2.2', ref: '2.2', text: 'Total exercise duration (minutes):', inputType: 'number', placeholder: 'e.g., 30', status: 'Pending' },
      { id: 'q2.3', ref: '2.3', text: 'Type(s) of exercise you did today (select all that apply)', inputType: 'textarea', placeholder: 'e.g., Running, Yoga, Weightlifting', status: 'Pending' },
      { id: 'q2.4', ref: '2.4', text: "Would you describe today's activity level as:", inputType: 'options', options: ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'], status: 'Pending' },
    ],
  },
  {
    id: 'sleep-&-rest',
    title: 'Sleep & Rest',
    icon: BedDouble,
    badgeCount: 1,
    questions: [
      { id: 'q3.1', ref: '3.1', text: 'What time did you go to bed last night?', inputType: 'time', status: '11:15 PM ✅', value: '11:15 PM' },
      { id: 'q3.2', ref: '3.2', text: 'How long did it take you to fall asleep last night? (minutes)', inputType: 'number', placeholder: 'e.g., 15', status: '15 min ✅ (Manually Entered)', value: 15 },
      { id: 'q3.3', ref: '3.3', text: 'What time did you wake up today?', inputType: 'time', status: '6:30 AM ✅', value: '6:30 AM' },
      { id: 'q3.4', ref: '3.4', text: 'Total hours of sleep:', inputType: 'text', placeholder: 'e.g., 7h 15m', status: '7h 15m ✅ (Synced)', value: '7h 15m' },
      { id: 'q3.5', ref: '3.5', text: 'How would you rate your sleep quality?', inputType: 'rating-5', status: 'Good ⭐⭐⭐⭐ ✅', value: 4 },
      { id: 'q3.6', ref: '3.6', text: 'Did you take any naps or rest periods today?', inputType: 'boolean', options: ['Yes', 'No'], status: 'No ✅', value: false },
    ],
  },
  {
    id: 'stress-&-relaxation',
    title: 'Stress & Relaxation',
    icon: Smile,
    badgeCount: 1,
    questions: [
      { id: 'q4.1', ref: '4.1', text: 'How would you rate your stress level today?', inputType: 'rating-5', status: 'Pending' },
      { id: 'q4.2', ref: '4.2', text: 'Did you engage in any mindfulness or meditation practices today?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
      { id: 'q4.3', ref: '4.3', text: 'Did you do any breathing exercises or relaxation activities?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
      { id: 'q4.4', ref: '4.4', text: 'How would you rate your mood today?', inputType: 'options', options: ['Excellent', 'Good', 'Neutral', 'Low', 'Very Low'], status: 'Good ✅', value: 'good' },
      { id: 'q4.5', ref: '4.5', text: 'How would you rate your work-life balance today?', inputType: 'rating-5', status: 'Pending' },
    ],
  },
  {
    id: 'bowel-health-&-digestion',
    title: 'Bowel Health & Digestion',
    icon: HeartPulse,
    questions: [
      {
        id: 'q5.1',
        ref: '5.1',
        text: 'How often a bowel movement occurs?',
        inputType: 'options',
        options: [
          "Rare (Less than 3 times per week)",
          "Infrequent (3-4 times per week)",
          "Normal (1-3 times per day)",
          "Frequent (4+ times per day)"
        ],
        status: 'Normal (1-3 times per day) ✅',
        value: 'normal'
      },
      { id: 'q5.2', ref: '5.2', text: 'Did you feel any urgency or need to rush to the bathroom today?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
      { id: 'q5.3', ref: '5.3', text: 'Did you have any difficulty passing stools today?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
      { id: 'q5.4', ref: '5.4', text: 'Were your bowel movements easy or did you strain?', inputType: 'options', options: ['Easy', 'Strained'], status: 'Pending' },
      { id: 'q5.5', ref: '5.5', text: 'Did you feel like you completely emptied your bowels?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
      { id: 'q5.6', ref: '5.6', text: 'Did you have any incomplete bowel movements today?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
      { id: 'q5.7', ref: '5.7', text: 'Did you notice any unusual color in your stools today?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
      {
        id: 'q5.8',
        ref: '5.8',
        text: 'Stool consistency (Bristol Stool Chart):',
        inputType: 'bristol',
        options: [
          'Type 1: Separate hard lumps, like nuts (hard to pass)',
          'Type 2: Sausage-shaped, but lumpy',
          'Type 3: Like a sausage but with cracks on its surface',
          'Type 4: Like a sausage or snake, smooth and soft',
          'Type 5: Soft blobs with clear cut edges (passed easily)',
          'Type 6: Fluffy pieces with ragged edges, a mushy stool',
          'Type 7: Watery, no solid pieces. Entirely liquid.'
        ],
        status: 'Type 4 ✅',
        value: 'type-4'
      },
      { id: 'q5.9', ref: '5.9', text: 'Did you experience bloating, gas, or digestive discomfort today?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
    ],
  },
  {
    id: 'medication-&-supplement-use',
    title: 'Medication & Supplement Use',
    icon: Pill,
    badgeCount: 1,
    questions: [
      { id: 'q6.1', ref: '6.1', text: 'Did you take any medications today (including antibiotics)?', inputType: 'textarea', placeholder: 'List medications or type N/A', status: 'Pending' },
    ],
  },
  {
    id: 'personalized-goals-&-achievements',
    title: 'Personalized Goals & Achievements',
    icon: Target,
    questions: [
      { id: 'q7.1', ref: '7.1', text: 'Did you complete your daily gut-health goals today?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
      { id: 'q7.2', ref: '7.2', text: 'Did you participate in any weekly gut health challenges?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
      { id: 'q7.3', ref: '7.3', text: 'Did you achieve any new wellness milestones or rewards?', inputType: 'boolean', options: ['Yes', 'No'], status: 'Pending', value: false },
    ],
  },
];


const renderInputType = (question: TrackingQuestion) => {
  const baseButtonClass = "rounded-full py-3 text-sm font-medium w-full justify-start px-4";
  const selectedButtonClass = "bg-primary text-primary-foreground hover:bg-primary/90";
  const unselectedButtonClass = "bg-secondary text-secondary-foreground hover:bg-secondary/80";

  switch (question.inputType) {
    case 'number':
    case 'text':
    case 'time':
      return <Input type={question.inputType === 'number' ? 'number' : 'text'} placeholder={question.placeholder} className="mt-1 w-full" defaultValue={question.value?.toString()} />;
    case 'textarea':
      return <Textarea placeholder={question.placeholder} className="mt-1 w-full" defaultValue={question.value?.toString()} />;
    case 'boolean':
      return (
        <div className="mt-1 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button
            variant="outline"
            className={cn(baseButtonClass, "flex-1 justify-center", question.value === true ? selectedButtonClass : unselectedButtonClass)}
          >
            Yes
          </Button>
          <Button
            variant="outline"
            className={cn(baseButtonClass, "flex-1 justify-center", question.value === false ? selectedButtonClass : unselectedButtonClass)}
          >
            No
          </Button>
        </div>
      );
    case 'options':
    case 'bristol':
      const isBristol = question.inputType === 'bristol';
      return (
        <div className="mt-1 flex flex-col space-y-2">
          {question.options?.map(opt => {
            let optionValue: string;
            if (isBristol) {
              optionValue = opt.split(':')[0].toLowerCase().replace(' ', '-');
            } else {
              optionValue = opt.split(' ')[0].toLowerCase().replace(/[(),]/g, '');
            }
            const isSelected = question.value === optionValue;
            return (
              <Button
                key={opt}
                variant="outline"
                className={cn(baseButtonClass, isSelected ? selectedButtonClass : unselectedButtonClass)}
              >
                {opt}
              </Button>
            );
          })}
        </div>
      );
    case 'rating-5':
      return (
        <div className="mt-1 flex space-x-1 justify-center">
          {[1, 2, 3, 4, 5].map(starRating => (
            <Button key={starRating} variant="ghost" size="icon" className="p-1">
              <Star className={`h-6 w-6 ${ (question.value && typeof question.value === 'number' && question.value >= starRating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
            </Button>
          ))}
        </div>
      );
    default:
      return <p className="text-sm text-red-500 mt-1">Unsupported input type</p>;
  }
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

  const [defaultOpenItems, setDefaultOpenItems] = React.useState<string[]>([]);


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
                          {category.badgeCount && category.badgeCount > 0 && (
                            <Badge variant="destructive" className="h-5 min-w-[1.25rem] flex items-center justify-center p-1 text-xs">
                              {category.badgeCount}
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-0">
                        <div className="p-3 space-y-3 bg-card">
                          {category.questions.map((question) => (
                            <div key={question.id} className="py-2 border-b border-border last:border-b-0">
                              <div className="flex justify-between items-start mb-2">
                                  <p className="text-sm text-primary font-medium pr-2">{question.text} <span className="text-xs text-muted-foreground font-normal">({question.ref})</span></p>
                                  {question.status !== 'Pending' && question.status.includes('✅') && <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />}
                              </div>
                              {renderInputType(question)}
                              <p className="text-xs text-primary mt-1 text-right">{question.status}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
