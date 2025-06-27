import { trackingQuestions } from '@/data/trackingQuestions';

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

// Get or create the allocation
export const getAnytimeTaskAllocation = (): Record<string, string> => {
  if (typeof window !== 'undefined') {
    const cacheKey = 'anytimeTaskAllocation';
    let allocation: Record<string, string> | null = null;
    try {
      allocation = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    } catch {}
    if (!allocation) {
      allocation = createAllocation();
      localStorage.setItem(cacheKey, JSON.stringify(allocation));
    }
    return allocation;
  } else {
    // SSR fallback: in-memory only
  if (anytimeTaskAllocation === null) {
    anytimeTaskAllocation = createAllocation();
  }
  return anytimeTaskAllocation;
  }
};

// Reset the allocation (for testing or new journeys)
export const resetAnytimeTaskAllocation = (): void => {
  anytimeTaskAllocation = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('anytimeTaskAllocation');
  }
  console.log('Allocation reset');
};

// Get the time for a specific question
export const getQuestionTime = (questionId: string, originalTimeOfDay: string): string | null => {
  if (originalTimeOfDay === 'Anytime') {
    const allocation = getAnytimeTaskAllocation();
    return allocation[questionId] || null;
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