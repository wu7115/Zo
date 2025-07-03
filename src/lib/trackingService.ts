import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { app } from './firebase';

export type TrackingPriority = 'high' | 'medium' | 'low';
export type TimePeriod = 'morning' | 'afternoon' | 'evening';

export interface TrackingPriorities {
  [timePeriod: string]: {
    [taskId: string]: TrackingPriority;
  };
}

export interface DailyTrackingAnswers {
  [taskId: string]: any;
}

export interface TrackingHistoryEntry {
  date: string;
  answers: DailyTrackingAnswers;
  completedTasks: string[];
  totalTasks: number;
}

export interface TrackingTaskStatus {
  taskId: string;
  completed: boolean;
  answer?: any;
  timestamp: Date;
}

// Get current user ID
const getCurrentUserId = (): string | null => {
  const auth = getAuth();
  return auth.currentUser?.uid || null;
};

// Get current date in YYYY-MM-DD format
const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// ===== TRACKING PRIORITIES =====

/**
 * Save tracking priorities to Firestore
 */
export async function saveTrackingPriorities(priorities: TrackingPriorities): Promise<void> {
  const userId = getCurrentUserId();
  if (!userId) {
    console.warn('No user logged in, cannot save priorities');
    return;
  }

  const db = getFirestore(app);
  await setDoc(doc(db, 'users', userId, 'tracking', 'priorities'), {
    priorities,
    updatedAt: new Date(),
  });
}

/**
 * Load tracking priorities from Firestore
 */
export async function loadTrackingPriorities(): Promise<TrackingPriorities> {
  const userId = getCurrentUserId();
  if (!userId) {
    console.warn('No user logged in, cannot load priorities');
    return {};
  }

  const db = getFirestore(app);
  const docRef = doc(db, 'users', userId, 'tracking', 'priorities');
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.priorities || {};
  }
  
  return {};
}

// ===== DAILY TRACKING ANSWERS =====

/**
 * Save daily tracking answers to Firestore
 */
export async function saveDailyTrackingAnswers(answers: DailyTrackingAnswers, date?: string): Promise<void> {
  const userId = getCurrentUserId();
  if (!userId) {
    console.warn('No user logged in, cannot save tracking answers');
    return;
  }

  const targetDate = date || getCurrentDate();
  const db = getFirestore(app);
  
  // Use a single document with date as a field instead of subcollection
  await setDoc(doc(db, 'users', userId, 'tracking', 'dailyAnswers'), {
    [targetDate]: {
      answers,
      date: targetDate,
      updatedAt: new Date(),
    }
  }, { merge: true });
}

/**
 * Load daily tracking answers from Firestore
 */
export async function loadDailyTrackingAnswers(date?: string): Promise<DailyTrackingAnswers> {
  const userId = getCurrentUserId();
  if (!userId) {
    console.warn('No user logged in, cannot load tracking answers');
    return {};
  }

  const targetDate = date || getCurrentDate();
  const db = getFirestore(app);
  const docRef = doc(db, 'users', userId, 'tracking', 'dailyAnswers');
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    const dateData = data[targetDate];
    return dateData?.answers || {};
  }
  
  return {};
}

/**
 * Update a single tracking answer
 */
export async function updateTrackingAnswer(taskId: string, answer: any, date?: string): Promise<void> {
  const userId = getCurrentUserId();
  if (!userId) {
    console.warn('No user logged in, cannot update tracking answer');
    return;
  }

  const targetDate = date || getCurrentDate();
  const db = getFirestore(app);
  const docRef = doc(db, 'users', userId, 'tracking', 'dailyAnswers');
  
  // Get existing answers
  const docSnap = await getDoc(docRef);
  const existingData = docSnap.exists() ? docSnap.data() : {};
  const existingAnswers = existingData[targetDate]?.answers || {};
  
  // Update the specific answer
  const updatedAnswers = { ...existingAnswers, [taskId]: answer };
  
  await setDoc(docRef, {
    [targetDate]: {
      answers: updatedAnswers,
      date: targetDate,
      updatedAt: new Date(),
    }
  }, { merge: true });
}

