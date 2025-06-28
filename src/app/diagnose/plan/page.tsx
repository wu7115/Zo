'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { generateSecondInsight } from '@/ai/flows/generate-second-insight-flow';
import { trackingQuestions } from '@/data/trackingQuestions';
import { generateInitialInsight } from '@/ai/flows/generate-initial-insight-flow';

export default function PlanViewPage() {
  const router = useRouter();
  const [insights, setInsights] = useState<{category: string; recommendation: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(true);
  const hasGeneratedInsight = useRef(false);

  useEffect(() => {
    const ALL_CATEGORIES = [
      'Digestive Health',
      'Nutrition & Diet',
      'Health Goals & Body Changes',
      'Physical Wellness',
      'Mental & Emotional Wellness',
      'Medications & Supplements',
    ];

    const fetchInsights = async () => {
      const storedAnswers = localStorage.getItem('onboardingAnswers');
      if (!storedAnswers) return;
    
      const parsedAnswers = JSON.parse(storedAnswers);
      
      // Always generate fresh insights, but prevent duplicate generation in same session
      if (hasGeneratedInsight.current) {
        return;
      }
    
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

      // --- Prioritization logic: ensure priorities are set ---
      const cacheKey = 'trackingQuestionPriorities';
      let allPriorities: Record<string, Record<string, 'high' | 'medium' | 'low'>> = {};
      try {
        allPriorities = JSON.parse(localStorage.getItem(cacheKey) || '{}');
      } catch {}
      // If not set, generate priorities for all periods
      if (!Object.keys(allPriorities).length) {
        const periods = ['morning', 'afternoon', 'evening'];
        const { getQuestionTime } = await import('@/utils/taskAllocation');
        for (const period of periods) {
          const timeTasks: any[] = [];
          Object.entries(trackingQuestions).forEach(([category, questions]) => {
            questions.forEach((q) => {
              const assignedTime = getQuestionTime(q.id, q.timeOfDay);
              if (assignedTime === period.charAt(0).toUpperCase() + period.slice(1)) {
                timeTasks.push({
                  id: `${category.toLowerCase().replace(/[^a-z0-9]+/g, '-') }__${q.id}`,
                  type: q.type,
                  text: q.text,
                  timeOfDay: q.timeOfDay,
                  options: q.options,
                  ...('placeholder' in q && typeof q.placeholder === 'string' ? { placeholder: q.placeholder } : {}),
                });
              }
            });
          });
          try {
            const res = await fetch('/api/ai-prioritize-tracking-questions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ onboardingAnswers: parsedAnswers, trackingQuestions: timeTasks }),
            });
            const prioritiesArr = await res.json();
            const prioritiesMap: Record<string, 'high' | 'medium' | 'low'> = {};
            if (Array.isArray(prioritiesArr)) {
              prioritiesArr.forEach((item: any) => {
                if (item && typeof item.id === 'string' && ['high', 'medium', 'low'].includes(item.priority)) {
                  prioritiesMap[item.id] = item.priority;
                }
              });
            }
            allPriorities[period] = prioritiesMap;
          } catch (e) {
            // fallback: all medium
            const prioritiesMap: Record<string, 'high' | 'medium' | 'low'> = {};
            timeTasks.forEach((q) => { prioritiesMap[q.id] = 'medium'; });
            allPriorities[period] = prioritiesMap;
          }
        }
        localStorage.setItem(cacheKey, JSON.stringify(allPriorities));
      }

      // --- Select top 2 highest-priority tracking questions per category ---
      // Merge all priorities for all periods
      let mergedPriorities: Record<string, 'high' | 'medium' | 'low'> = {};
      Object.values(allPriorities).forEach((periodMap) => {
        Object.assign(mergedPriorities, periodMap);
      });
      // For each category, select top 2
      const topTrackingQuestions: Record<string, any[]> = {};
      Object.entries(trackingQuestions).forEach(([category, questions]) => {
        // Build id as used in priorities
        const categoryId = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const withPriority = questions.map((q) => {
          const id = `${categoryId}__${q.id}`;
          return { ...q, id, priority: mergedPriorities[id] || 'medium' };
        });
        // Sort by priority: high > medium > low
        withPriority.sort((a, b) => {
          const order = { high: 1, medium: 2, low: 3 };
          return order[a.priority] - order[b.priority];
        });
        topTrackingQuestions[category] = withPriority.slice(0, 2);
      });

      // --- Call LLM with completion info and top tracking questions ---
      hasGeneratedInsight.current = true; // Mark as generated before the async call
      const result = await generateSecondInsight({
        fullAnswers: parsedAnswers,
        overallCompletion,
        categoryCompletions: categoryCompletion,
        trackingQuestions: topTrackingQuestions
      });

      // --- Post-process insights ---
      let summaryOverride = null;
      if (overallCompletion < 0.8) {
        summaryOverride = "To get a more detailed and accurate insight, please complete at least 80% of the questions in your diagnostic survey.";
      }
      
      // Use the new format: healthInsight and categoryRecommendations
      const healthInsight = result.healthInsight || "Here are your personalized wellness insights based on your answers.";
      const processedInsights = (result.categoryRecommendations || []).map((insight) => {
        const cat = insight.category;
        if (categoryCompletion[cat] < 0.8) {
          return { ...insight, recommendation: "To get a more detailed and accurate recommendation, please answer more questions in this category." };
        }
        return insight;
      });
      
      // Add any missing categories
      for (const cat of ALL_CATEGORIES) {
        if (!processedInsights.find(i => i.category === cat)) {
          processedInsights.push({ category: cat, recommendation: categoryCompletion[cat] < 0.8 ? "To get a more detailed and accurate recommendation, please answer more questions in this category." : "No recommendation available." });
        }
      }
      setInsights(ALL_CATEGORIES.map(cat => processedInsights.find(i => i.category === cat)!));
      const secondInsightData = { healthInsight, categoryRecommendations: processedInsights };
      localStorage.setItem('secondInsights', JSON.stringify(secondInsightData));

      // Use the health insight as summary
      setLoadingSummary(true);
      try {
        setSummary(summaryOverride || healthInsight);
      } catch (e) {
        setSummary(summaryOverride || 'Here are your personalized wellness insights based on your answers.');
      }
      setLoadingSummary(false);

      // NEW: Use hard-coded tracking questions instead of AI generation
      try {
        const hardcodedTrackingPlan = convertTrackingQuestionsToPlan(trackingQuestions);
        localStorage.setItem('trackingPlan', JSON.stringify(hardcodedTrackingPlan));
      } catch (e) {
        console.error('Failed to store tracking plan:', e);
      }

      setLoading(false);
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
                    {item.recommendation}
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
