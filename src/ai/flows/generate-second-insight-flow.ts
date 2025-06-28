'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ---- SCHEMAS ----

const GenerateSecondInsightInputSchema = z.object({
  fullAnswers: z.record(z.string(), z.any()),
  overallCompletion: z.number().optional(),
  categoryCompletions: z.record(z.string(), z.number()).optional(),
  trackingQuestions: z.record(z.string(), z.any()).optional(),
});
export type GenerateSecondInsightInput = z.infer<typeof GenerateSecondInsightInputSchema>;

const GenerateSecondInsightOutputSchema = z.object({
  healthInsight: z.string().describe('A comprehensive insight about the user\'s health situation based on their answers'),
  categoryRecommendations: z.array(
    z.object({
      category: z.string(),
      recommendation: z.string(),
    })
  ),
});
export type GenerateSecondInsightOutput = z.infer<typeof GenerateSecondInsightOutputSchema>;

const InternalInputSchema = z.object({
  answersJson: z.string(),
  overallCompletion: z.number().nullable().optional(),
  categoryCompletions: z.string().nullable().optional(),
  trackingQuestionsJson: z.string().optional(),
});

// ---- PROMPTS ----

const prompt = ai.definePrompt({
  name: 'generateSecondInsight',
  input: { schema: InternalInputSchema },
  output: { schema: GenerateSecondInsightOutputSchema },
  prompt: `You are Podium, the friendly AI wellness coach inside the Podium app.

The user has completed a comprehensive diagnostic survey. You need to provide two things:

1. HEALTH INSIGHT: A comprehensive observation about their health situation based on their answers. Focus on:
   - Their current health status and challenges
   - Positive habits they already have
   - Areas that might need attention
   - How different aspects of their health are connected
   - Be observational and insightful, not prescriptive
   - Keep it concise: maximum 40 words

2. CATEGORY RECOMMENDATIONS: For each health category, provide specific tracking tasks as bullet points. Focus on:
   - The most relevant tracking questions for this user
   - Specific actions they should track daily
   - Why these tracking tasks are important for their situation
   - Format as bullet points starting with "• Track" or "• Monitor"

User's Answers (JSON):
{{{answersJson}}}

Tracking Questions (JSON):
{{{trackingQuestionsJson}}}

HEALTH INSIGHT EXAMPLE:
"Your frequent digestive issues like diarrhea and abdominal pain are affecting your energy. You're taking daily supplements which is positive. Consider addressing your sedentary lifestyle."

CATEGORY RECOMMENDATIONS EXAMPLE:
For each category, generate bullet points like:
{
  "category": "Digestive Health",
  "recommendation": "• Track daily bowel movements and consistency\n• Monitor food triggers that cause bloating\n• Record abdominal pain levels and timing\n• Note stress levels before meals"
}

Return a JSON object with:
{
  "healthInsight": "Your comprehensive health insight here...",
  "categoryRecommendations": [
    { "category": "Digestive Health", "recommendation": "• Track daily bowel movements and consistency\n• Monitor food triggers that cause bloating\n• Record abdominal pain levels and timing" },
    { "category": "Nutrition & Diet", "recommendation": "• Track daily water intake\n• Monitor meal timing and portion sizes\n• Record energy levels after meals" }
  ]
}

Generate recommendations for ALL categories: Digestive Health, Nutrition & Diet, Physical Wellness, Mental & Emotional Wellness, Medications & Supplements, Health Goals & Body Changes.

Make each recommendation specific and actionable with 3-4 bullet points per category.
`,
});

// ---- FLOWS ----

const generateSecondInsightFlow = ai.defineFlow(
  {
    name: 'generateSecondInsightFlow',
    inputSchema: GenerateSecondInsightInputSchema,
    outputSchema: GenerateSecondInsightOutputSchema,
  },
  async (input) => {
    const answersJson = JSON.stringify(input.fullAnswers, null, 2);
    const overallCompletion = input.overallCompletion !== undefined ? input.overallCompletion : null;
    const categoryCompletions = input.categoryCompletions !== undefined ? JSON.stringify(input.categoryCompletions) : null;
    const trackingQuestions = input.trackingQuestions ?? (await import('@/data/trackingQuestions')).trackingQuestions;
    const trackingQuestionsJson = JSON.stringify(trackingQuestions, null, 2);
    const { output } = await prompt({ answersJson, overallCompletion, categoryCompletions, trackingQuestionsJson });
    if (!output) throw new Error('No insights received from AI');
    return output;
  }
);

export async function generateSecondInsight(input: GenerateSecondInsightInput): Promise<GenerateSecondInsightOutput> {
  return generateSecondInsightFlow(input);
}