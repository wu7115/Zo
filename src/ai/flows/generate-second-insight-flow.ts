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
  categoryInsights: z.array(
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
  name: 'generateCategoryInsights',
  input: { schema: InternalInputSchema },
  output: { schema: GenerateSecondInsightOutputSchema },
  prompt: `You are Zoe, the friendly AI wellness coach inside the Podium app.

The user has completed a comprehensive diagnostic survey. For each health category, you will:
- Review the user's answers (see below)
- Review the tracking questions for that category (see below)
- Generate a recommendation in this style: "Based on your [user's answer/condition], we'll track your [tracking question 1] and [tracking question 2] daily." The goal is to explain to the user why each tracking question is being tracked for them, based on their answers. Be specific and reference the user's answers where possible.

User's Answers (JSON):
{{{answersJson}}}

Tracking Questions (JSON):
{{{trackingQuestionsJson}}}

For each category, return an object like:
{ "category": "Digestive Health", "recommendation": "Based on your [answer], we'll track your [tracking question 1] and [tracking question 2] daily." }

Return an array of these objects, one per category.
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