import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Archives yesterday's tracking answers in localStorage under 'trackingAnswersHistory' before resetting for a new day.
 * Call this before resetting trackingAnswers if the date has changed.
 */
export function archiveTrackingAnswersIfNewDay() {
  if (typeof window === 'undefined') return;
  const today = new Date().toISOString().split('T')[0];
  const savedDate = localStorage.getItem('trackingAnswersDate');
  const savedAnswers = localStorage.getItem('trackingAnswers');
  if (savedAnswers && savedDate && savedDate !== today) {
    // Get or create history object
    let history: Record<string, any> = {};
    try {
      history = JSON.parse(localStorage.getItem('trackingAnswersHistory') || '{}');
    } catch {}
    // Archive previous day's answers
    history[savedDate] = JSON.parse(savedAnswers);
    localStorage.setItem('trackingAnswersHistory', JSON.stringify(history));
  }
}
