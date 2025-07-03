'use client';

import Link from 'next/link';
import { PlusCircle, User, Star as StarIcon, Edit2, MessageSquare } from 'lucide-react';
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
import { PostComposerModal } from './PostComposerModal';
import { trackingQuestions } from '@/data/trackingQuestions';
import { getQuestionTime, getAnytimeTaskAllocation } from '@/utils/taskAllocation';
import { NotificationDropdown } from './NotificationDropdown';
import { useToast } from "@/hooks/use-toast";
import { useTrackingData } from '@/hooks/use-tracking-data';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { app } from '@/lib/firebase';

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

function getTopPriorityTasksForCurrentPeriod(count: number = 3) {
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
  
  // Sort by priority and return top N tasks
  tasks.sort((a, b) => getPriorityOrder(a.priority) - getPriorityOrder(b.priority));
  return tasks.slice(0, count);
}

function QuickTaskInputCurrentPeriod() {
  const { priorities, dailyAnswers, updateAnswer, getTimePeriodPriorities } = useTrackingData();
  const [tasks, setTasks] = useState<any[]>([]);
  const [values, setValues] = useState<Record<string, any>>({});
  const [anytimeAllocation, setAnytimeAllocation] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const allocation = await getAnytimeTaskAllocation();
      setAnytimeAllocation(allocation);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!anytimeAllocation) return;
    const now = getCurrentTimePeriod();
    const periodPriorities = getTimePeriodPriorities(now);
    const tasksArr: any[] = [];
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
        if (taskTime === now) {
          const categoryId = categoryMapping[category as keyof typeof categoryMapping] || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const id = `${categoryId}__${q.id}`;
          if (dailyAnswers[id] === undefined || dailyAnswers[id] === '') {
            tasksArr.push({
              id,
              question: q.text,
              inputType: q.type === 'number' ? 'number' : 'options',
              options: q.options,
              placeholder: q.placeholder,
              time: taskTime,
              priority: (periodPriorities?.[id]) || 'medium',
              category
            });
          }
        }
      });
    });
    tasksArr.sort((a, b) => getPriorityOrder(a.priority) - getPriorityOrder(b.priority));
    setTasks(tasksArr.slice(0, 3));
  }, [dailyAnswers, priorities, anytimeAllocation]);

  useEffect(() => {
    const initialValues: Record<string, any> = {};
    tasks.forEach(task => {
      initialValues[task.id] = dailyAnswers[task.id] ?? '';
    });
    setValues(initialValues);
  }, [tasks, dailyAnswers]);

  const handleChange = (taskId: string, val: any) => {
    setValues(prev => ({ ...prev, [taskId]: val }));
    updateAnswer(taskId, val);
  };

  if (loading || !anytimeAllocation) {
    return (
      <div className="px-2 py-3 text-center text-muted-foreground">
        <p className="text-sm">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="px-2 py-3 text-center text-muted-foreground">
        <p className="text-sm">All tasks completed for this time period!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="px-2 py-3 border-b border-muted/50 last:border-b-0">
          <div className="flex items-center mb-1">
            <span className={
              task.time === 'morning' ? 'bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs mr-2' :
              task.time === 'afternoon' ? 'bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-xs mr-2' :
              task.time === 'evening' ? 'bg-purple-200 text-purple-800 px-2 py-0.5 rounded text-xs mr-2' :
              'bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs mr-2'
            }>{task.time.charAt(0).toUpperCase() + task.time.slice(1)}</span>
            <span className="text-xs text-muted-foreground">{task.category}</span>
            {/* Priority indicator */}
            <div className="ml-auto">
              {(() => {
                const priority = task.priority;
                const sunEmojis = priority === 'high' ? '☀️☀️☀️' : priority === 'medium' ? '☀️☀️' : '☀️';
                return (
                  <span className="text-xs text-muted-foreground">
                    {sunEmojis}
                  </span>
                );
              })()}
            </div>
          </div>
          <div className="text-sm font-medium mb-2">{task.question}</div>
          {task.inputType === 'number' ? (
            <input
              type="number"
              className="border rounded px-2 py-1 w-full text-sm"
              placeholder={task.placeholder}
              value={values[task.id] ?? ''}
              onChange={e => handleChange(task.id, e.target.value === '' ? '' : Number(e.target.value))}
            />
          ) : (
            <div className="flex flex-col gap-1">
              {task.options?.map((opt: string) => (
                <button
                  key={opt}
                  className={
                    'border rounded px-2 py-1 text-left text-sm ' +
                    (values[task.id] === opt ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted')
                  }
                  onClick={() => handleChange(task.id, opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function TopHeader() {
  const [isPostComposerOpen, setIsPostComposerOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Daily reset of tracking answers
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('trackingAnswersDate');
    if (storedDate !== today) {
      localStorage.removeItem('trackingAnswers');
      localStorage.setItem('trackingAnswersDate', today);
    }
  }, []);

  const handlePostClick = () => {
    setIsPostComposerOpen(true);
  };

  const handleDeleteAllPosts = async () => {
    if (confirm('Are you sure you want to delete all posts? This action cannot be undone.')) {
      // --- Firestore batch delete ---
      const auth = getAuth(app);
      if (!auth.currentUser) {
        toast({ title: 'Error', description: 'You must be signed in to delete posts.', variant: 'destructive' });
        return;
      }
      const db = getFirestore(app);
      const storage = getStorage(app);
      const postsRef = collection(db, 'users', auth.currentUser.uid, 'posts');
      const snapshot = await getDocs(postsRef);
      
      // Delete both Firestore documents and Storage images
      const deletePromises = snapshot.docs.map(async (doc) => {
        const postData = doc.data();
        
        // If post has an image, delete it from Storage
        if (postData.image) {
          try {
            // Extract the storage path from the download URL
            // URL format: https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Ffile?alt=media&token=...
            const url = new URL(postData.image);
            const pathMatch = url.pathname.match(/\/o\/(.+)/);
            if (pathMatch) {
              const storagePath = decodeURIComponent(pathMatch[1]);
              const imageRef = storageRef(storage, storagePath);
              await deleteObject(imageRef);
            }
          } catch (error) {
            console.warn('Failed to delete image from storage:', error);
            // Continue with document deletion even if image deletion fails
          }
        }
        
        // Delete the Firestore document
        return deleteDoc(doc.ref);
      });
      
      await Promise.all(deletePromises);
      toast({
        title: 'Posts Deleted',
        description: 'All posts and associated images have been deleted successfully.',
      });
      // --- Old localStorage-based code (for reference) ---
      // localStorage.removeItem('userPosts');
      // window.dispatchEvent(new CustomEvent('postsDeleted'));
    }
  };

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
                  <span className="sr-only">Quick Updates & Post</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Quick Updates</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <QuickTaskInputCurrentPeriod />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handlePostClick} className="cursor-pointer">
                  <div className="flex items-center w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>Create Post</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeleteAllPosts} className="cursor-pointer text-destructive">
                  <div className="flex items-center w-full">
                    <span className="text-xs">🗑️ Delete All Posts</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <NotificationDropdown />
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
      
      {/* Post Composer Modal */}
      <PostComposerModal 
        isOpen={isPostComposerOpen} 
        onOpenChange={setIsPostComposerOpen} 
      />
    </>
  );
}