// ===== TRACKING HISTORY =====

/**
 * Archive daily tracking answers to history
 */
export async function archiveDailyTrackingAnswers(date: string): Promise<void> {
  const userId = getCurrentUserId();
  if (!userId) {
    console.warn('No user logged in, cannot archive tracking answers');
    return;
  }

  const db = getFirestore(app);
  
  // Get the daily answers
  const dailyDocRef = doc(db, 'users', userId, 'tracking', 'dailyAnswers');
  const dailyDocSnap = await getDoc(dailyDocRef);
  
  if (dailyDocSnap.exists()) {
    const dailyData = dailyDocSnap.data();
    const dateData = dailyData[date];
    
    if (dateData) {
      const answers = dateData.answers || {};
      
      // Calculate completion stats
      const taskIds = Object.keys(answers);
      const completedTasks = taskIds.filter(taskId => 
        answers[taskId] !== undefined && answers[taskId] !== ''
      );
      
      // Save to history
      const historyEntry: TrackingHistoryEntry = {
        date,
        answers,
        completedTasks,
        totalTasks: taskIds.length,
      };
      
      await setDoc(doc(db, 'users', userId, 'tracking', 'history'), {
        [date]: {
          ...historyEntry,
          archivedAt: new Date(),
        }
      }, { merge: true });
    }
  }
}

/**
 * Load tracking history for a date range
 */
export async function loadTrackingHistory(startDate?: string, endDate?: string): Promise<TrackingHistoryEntry[]> {
  const userId = getCurrentUserId();
  if (!userId) {
    console.warn('No user logged in, cannot load tracking history');
    return [];
  }

  const db = getFirestore(app);
  const historyRef = doc(db, 'users', userId, 'tracking', 'history');
  const historySnap = await getDoc(historyRef);
  
  if (!historySnap.exists()) {
    return [];
  }
  
  const historyData = historySnap.data();
  const history: TrackingHistoryEntry[] = [];
  
  Object.entries(historyData).forEach(([date, data]: [string, any]) => {
    // Filter by date range if specified
    if (startDate && date < startDate) return;
    if (endDate && date > endDate) return;
    
    history.push({
      date,
      answers: data.answers || {},
      completedTasks: data.completedTasks || [],
      totalTasks: data.totalTasks || 0,
    });
  });
  
  // Sort by date descending
  return history.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Get recent tracking history (last 30 days)
 */
export async function getRecentTrackingHistory(days: number = 30): Promise<TrackingHistoryEntry[]> {
  const endDate = getCurrentDate();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];
  
  return loadTrackingHistory(startDateStr, endDate);
}

// ===== UTILITY FUNCTIONS =====

/**
 * Check if it's a new day and archive previous day's data if needed
 */
export async function checkAndArchivePreviousDay(): Promise<void> {
  const today = getCurrentDate();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const userId = getCurrentUserId();
  if (!userId) return;
  
  const db = getFirestore(app);
  const dailyDocRef = doc(db, 'users', userId, 'tracking', 'dailyAnswers');
  const dailyDocSnap = await getDoc(dailyDocRef);
  
  // If yesterday's data exists and hasn't been archived yet
  if (dailyDocSnap.exists()) {
    const dailyData = dailyDocSnap.data();
    const yesterdayData = dailyData[yesterdayStr];
    
    if (yesterdayData) {
      const historyDocRef = doc(db, 'users', userId, 'tracking', 'history');
      const historyDocSnap = await getDoc(historyDocRef);
      
      if (!historyDocSnap.exists() || !historyDocSnap.data()[yesterdayStr]) {
        await archiveDailyTrackingAnswers(yesterdayStr);
      }
    }
  }
}

/**
 * Get completion statistics for today
 */
