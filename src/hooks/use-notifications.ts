"use client"

import { useState, useEffect, useCallback } from 'react';
import { trackingQuestions } from '@/data/trackingQuestions';
import { getQuestionTime } from '@/utils/taskAllocation';
import { useToast } from '@/hooks/use-toast';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, getDocs, deleteDoc, updateDoc, orderBy, query, limit, onSnapshot, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { loadDailyTrackingAnswers } from '@/lib/trackingService';

export interface Notification {
  id: string;
  type: 'new-period' | 'incomplete-tasks';
  title: string;
  message: string;
  timePeriod: 'morning' | 'afternoon' | 'evening';
  timestamp: Date;
  read: boolean;
}

export function getCurrentTimePeriod(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour >= 3 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

export function getTimePeriodStartHour(timePeriod: 'morning' | 'afternoon' | 'evening'): number {
  switch (timePeriod) {
    case 'morning': return 3;
    case 'afternoon': return 12;
    case 'evening': return 18;
  }
}

export function getTimePeriodEndHour(timePeriod: 'morning' | 'afternoon' | 'evening'): number {
  switch (timePeriod) {
    case 'morning': return 11;
    case 'afternoon': return 17;
    case 'evening': return 2; // Next day
  }
}

// --- Helper to get incomplete tasks for a specific time period ---
const getIncompleteTasksForPeriod = (
  timePeriod: 'morning' | 'afternoon' | 'evening',
  answers: Record<string, any>
) => {
  const categoryMapping = {
    'Digestive Health': 'digestive-health-&-symptoms',
    'Medication & Supplement Use': 'medication-&-supplement-use',
    'Nutrition & Diet Habits': 'diet-&-nutrition',
    'Personalized Goals & Achievements': 'lifestyle-factors',
    'Physical Activity & Movement': 'lifestyle-factors',
    'Stress, Sleep, and Recovery': 'sleep-&-recovery',
  };
  const incompleteTasks: string[] = [];
  Object.entries(trackingQuestions).forEach(([category, questions]) => {
    questions.forEach((q: any) => {
      const assignedTime = getQuestionTime(q.id, q.timeOfDay);
      const taskTime = assignedTime === 'Morning' ? 'morning' : assignedTime === 'Afternoon' ? 'afternoon' : assignedTime === 'Evening' ? 'evening' : null;
      if (taskTime === timePeriod) {
        const categoryId = categoryMapping[category as keyof typeof categoryMapping] || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const taskId = `${categoryId}__${q.id}`;
        // Check if task is incomplete
        const isAnswered = answers[taskId] !== undefined && answers[taskId] !== '';
        if (!isAnswered) {
          incompleteTasks.push(q.text);
        }
      }
    });
  });
  return incompleteTasks;
};

// Helper to get YYYY-MM-DD from Date
function getDateString(date: Date) {
  return date.toISOString().split('T')[0];
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastCheckedPeriod, setLastCheckedPeriod] = useState<string>('');
  const [lastCheckedPeriodLoaded, setLastCheckedPeriodLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // --- Firestore helpers ---
  const db = getFirestore(app);

  // Listen for auth state changes
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Load notifications from Firestore (latest 5)
  useEffect(() => {
    if (!user) return;
    const notifRef = collection(db, 'users', user.uid, 'notifications');
    const qNotif = query(notifRef, orderBy('timestamp', 'desc'), limit(5));
    const unsub = onSnapshot(qNotif, (snapshot) => {
      const notifs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type,
          title: data.title,
          message: data.message,
          timePeriod: data.timePeriod,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
          read: !!data.read,
        };
      });
      setNotifications(notifs);
    });
    return () => unsub();
  }, [user]);

  // Load lastCheckedPeriod from Firestore
  useEffect(() => {
    if (!user) return;
    const metaRef = doc(db, 'users', user.uid, 'notificationMeta', 'meta');
    getDoc(metaRef).then((snap) => {
      if (snap.exists()) {
        setLastCheckedPeriod(snap.data().lastCheckedPeriod || '');
      }
      setLastCheckedPeriodLoaded(true);
    }).catch(() => {
      setLastCheckedPeriodLoaded(true);
    });
  }, [user]);

  // Save lastCheckedPeriod to Firestore
  const saveLastCheckedPeriod = async (period: string) => {
    if (!user) return;
    const metaRef = doc(db, 'users', user.uid, 'notificationMeta', 'meta');
    await setDoc(metaRef, { lastCheckedPeriod: period }, { merge: true });
    setLastCheckedPeriod(period);
  };

  // Add notification to Firestore (and keep only latest 5)
  const addNotification = async (notif: Omit<Notification, 'id'>) => {
    if (!user) return;
    const notifRef = collection(db, 'users', user.uid, 'notifications');
    await addDoc(notifRef, notif);
    // Prune to latest 5
    const qNotif = query(notifRef, orderBy('timestamp', 'desc'));
    const snap = await getDocs(qNotif);
    if (snap.size > 5) {
      const toDelete = snap.docs.slice(5);
      await Promise.all(toDelete.map(doc => deleteDoc(doc.ref)));
    }
  };

  // Helper to check if a notification of this type/period/date already exists
  const notificationExists = async (type: string, period: string, dateString: string) => {
    if (!user) return false;
    const notifRef = collection(db, 'users', user.uid, 'notifications');
    const qNotif = query(
      notifRef,
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    const snap = await getDocs(qNotif);
    return snap.docs.some(doc => {
      const data = doc.data();
      if (data.type !== type || data.timePeriod !== period) return false;
      // Compare date part only
      let ts = data.timestamp;
      if (ts && ts.toDate) ts = ts.toDate();
      else ts = new Date(ts);
      return getDateString(ts) === dateString;
    });
  };

  // Mark notification as read in Firestore
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;
    const notifRef = doc(db, 'users', user.uid, 'notifications', notificationId);
    await updateDoc(notifRef, { read: true });
  }, [user]);

  // Mark all notifications as read in Firestore
  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    const notifRef = collection(db, 'users', user.uid, 'notifications');
    const snap = await getDocs(notifRef);
    await Promise.all(snap.docs.map(doc => updateDoc(doc.ref, { read: true })));
  }, [user]);

  // Clear all notifications in Firestore
  const clearAllNotifications = useCallback(async () => {
    if (!user) return;
    const notifRef = collection(db, 'users', user.uid, 'notifications');
    const snap = await getDocs(notifRef);
    await Promise.all(snap.docs.map(doc => deleteDoc(doc.ref)));
  }, [user]);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // --- Notification triggers (start and middle of period) ---
  const getTrackingAnswers = useCallback(async () => {
    if (!user) return {};
    try {
      return await loadDailyTrackingAnswers();
    } catch (error) {
      console.warn('Failed to load tracking answers for notifications:', error);
      return {};
    }
  }, [user]);

  const checkNewTimePeriod = useCallback(async () => {
    if (!user) return;
    const now = new Date();
    const currentPeriod = getCurrentTimePeriod();
    const startHour = getTimePeriodStartHour(currentPeriod);
    const isBeginningOfPeriod = now.getHours() === startHour && now.getMinutes() < 30;
    const todayString = getDateString(now);
    if (isBeginningOfPeriod && lastCheckedPeriod !== currentPeriod) {
      // Only send if not already sent today for this period
      if (await notificationExists('new-period', currentPeriod, todayString)) return;
      const newNotification = {
        type: 'new-period' as const,
        title: `New ${currentPeriod.charAt(0).toUpperCase() + currentPeriod.slice(1)} Tasks Available`,
        message: `Your ${currentPeriod} tasks are ready. Time to check in on your wellness journey!`,
        timePeriod: currentPeriod,
        timestamp: now,
        read: false,
      };
      await addNotification(newNotification);
      await saveLastCheckedPeriod(currentPeriod);
      toast({
        title: newNotification.title,
        description: newNotification.message,
        duration: 5000,
      });
    }
  }, [lastCheckedPeriod, toast, user]);

  const checkIncompleteTasks = useCallback(async () => {
    if (!user) return;
    const now = new Date();
    const currentPeriod = getCurrentTimePeriod();
    const startHour = getTimePeriodStartHour(currentPeriod);
    const endHour = getTimePeriodEndHour(currentPeriod);
    let middleHour = startHour + Math.floor((endHour - startHour) / 2);
    if (middleHour < startHour) middleHour += 24;
    const isMiddleOfPeriod = Math.abs(now.getHours() - middleHour) <= 0.5;
    const todayString = getDateString(now);
    if (isMiddleOfPeriod) {
      // Only send if not already sent today for this period
      if (await notificationExists('incomplete-tasks', currentPeriod, todayString)) return;
      const answers = await getTrackingAnswers();
      const incompleteTasks = getIncompleteTasksForPeriod(currentPeriod, answers);
      if (incompleteTasks.length > 0) {
        const notification = {
          type: 'incomplete-tasks' as const,
          title: `Complete Your ${currentPeriod.charAt(0).toUpperCase() + currentPeriod.slice(1)} Tasks`,
          message: `You have ${incompleteTasks.length} task${incompleteTasks.length > 1 ? 's' : ''} remaining for ${currentPeriod}. Don't forget to check them off!`,
          timePeriod: currentPeriod,
          timestamp: now,
          read: false,
        };
        await addNotification(notification);
        toast({
          title: notification.title,
          description: notification.message,
          duration: 5000,
        });
      }
    }
  }, [notifications, getTrackingAnswers, toast, user]);

  // Check for notifications every minute
  useEffect(() => {
    if (!user || !lastCheckedPeriodLoaded) return;
    const interval = setInterval(() => {
      checkNewTimePeriod();
      checkIncompleteTasks();
    }, 60000);
    return () => clearInterval(interval);
  }, [checkNewTimePeriod, checkIncompleteTasks, user, lastCheckedPeriodLoaded]);

  // Initial check
  useEffect(() => {
    if (!user || !lastCheckedPeriodLoaded) return;
    checkNewTimePeriod();
    checkIncompleteTasks();
  }, [checkNewTimePeriod, checkIncompleteTasks, user, lastCheckedPeriodLoaded]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
  };
} 