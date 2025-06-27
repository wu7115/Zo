'use server';
/**
 * @fileOverview A Genkit flow for generating an initial wellness insight based on onboarding answers.
 *
 * - generateInitialInsight - A function that takes onboarding answers and returns a brief insight.
 * - GenerateInitialInsightInput - The input type for the generateInitialInsight function.
 * - GenerateInitialInsightOutput - The return type for the generateInitialInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schema for the original input to the exported function and the flow
const OnboardingAnswersSchema = z.record(z.string(), z.any()).describe('A collection of answers from the Part 1 onboarding questionnaire.');
const GenerateInitialInsightInputSchema = z.object({
  onboardingAnswers: OnboardingAnswersSchema,
  trackingQuestions: z.record(z.string(), z.any()).optional(),
});
export type GenerateInitialInsightInput = z.infer<typeof GenerateInitialInsightInputSchema>;

const GenerateInitialInsightOutputSchema = z.object({
  categoryRecommendations: z.array(
    z.object({
      category: z.string(),
      recommendation: z.string(),
    })
  ),
});
export type GenerateInitialInsightOutput = z.infer<typeof GenerateInitialInsightOutputSchema>;

// Schema for the input the prompt itself will receive (pre-stringified answers)
const InsightPromptInternalInputSchema = z.object({
  onboardingAnswersJsonString: z.string().describe('The JSON string representation of the user\'s onboarding answers.'),
  trackingQuestionsJsonString: z.string().describe('The JSON string representation of the tracking questions.'),
});

export async function generateInitialInsight(input: GenerateInitialInsightInput): Promise<GenerateInitialInsightOutput> {
  // Import trackingQuestions if not provided
  let trackingQuestions = input.trackingQuestions;
  if (!trackingQuestions) {
    trackingQuestions = (await import('@/data/trackingQuestions')).trackingQuestions;
  }
  return generateInitialInsightFlow({ ...input, trackingQuestions });
}

const insightPrompt = ai.definePrompt({
  name: 'generateInitialInsightPrompt',
  input: {schema: InsightPromptInternalInputSchema},
  output: {schema: GenerateInitialInsightOutputSchema},
  prompt: `You are Zoe, a friendly AI wellness coach for the Podium Pulse app.

The user has just completed the onboarding questionnaire. For each health category, you will:
- Review the user's answers (see below)
- Review the tracking questions for that category (see below)
- Generate a recommendation in this style: "Based on your [user's answer/condition], we'll track your [tracking question 1] and [tracking question 2]." The goal is to explain to the user why each tracking question is being tracked for them, based on their answers. Be specific and reference the user's answers where possible.

User's Onboarding Answers (JSON):
{{{onboardingAnswersJsonString}}}

Tracking Questions (JSON):
{{{trackingQuestionsJsonString}}}

For each category, return an object like:
{ "category": "Digestive Health", "recommendation": "Based on your [answer], we'll track your [tracking question 1] and [tracking question 2]." }

Return an array of these objects, one per category.
`,
});

const generateInitialInsightFlow = ai.defineFlow(
  {
    name: 'generateInitialInsightFlow',
    inputSchema: GenerateInitialInsightInputSchema,
    outputSchema: GenerateInitialInsightOutputSchema,
  },
  async (input: GenerateInitialInsightInput) => {
    const onboardingAnswersJsonString = JSON.stringify(input.onboardingAnswers, null, 2);
    const trackingQuestionsJsonString = JSON.stringify(input.trackingQuestions ?? (await import('@/data/trackingQuestions')).trackingQuestions, null, 2);
    const {output} = await insightPrompt({ onboardingAnswersJsonString, trackingQuestionsJsonString });
    if (!output) {
      throw new Error('No output received from AI model for initial insight.');
    }
    return output;
  }
);

