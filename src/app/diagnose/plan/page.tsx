'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { generateSecondInsight } from '@/ai/flows/generate-second-insight-flow';

export default function PlanViewPage() {
  const router = useRouter();
  const [insights, setInsights] = useState<{category: string; recommendation: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ALL_CATEGORIES = [
      'Diet & Nutrition',
      'Digestive Health & Symptoms',
      'Non-Gut Health Conditions',
      'Gut-to-Brain / Nervous System',
      'Medication & Supplement Use',
      'Lifestyle Factors',
      'Stress, Sleep, and Recovery',
    ];

    const fetchInsights = async () => {
      const storedAnswers = localStorage.getItem('onboardingAnswers');
      if (!storedAnswers) return;
    
      const parsedAnswers = JSON.parse(storedAnswers);
      const result = await generateSecondInsight({ fullAnswers: parsedAnswers });
    
      const ALL_CATEGORIES = [
        'Diet & Nutrition',
        'Digestive Health & Symptoms',
        'Non-Gut Health Conditions',
        'Gut-to-Brain / Nervous System',
        'Medication & Supplement Use',
        'Lifestyle Factors',
        'Stress, Sleep, and Recovery',
      ];
    
      // Deduplicate and fill in missing categories with fallback message
      const uniqueMap = new Map();
      for (const insight of result.categoryInsights || []) {
        if (!uniqueMap.has(insight.category)) {
          uniqueMap.set(insight.category, insight);
        }
      }
    
      // Add any missing categories with placeholder
      for (const cat of ALL_CATEGORIES) {
        if (!uniqueMap.has(cat)) {
          uniqueMap.set(cat, {
            category: cat,
            recommendation: "No specific recommendations at this time.",
          });
        }
      }
    
      const orderedInsights = ALL_CATEGORIES.map(cat => uniqueMap.get(cat));
      setInsights(orderedInsights);
      localStorage.setItem('generatedInsights', JSON.stringify({ categoryInsights: orderedInsights }));

      // NEW: Generate and store the tracking plan
      try {
        const trackingPlan = await import('@/ai/flows/generate-second-insight-flow').then(mod => mod.generateTrackingActivities({
          fullAnswers: parsedAnswers,
          categoryInsights: orderedInsights,
        }));
        localStorage.setItem('trackingPlan', JSON.stringify(trackingPlan));
      } catch (e) {
        console.error('Failed to generate/store tracking plan:', e);
      }

      setLoading(false);
    };

    fetchInsights();
  }, []);

  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md h-screen max-h-[875px] sm:h-[calc(100vh-4rem)] sm:max-h-[875px] bg-background shadow-2xl sm:rounded-2xl flex flex-col overflow-hidden p-6 space-y-6">
        <h1 className="text-2xl font-bold text-primary text-center">Insights Paragraph</h1>

        {loading ? (
          <p className="text-center text-muted-foreground">Zoe is reviewing your answers...</p>
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
    </main>
  );
}