export async function getTodayCompletionStats(): Promise<{ completed: number; total: number; percentage: number }> {
  const answers = await loadDailyTrackingAnswers();
  const taskIds = Object.keys(answers);
  const completedTasks = taskIds.filter(taskId => 
    answers[taskId] !== undefined && answers[taskId] !== ''
  );
  
  return {
    completed: completedTasks.length,
    total: taskIds.length,
    percentage: taskIds.length > 0 ? (completedTasks.length / taskIds.length) * 100 : 0,
  };
}

/**
 * Migrate existing localStorage data to Firestore
 */
export async function migrateLocalStorageToFirestore(): Promise<void> {
  const userId = getCurrentUserId();
  if (!userId || typeof window === 'undefined') return;
  
  try {
    // Migrate priorities
    const prioritiesStr = localStorage.getItem('trackingQuestionPriorities');
    if (prioritiesStr) {
      const priorities = JSON.parse(prioritiesStr);
      await saveTrackingPriorities(priorities);
      console.log('Migrated tracking priorities to Firestore');
    }
    
    // Migrate current day's answers
    const answersStr = localStorage.getItem('trackingAnswers');
    const dateStr = localStorage.getItem('trackingAnswersDate');
    if (answersStr && dateStr) {
      const answers = JSON.parse(answersStr);
      await saveDailyTrackingAnswers(answers, dateStr);
      console.log('Migrated current day tracking answers to Firestore');
    }
    
    // Migrate history
    const historyStr = localStorage.getItem('trackingAnswersHistory');
    if (historyStr) {
      const history = JSON.parse(historyStr);
      for (const [date, answers] of Object.entries(history)) {
        await saveDailyTrackingAnswers(answers as DailyTrackingAnswers, date);
        await archiveDailyTrackingAnswers(date);
      }
      console.log('Migrated tracking history to Firestore');
    }
    
  } catch (error) {
    console.error('Error migrating localStorage data to Firestore:', error);
  }
}

// ===== DIAGNOSTIC/SURVEY ANSWERS =====

export async function saveSurveyAnswers(answers: any): Promise<void> {
  const user = getAuth(app).currentUser;
  if (!user) throw new Error('User not authenticated');
  const db = getFirestore(app);
  await setDoc(doc(db, 'users', user.uid, 'diagnostic', 'surveyAnswers'), { answers, updatedAt: new Date() });
}

export async function loadSurveyAnswers(): Promise<any> {
  const user = getAuth(app).currentUser;
  if (!user) throw new Error('User not authenticated');
  const db = getFirestore(app);
  const docRef = doc(db, 'users', user.uid, 'diagnostic', 'surveyAnswers');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().answers || {};
  }
  return {};
}

export async function clearSurveyAnswers(): Promise<void> {
  const user = getAuth(app).currentUser;
  if (!user) throw new Error('User not authenticated');
  const db = getFirestore(app);
  const docRef = doc(db, 'users', user.uid, 'diagnostic', 'surveyAnswers');
  await deleteDoc(docRef);
}

export async function saveOnboardingAnswers(answers: any): Promise<void> {
  const user = getAuth(app).currentUser;
  if (!user) throw new Error('User not authenticated');
  const db = getFirestore(app);
  await setDoc(doc(db, 'users', user.uid, 'diagnostic', 'onboardingAnswers'), { answers, updatedAt: new Date() });
}

export async function loadOnboardingAnswers(): Promise<any> {
  const user = getAuth(app).currentUser;
  if (!user) throw new Error('User not authenticated');
  const db = getFirestore(app);
  const docRef = doc(db, 'users', user.uid, 'diagnostic', 'onboardingAnswers');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().answers || {};
  }
  return {};
}

export async function clearOnboardingAnswers(): Promise<void> {
  const user = getAuth(app).currentUser;
  if (!user) throw new Error('User not authenticated');
  const db = getFirestore(app);
  const docRef = doc(db, 'users', user.uid, 'diagnostic', 'onboardingAnswers');
  await deleteDoc(docRef);
} 