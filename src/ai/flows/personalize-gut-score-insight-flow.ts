'use server';
/**
 * @fileOverview A Genkit flow for providing personalized insights based on gut health scores.
 *
 * - personalizeGutScoreInsight - A function that takes gut health scores and returns a personalized insight.
 * - PersonalizeGutScoreInput - The input type for the personalizeGutScoreInsight function.
 * - PersonalizeGutScoreInsightOutput - The return type for the personalizeGutScoreInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeGutScoreInputSchema = z.object({
  lifestyleScore: z.number().describe('Score for Lifestyle & Environment category.'),
  trackingScore: z.number().describe('Score for Health Tracking category.'),
  microbiomeScore: z.number().describe('Score for Microbiome category.'),
  hydrationDietScore: z.number().describe('Score for Hydration & Diet category.'),
  overallScore: z.number().describe('The total overall gut health score.'),
});
export type PersonalizeGutScoreInput = z.infer<typeof PersonalizeGutScoreInputSchema>;

const PersonalizeGutScoreInsightOutputSchema = z.object({
  personalizedAdvice: z.string().describe("A brief, actionable piece of personalized advice based on the scores. Should be friendly and encouraging, from 'Podium' the AI wellness coach."),
});
export type PersonalizeGutScoreInsightOutput = z.infer<typeof PersonalizeGutScoreInsightOutputSchema>;

// Exported wrapper function
export async function personalizeGutScoreInsight(input: PersonalizeGutScoreInput): Promise<PersonalizeGutScoreInsightOutput> {
  return personalizeGutScoreInsightFlow(input);
}

const insightPrompt = ai.definePrompt({
  name: 'personalizeGutScoreInsightPrompt',
  input: {schema: PersonalizeGutScoreInputSchema},
  output: {schema: PersonalizeGutScoreInsightOutputSchema},
  prompt: `You are Podium, a friendly and encouraging AI wellness coach for the Podium Pulse app.
The user has just viewed their Gut Health Score. Based on their scores below, provide one brief, actionable, and personalized tip to help them improve or maintain their gut health. Keep it concise (1-2 sentences).

Scores:
- Overall Score: {{{overallScore}}}/100
- Lifestyle & Environment: {{{lifestyleScore}}}
- Health Tracking: {{{trackingScore}}}
- Microbiome: {{{microbiomeScore}}}
- Hydration & Diet: {{{hydrationDietScore}}}

Focus on the area that might offer the most impactful or easiest positive change. Be supportive and practical.
Example output: "Your Hydration & Diet score is looking good, Alex! Keep it up by aiming for one more glass of water today. Little sips make a big difference!" (Assume name "Alex" or use general encouragement).
`,
});

const personalizeGutScoreInsightFlow = ai.defineFlow(
  {
    name: 'personalizeGutScoreInsightFlow',
    inputSchema: PersonalizeGutScoreInputSchema,
    outputSchema: PersonalizeGutScoreInsightOutputSchema,
  },
  async (input) => {
    const {output} = await insightPrompt(input);
    if (!output) {
      throw new Error('No output received from AI model for gut score insight.');
    }
    return output;
  }
);
