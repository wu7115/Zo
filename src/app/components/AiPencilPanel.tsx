import { useState, useEffect, useRef } from 'react';
import { X, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { loadDailyTrackingAnswers, getRecentTrackingHistory, loadOnboardingAnswers } from '@/lib/trackingService';
import { app } from '@/lib/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface AiPencilPanelProps {
  page: 'track' | 'buy' | 'learn' | 'diagnose';
}

// Utility to load onboarding data from Firestore (copied from onboarding/page.tsx)
async function loadOnboardingDataFromFirestore(uid: string) {
  const db = getFirestore(app);
  const docRef = doc(db, 'users', uid, 'onboarding', 'answers');
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() || {};
    }
  } catch (error) {
    // fallback: try alternative path
    try {
      const altDocRef = doc(db, 'users', uid, 'answers');
      const altDocSnap = await getDoc(altDocRef);
      if (altDocSnap.exists()) {
        return altDocSnap.data() || {};
      }
    } catch {}
  }
  return {};
}

export function AiPencilPanel({ page }: AiPencilPanelProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
  const [user, setUser] = useState<any>(null);
  const [hasContent, setHasContent] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Only fetch if not already fetched for this page
    if (hasFetched.current || !user) return;
    setLoading(true);
    
    const fetchData = async () => {
      try {
        // Load all user data from Firestore
        const onboardingData = await loadOnboardingDataFromFirestore(user.uid);
        const onboardingAnswers = onboardingData.part1Answers || {};
        const part2Answers = onboardingData.part2Answers || {};
        const trackingAnswers = await loadDailyTrackingAnswers();
        const trackingHistory = await getRecentTrackingHistory(7); // Last 7 days
        
        fetch('/api/ai-pencil', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            page, 
            onboardingAnswers, 
            part2Answers, 
            trackingAnswers,
            trackingHistory 
          }),
        })
          .then(res => res.json())
          .then(data => {
            const suggestion = data.suggestion || 'No advice available.';
            setContent(suggestion);
            setHasContent(suggestion !== 'No advice available.' && suggestion !== 'AI Pencil is unavailable right now.');
            setLoading(false);
            hasFetched.current = true;
          })
          .catch(() => {
            setContent('AI Pencil is unavailable right now.');
            setHasContent(false);
            setLoading(false);
            hasFetched.current = true;
          });
      } catch (error) {
        setContent('AI Pencil is unavailable right now.');
        setHasContent(false);
        setLoading(false);
        hasFetched.current = true;
      }
    };
    
    fetchData();
  }, [page, user]);

  // Minimized icon button (position relative to app container)
  if (!open) {
    return (
      <div className="absolute md:fixed bottom-20 right-5 z-50">
        <button
          aria-label="Show Podium Advicer"
          className="bg-primary text-primary-foreground rounded-full shadow-lg p-3 flex items-center justify-center hover:bg-primary/90 transition-all animate-in fade-in slide-in-from-bottom duration-300 relative"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
          onClick={() => setOpen(true)}
        >
          <Sparkles className="h-7 w-7" />
          {hasContent && !loading && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
              !
            </div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-[408px] h-[33vh] bg-background shadow-2xl rounded-t-2xl border-t border-border flex flex-col animate-in fade-in slide-in-from-bottom duration-300 mb-16">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <span className="font-semibold text-primary text-base">Podium Advicer</span>
        </div>
        <button
          aria-label="Close Podium Advicer"
          className="p-1 rounded-full hover:bg-muted-foreground/10 transition-colors"
          onClick={() => {
            setOpen(false);
            setHasContent(false);
          }}
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-muted-foreground text-sm flex items-center gap-2"><Sparkles className="animate-spin h-4 w-4" /> Loading advice...</div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
} 