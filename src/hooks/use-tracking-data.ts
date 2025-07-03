import { useState, useEffect, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import {
  TrackingPriorities,
  DailyTrackingAnswers,
  TrackingHistoryEntry,
  saveTrackingPriorities,
  loadTrackingPriorities,
  saveDailyTrackingAnswers,
  loadDailyTrackingAnswers,
  updateTrackingAnswer,
  checkAndArchivePreviousDay,
  getTodayCompletionStats,
  migrateLocalStorageToFirestore,
} from '@/lib/trackingService';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { app } from '@/lib/firebase';

export function useTrackingData() {
  const [priorities, setPriorities] = useState<TrackingPriorities>({});
  const [dailyAnswers, setDailyAnswers] = useState<DailyTrackingAnswers>({});
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Listen for authentication state changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore listeners for priorities and dailyAnswers
  useEffect(() => {
    if (!user) {
      setPriorities({});
      setDailyAnswers({});
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const db = getFirestore(app);
    // Priorities listener
    const prioritiesRef = doc(db, 'users', user.uid, 'tracking', 'priorities');
    const unsubPriorities = onSnapshot(prioritiesRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPriorities(data.priorities || {});
      } else {
        setPriorities({});
      }
    });
    // Daily answers listener
    const dailyAnswersRef = doc(db, 'users', user.uid, 'tracking', 'dailyAnswers');
    const unsubAnswers = onSnapshot(dailyAnswersRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Get today's date
        const today = new Date().toISOString().split('T')[0];
        setDailyAnswers(data[today]?.answers || {});
      } else {
        setDailyAnswers({});
      }
      setIsLoading(false);
    });
    return () => {
      unsubPriorities();
      unsubAnswers();
    };
  }, [user]);

  // Load data when user changes
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Check and archive previous day if needed
        await checkAndArchivePreviousDay();
        
        // Load priorities and daily answers
        const [loadedPriorities, loadedAnswers] = await Promise.all([
          loadTrackingPriorities(),
          loadDailyTrackingAnswers(),
        ]);
        
        setPriorities(loadedPriorities);
        setDailyAnswers(loadedAnswers);
        
        // Migrate localStorage data if this is the first time
        await migrateLocalStorageToFirestore();
        
      } catch (error) {
        console.error('Error loading tracking data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Save priorities
  const savePriorities = useCallback(async (newPriorities: TrackingPriorities) => {
    try {
      await saveTrackingPriorities(newPriorities);
      setPriorities(newPriorities);
    } catch (error) {
      console.error('Error saving priorities:', error);
    }
  }, []);

  // Update a single tracking answer
  const updateAnswer = useCallback(async (taskId: string, answer: any) => {
    try {
      await updateTrackingAnswer(taskId, answer);
      setDailyAnswers(prev => ({ ...prev, [taskId]: answer }));
      
      // Dispatch custom event for backward compatibility
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('trackingAnswersChanged', {
          detail: { taskId, value: answer, allAnswers: { ...dailyAnswers, [taskId]: answer } }
        }));
      }
    } catch (error) {
      console.error('Error updating tracking answer:', error);
    }
  }, [dailyAnswers]);

  // Update multiple tracking answers
  const updateAnswers = useCallback(async (newAnswers: DailyTrackingAnswers) => {
    try {
      await saveDailyTrackingAnswers(newAnswers);
      setDailyAnswers(newAnswers);
      
      // Dispatch custom event for backward compatibility
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('trackingAnswersChanged', {
          detail: { allAnswers: newAnswers }
        }));
      }
    } catch (error) {
      console.error('Error updating tracking answers:', error);
    }
  }, []);

  // Get priority for a specific task
  const getTaskPriority = useCallback((taskId: string, timePeriod?: string): 'high' | 'medium' | 'low' => {
    if (timePeriod) {
      return priorities[timePeriod]?.[taskId] || 'medium';
    }
    
    // Search across all time periods
    for (const timePeriodPriorities of Object.values(priorities)) {
      if (timePeriodPriorities[taskId]) {
        return timePeriodPriorities[taskId];
      }
    }
    
    return 'medium';
  }, [priorities]);

  // Get all priorities for a time period
  const getTimePeriodPriorities = useCallback((timePeriod: string) => {
    return priorities[timePeriod] || {};
  }, [priorities]);

  // Check if a task is completed
  const isTaskCompleted = useCallback((taskId: string): boolean => {
    const answer = dailyAnswers[taskId];
    return answer !== undefined && answer !== '';
  }, [dailyAnswers]);

  // Get completion statistics
  const getCompletionStats = useCallback(async () => {
    return await getTodayCompletionStats();
  }, []);

  return {
    // State
    priorities,
    dailyAnswers,
    isLoading,
    user,
    
    // Actions
    savePriorities,
    updateAnswer,
    updateAnswers,
    
    // Utilities
    getTaskPriority,
    getTimePeriodPriorities,
    isTaskCompleted,
    getCompletionStats,
  };
} 