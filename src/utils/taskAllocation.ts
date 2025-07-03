import { trackingQuestions } from '@/data/trackingQuestions';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

// Desired distribution for anytime tasks
const DESIRED_DISTRIBUTION = {
  morning: 10,
  afternoon: 6,
  evening: 0
};

// In-memory storage for the allocation (persists during session)
let anytimeTaskAllocation: Record<string, string> | null = null;

// Get all anytime questions from trackingQuestions
const getAllAnytimeQuestions = (): string[] => {
  const anytimeQuestions: string[] = [];
  Object.values(trackingQuestions).forEach((questions: any[]) => {
    questions.forEach((q: any) => {
      if (q.timeOfDay === 'Anytime' && q.id) {
        anytimeQuestions.push(q.id);
      }
    });
  });
  return anytimeQuestions;
};

// Create a new allocation
const createAllocation = (): Record<string, string> => {
  const anytimeQuestions = getAllAnytimeQuestions();
  console.log('Found anytime questions:', anytimeQuestions.length, anytimeQuestions);
  
  // Check if we have enough questions for the desired distribution
  const totalDesired = DESIRED_DISTRIBUTION.morning + DESIRED_DISTRIBUTION.afternoon + DESIRED_DISTRIBUTION.evening;
  console.log('Total desired distribution:', totalDesired);
  console.log('Available anytime questions:', anytimeQuestions.length);
  
  if (anytimeQuestions.length < totalDesired) {
    console.warn(`Not enough anytime questions! Need ${totalDesired}, but only have ${anytimeQuestions.length}`);
  }
  
  // Shuffle for random allocation
  const shuffled = anytimeQuestions.slice().sort(() => Math.random() - 0.5);
  
  // Assign according to desired distribution
  const allocation: Record<string, string> = {};
  let i = 0;
  
  shuffled.forEach((qid: string) => {
    if (i < DESIRED_DISTRIBUTION.morning) {
      allocation[qid] = 'Morning';
    } else if (i < DESIRED_DISTRIBUTION.morning + DESIRED_DISTRIBUTION.afternoon) {
      allocation[qid] = 'Afternoon';
    } else {
      allocation[qid] = 'Evening';
    }
    i++;
  });
  
  console.log('Created new allocation:', allocation);
  console.log('Distribution counts:', {
    morning: Object.values(allocation).filter(v => v === 'Morning').length,
    afternoon: Object.values(allocation).filter(v => v === 'Afternoon').length,
    evening: Object.values(allocation).filter(v => v === 'Evening').length
  });
  
  return allocation;
};

// Get or create the allocation (now async, Firestore-backed)
export const getAnytimeTaskAllocation = async (): Promise<Record<string, string>> => {
  const user = getAuth(app).currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  const db = getFirestore(app);
  const docRef = doc(db, 'users', user.uid, 'tracking', 'anytimeTaskAllocation');
  const cacheKey = 'anytimeTaskAllocation';
  // Try localStorage first for fast load
  let allocation: Record<string, string> | null = null;
  try {
    allocation = JSON.parse(localStorage.getItem(cacheKey) || 'null');
  } catch {}
  if (allocation) {
    return allocation;
  }
  // Try Firestore
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    allocation = docSnap.data().allocation || null;
    if (allocation) {
      localStorage.setItem(cacheKey, JSON.stringify(allocation));
      return allocation;
    }
  }
  // Create new allocation
  allocation = createAllocation();
  await setDoc(docRef, { allocation, updatedAt: new Date() });
  localStorage.setItem(cacheKey, JSON.stringify(allocation));
  return allocation;
};

// Reset the allocation (for testing or new journeys, now clears Firestore)
export const resetAnytimeTaskAllocation = async (): Promise<void> => {
  anytimeTaskAllocation = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('anytimeTaskAllocation');
  }
  const user = getAuth(app).currentUser;
  if (user) {
    const db = getFirestore(app);
    const docRef = doc(db, 'users', user.uid, 'tracking', 'anytimeTaskAllocation');
    await deleteDoc(docRef);
  }
  console.log('Allocation reset');
};

// Get the time for a specific question
export const getQuestionTime = (
  questionId: string,
  originalTimeOfDay: string,
  anytimeAllocation?: Record<string, string>
): string | null => {
  if (originalTimeOfDay === 'Anytime' && anytimeAllocation) {
    return anytimeAllocation[questionId] || null;
  }
  // fallback for legacy usage (should be avoided)
  if (originalTimeOfDay === 'Anytime') {
    // This will not work correctly if called synchronously, but keeps old code from breaking
    return null;
  }
  return originalTimeOfDay;
};

// Get distribution statistics
export const getDistributionStats = (): { morning: number; afternoon: number; evening: number } => {
  const allocation = getAnytimeTaskAllocation();
  return {
    morning: Object.values(allocation).filter(v => v === 'Morning').length,
    afternoon: Object.values(allocation).filter(v => v === 'Afternoon').length,
    evening: Object.values(allocation).filter(v => v === 'Evening').length
  };
}; 