'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { generateSecondInsight } from '@/ai/flows/generate-second-insight-flow';
import { trackingQuestions } from '@/data/trackingQuestions';
import { generateInitialInsight } from '@/ai/flows/generate-initial-insight-flow';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

export default function PlanViewPage() {
  const router = useRouter();
  const [insights, setInsights] = useState<{category: string; recommendation: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(true);
  const hasGeneratedInsight = useRef(false);
  const [firestoreAnswers, setFirestoreAnswers] = useState<any>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setLoadingSummary(true);
      try {
        const auth = getAuth(app);
        if (!auth.currentUser) {
          setSummary('You must be signed in to view your insights.');
          setLoading(false);
          setLoadingSummary(false);
          return;
        }
        const db = getFirestore(app);
        const docRef = doc(db, 'users', auth.currentUser.uid, 'onboarding', 'answers');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          setSummary('No personalized insights found. Please complete the diagnostic survey to get personalized insights.');
          setLoading(false);
          setLoadingSummary(false);
          return;
        }
        const data = docSnap.data();
        setFirestoreAnswers(data);
        // Use part2Answers for completion stats, and initialInsight/secondInsight for insights
        const parsedAnswers = { ...data.part1Answers, ...data.part2Answers };
        // ... rest of the logic below uses parsedAnswers instead of localStorage
        // (copy the logic from before, but use parsedAnswers)
        // ---
        const ALL_CATEGORIES = [
          'Digestive Health',
          'Nutrition & Diet',
          'Health Goals & Body Changes',
          'Physical Wellness',
          'Mental & Emotional Wellness',
          'Medications & Supplements',
        ];
        const { questionnaireData } = await import('@/data/questionnaireData');
        const part2: Record<string, any[]> = questionnaireData.part2;
        let totalQuestions = 0;
        let totalAnswered = 0;
        const categoryCompletion: Record<string, number> = {};
        for (const cat of ALL_CATEGORIES) {
          const questions: any[] = part2[cat] || [];
          const visible: any[] = questions.filter((q: any) => !q.condition || q.condition(parsedAnswers));
          const answered: any[] = visible.filter((q: any) => {
            const a = parsedAnswers[q.id];
            if (Array.isArray(a)) return a.length > 0;
            return a !== undefined && a !== '';
          });
          categoryCompletion[cat] = visible.length === 0 ? 1 : answered.length / visible.length;
          totalQuestions += visible.length;
          totalAnswered += answered.length;
        }
        const overallCompletion = totalQuestions === 0 ? 1 : totalAnswered / totalQuestions;
        // ---
        // Use insights from Firestore if available
        let healthInsight = data.secondInsight || data.initialInsight || '';
        let categoryRecommendations = data.secondRecommendations || data.initialRecommendations || [];
        // If not available, fallback to generating
        if (!healthInsight || !categoryRecommendations.length) {
          // fallback: generate using LLM
          // ... (optional, can skip if you want to only show saved insights)
        }
        // Post-process insights for UI
        let summaryOverride = null;
        if (overallCompletion < 0.8) {
          summaryOverride = 'To get a more detailed and accurate insight, please complete at least 80% of the questions in your diagnostic survey.';
        }
        setSummary(summaryOverride || healthInsight || 'Here are your personalized wellness insights based on your answers.');
        // Map to UI format
        const processedInsights = (categoryRecommendations || []).map((insight: any) => {
          const cat = insight.category;
          if (categoryCompletion[cat] < 0.8) {
            return { ...insight, recommendation: 'To get a more detailed and accurate recommendation, please answer more questions in this category.' };
          }
          return insight;
        });
        for (const cat of ALL_CATEGORIES) {
          if (!processedInsights.find((i: any) => i.category === cat)) {
            processedInsights.push({ category: cat, recommendation: categoryCompletion[cat] < 0.8 ? 'To get a more detailed and accurate recommendation, please answer more questions in this category.' : 'No recommendation available.' });
          }
        }
        setInsights(ALL_CATEGORIES.map(cat => processedInsights.find((i: any) => i.category === cat)!));
      } catch (e) {
        setSummary('Sorry, I could not load your insights.');
        setInsights([]);
      } finally {
        setLoading(false);
        setLoadingSummary(false);
      }
    };
    fetchInsights();
  }, []);

  // Helper function to convert trackingQuestions to the expected format
  const convertTrackingQuestionsToPlan = (questions: typeof trackingQuestions) => {
    const categoryMapping = {
      'Digestive Health  ': 'digestive-health-&-symptoms',
      'Medication & Supplement Use': 'medication-&-supplement-use',
      'Nutrition & Diet Habits': 'diet-&-nutrition',
      'Personalized Goals & Achievements': 'lifestyle-factors',
      'Physical Activity & Movement': 'lifestyle-factors',
      'Stress, Sleep, and Recovery': 'sleep-&-recovery',
    };

    const plan = [];
    
    for (const [categoryName, questionsList] of Object.entries(questions)) {
      const categoryId = categoryMapping[categoryName as keyof typeof categoryMapping];
      if (!categoryId) continue;

      const dailyTasks = (questionsList as any[]).map((q: any, index: number) => ({
        id: `d${index + 1}`,
        goal: q.text,
        question: q.text,
        inputType: q.type === 'number' ? 'number' : 'options',
        time: q.timeOfDay === 'Morning' ? 'morning' : 
              q.timeOfDay === 'Afternoon' ? 'afternoon' : 
              q.timeOfDay === 'Evening' ? 'night' : null,
        options: q.options || [],
        placeholder: q.placeholder || undefined,
        status: 'Pending'
      }));

      plan.push({
        categoryId,
        title: categoryName,
        dailyTasks,
        weeklyTasks: [] // No weekly tasks in hard-coded version
      });
    }

    return plan;
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md h-screen max-h-[875px] sm:h-[calc(100vh-4rem)] sm:max-h-[875px] bg-background shadow-2xl sm:rounded-2xl flex flex-col overflow-hidden p-6 space-y-6">
        <div className="flex-1 flex flex-col overflow-y-auto space-y-6">
          <h1 className="text-2xl font-bold text-primary text-center">Insights Paragraph</h1>

          {loadingSummary ? (
            <p className="text-center text-muted-foreground">Podium is preparing your summary insight...</p>
          ) : (
            <div className="text-center text-primary text-base font-medium mb-2 bg-secondary/10 rounded-lg p-3 mx-auto max-w-md">{summary}</div>
          )}

          {loading ? (
            <p className="text-center text-muted-foreground">Podium is reviewing your answers...</p>
          ) : (
            <Accordion type="multiple" className="space-y-3">
              {insights.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="w-full border border-primary text-primary bg-white rounded-lg transition-all">
                  <AccordionTrigger className="w-full text-left font-semibold px-4 py-3 rounded-lg">
                    {item.category}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-sm text-muted-foreground bg-white rounded-b-lg">
                    <ul className="text-left text-muted-foreground text-sm whitespace-pre-line pl-4 list-disc">
                      {item.recommendation
                        .split(/\n|\r\n|•/)
                        .map((line: string, idx: number) => {
                          const clean = line.replace(/^[\s\-•]+/, '').trim();
                          return clean ? <li key={idx}>{clean}</li> : null;
                        })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          <div className="pt-6 mt-auto">
            <Button className="w-full" onClick={() => router.push('/')}>
              Go To Home
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
