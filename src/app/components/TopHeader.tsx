'use client';

import Link from 'next/link';
import { PlusCircle, User, Star as StarIcon, Edit2, Bell } from 'lucide-react'; // Added Bell
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { PostComposerModal } from './PostComposerModal'; // Import PostComposerModal
import { trackingQuestions } from '@/data/trackingQuestions';
import { getQuestionTime } from '@/utils/taskAllocation';

function getCurrentTimePeriod(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour >= 3 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

function getTimeOrder(time: string) {
  if (time === 'morning') return 1;
  if (time === 'afternoon') return 2;
  if (time === 'evening') return 3;
  return 4;
}

function getPriorityOrder(priority: string) {
  if (priority === 'high') return 1;
  if (priority === 'medium') return 2;
  if (priority === 'low') return 3;
  return 4;
}

function getPrioritizedTaskForCurrentPeriod() {
  // Get current time period
  const now = getCurrentTimePeriod();
  // Get priorities from localStorage
  let priorities: Record<string, Record<string, 'high' | 'medium' | 'low'>> = {};
  try {
    priorities = JSON.parse(localStorage.getItem('trackingQuestionPriorities') || '{}');
  } catch {}
  
  // Check if it's a new day and reset answers if needed
  const today = new Date().toISOString().split('T')[0];
  const storedDate = localStorage.getItem('trackingAnswersDate');
  let answers: Record<string, any> = {};
  
  if (storedDate === today) {
    // Load answers from today
    try {
      answers = JSON.parse(localStorage.getItem('trackingAnswers') || '{}');
    } catch {}
  } else {
    // It's a new day, reset answers
    localStorage.removeItem('trackingAnswers');
    localStorage.setItem('trackingAnswersDate', today);
    answers = {};
  }
  
  // Gather all relevant tasks for current period only
  const tasks: any[] = [];
  const categoryMapping = {
    'Digestive Health': 'digestive-health-&-symptoms',
    'Medication & Supplement Use': 'medication-&-supplement-use',
    'Nutrition & Diet Habits': 'diet-&-nutrition',
    'Personalized Goals & Achievements': 'lifestyle-factors',
    'Physical Activity & Movement': 'lifestyle-factors',
    'Stress, Sleep, and Recovery': 'sleep-&-recovery',
  };
  Object.entries(trackingQuestions).forEach(([category, questions]) => {
    questions.forEach((q: any) => {
      const assignedTime = getQuestionTime(q.id, q.timeOfDay);
      const taskTime = assignedTime === 'Morning' ? 'morning' : assignedTime === 'Afternoon' ? 'afternoon' : assignedTime === 'Evening' ? 'evening' : null;
      if (taskTime === now) {
        const categoryId = categoryMapping[category as keyof typeof categoryMapping] || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const id = `${categoryId}__${q.id}`;
        if (answers[id] === undefined || answers[id] === '') {
          tasks.push({
            id,
            question: q.text,
            inputType: q.type === 'number' ? 'number' : 'options',
            options: q.options,
            placeholder: q.placeholder,
            time: taskTime,
            priority: (priorities[taskTime]?.[id]) || 'medium',
            category
          });
        }
      }
    });
  });
  // Sort by priority
  tasks.sort((a, b) => getPriorityOrder(a.priority) - getPriorityOrder(b.priority));
  return tasks[0] || null;
}

function QuickTaskInputCurrentPeriod() {
  const [task, setTask] = useState<any | null>(null);
  const [value, setValue] = useState<any>('');
  useEffect(() => {
    setTask(getPrioritizedTaskForCurrentPeriod());
  }, []);
  useEffect(() => {
    if (task) {
      // Check if it's a new day and reset answers if needed
      const today = new Date().toISOString().split('T')[0];
      const storedDate = localStorage.getItem('trackingAnswersDate');
      let answers: Record<string, any> = {};
      
      if (storedDate === today) {
        // Load answers from today
        try {
          answers = JSON.parse(localStorage.getItem('trackingAnswers') || '{}');
        } catch {}
      } else {
        // It's a new day, reset answers
        localStorage.removeItem('trackingAnswers');
        localStorage.setItem('trackingAnswersDate', today);
        answers = {};
      }
      
      setValue(answers[task.id] ?? '');
    }
  }, [task]);
  if (!task) return null;
  const handleChange = (val: any) => {
    setValue(val);
    let answers: Record<string, any> = {};
    try {
      answers = JSON.parse(localStorage.getItem('trackingAnswers') || '{}');
    } catch {}
    answers[task.id] = val;
    localStorage.setItem('trackingAnswers', JSON.stringify(answers));
    // Also update date for daily reset
    localStorage.setItem('trackingAnswersDate', new Date().toISOString().split('T')[0]);
    // Dispatch event so other components/pages update immediately
    window.dispatchEvent(new CustomEvent('trackingAnswersChanged', {
      detail: { taskId: task.id, value: val, allAnswers: answers }
    }));
    setTask(getPrioritizedTaskForCurrentPeriod()); // Move to next task if any
  };
  return (
    <div className="px-2 py-3">
      <div className="flex items-center mb-1">
        <span className={
          task.time === 'morning' ? 'bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs mr-2' :
          task.time === 'afternoon' ? 'bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-xs mr-2' :
          task.time === 'evening' ? 'bg-purple-200 text-purple-800 px-2 py-0.5 rounded text-xs mr-2' :
          'bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs mr-2'
        }>{task.time.charAt(0).toUpperCase() + task.time.slice(1)}</span>
        <span className="text-xs text-muted-foreground">{task.category}</span>
      </div>
      <div className="text-sm font-medium mb-2">{task.question}</div>
      {task.inputType === 'number' ? (
        <input
          type="number"
          className="border rounded px-2 py-1 w-full text-sm"
          placeholder={task.placeholder}
          value={value}
          onChange={e => handleChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
      ) : (
        <div className="flex flex-col gap-1">
          {task.options?.map((opt: string) => (
            <button
              key={opt}
              className={
                'border rounded px-2 py-1 text-left text-sm ' +
                (value === opt ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted')
              }
              onClick={() => handleChange(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TopHeader() {
  const [sleepRating, setSleepRating] = useState<number | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const router = useRouter();
  const [isPostComposerOpen, setIsPostComposerOpen] = useState(false); // State for Post Composer

  // Daily reset of tracking answers
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('trackingAnswersDate');
    if (storedDate !== today) {
      localStorage.removeItem('trackingAnswers');
      localStorage.setItem('trackingAnswersDate', today);
    }
  }, []);

  const handleSleepRate = (rating: number) => {
    setSleepRating(rating);
    console.log(`Sleep rated: ${rating} stars`);
  };

  const handleMoodSelect = (selectedMoodEmoji: string) => {
    setMood(selectedMoodEmoji);
    console.log(`Mood selected: ${selectedMoodEmoji}`);
  };

  const moodOptions = [
    { emoji: '😊', label: 'Excellent' },
    { emoji: '🙂', label: 'Good' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😟', label: 'Low' },
    { emoji: '😩', label: 'Very Low' },
  ];

  return (
    <>
      <header className="fixed top-0 left-1/2 -translate-x-1/2 z-40 h-16 w-full max-w-[408px] bg-background/95 backdrop-blur-sm shadow-sm border-b border-border">
        <div className="flex h-full items-center justify-between px-4">
          {/* Left: Logo */}
          <Link href="/launch" className="text-2xl font-headline text-primary flex items-center" style={{letterSpacing: '-0.5px'}}>
            Podium
          </Link>

          {/* Center: Score and Points */}
          <div className="flex items-center space-x-1">
            <Button variant="secondary" size="sm" className="h-7 px-2 text-[12px] font-medium min-w-[70px] flex items-center justify-center" asChild>
              <Link href="/gut-health-score">
                Score 55/100
              </Link>
            </Button>
            <Badge variant="secondary" className="h-7 px-2 text-[12px] font-medium flex items-center min-w-[60px] justify-center">
              Points 421
            </Badge>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-accent">
                  <PlusCircle className="h-5 w-5" />
                  <span className="sr-only">Log Activity or Quick Updates</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Quick Updates</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <QuickTaskInputCurrentPeriod />
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-transparent cursor-default">
                  <div className="w-full">
                    <p className="text-sm mb-1.5 text-foreground">Rate your sleep</p>
                    <div className="flex justify-between items-center px-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={`sleep-${rating}`}
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-7 w-7 p-0 rounded-full",
                            sleepRating === rating ? "text-yellow-500 bg-yellow-100" : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-50"
                          )}
                          onClick={() => handleSleepRate(rating)}
                          aria-label={`Rate ${rating} stars`}
                        >
                          <StarIcon className={cn("h-5 w-5", sleepRating !== null && rating <= sleepRating ? "fill-yellow-400 text-yellow-500" : "fill-transparent" )}/>
                        </Button>
                      ))}
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-transparent cursor-default mt-1">
                  <div className="w-full">
                    <p className="text-sm mb-1.5 text-foreground">Rate your mood</p>
                    <div className="flex justify-between items-center px-1">
                      {moodOptions.map((opt) => (
                        <Button
                          key={`mood-${opt.label}`}
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-7 w-7 p-0 rounded-full",
                            mood === opt.emoji ? "text-primary bg-primary-foreground" : "text-muted-foreground hover:text-primary hover:bg-primary-foreground"
                          )}
                          onClick={() => handleMoodSelect(opt.emoji)}
                          aria-label={`Rate ${opt.label}`}
                        >
                          {opt.emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Notification Bell moved right beside plus button */}
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-accent" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Link href="/profile" passHref>
              <Avatar className="h-8 w-8 cursor-pointer border border-primary hover:border-accent transition-colors">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}