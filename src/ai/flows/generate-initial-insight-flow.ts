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
  healthInsight: z.string().describe('A comprehensive insight about the user\'s health situation based on their answers'),
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
  prompt: `You are Podium, the friendly AI wellness coach inside the Podium app.

IMPORTANT: Always speak directly to the user using "you" and "your" - never use third person language like "the user" or "they".

The user has just completed Part 1 of the onboarding questionnaire. You need to provide two things:

1. HEALTH INSIGHT: A comprehensive observation about your health situation based on your Part 1 answers. Focus on:
   - Your primary health concerns and goals
   - Your current health status and challenges
   - Positive habits you already have
   - Areas that might need attention
   - Be observational and insightful, not prescriptive
   - Keep it concise: maximum 40 words
   - ALWAYS start with "You" or speak directly to the user

2. CATEGORY RECOMMENDATIONS: For each health category, provide specific tracking tasks as bullet points. Focus on:
   - The most relevant tracking questions for you
   - Specific actions you should track daily
   - Why these tracking tasks are important for your situation
   - Format as bullet points starting with "• Track" or "• Monitor"

User's Onboarding Answers (JSON):
{{{onboardingAnswersJsonString}}}

Tracking Questions (JSON):
{{{trackingQuestionsJsonString}}}

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

REMEMBER: Always use "you" and "your" - never third person language.
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

