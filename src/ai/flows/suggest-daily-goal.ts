'use server';

/**
 * @fileOverview A flow for suggesting a personalized daily wellness goal.
 *
 * - suggestDailyGoal - A function that suggests a daily goal.
 * - SuggestDailyGoalInput - The input type for the suggestDailyGoal function.
 * - SuggestDailyGoalOutput - The return type for the suggestDailyGoal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDailyGoalInputSchema = z.object({
  userProfile: z
    .string()
    .describe('The user profile data, including wellness goals and preferences.'),
  pastActivity: z
    .string()
    .describe('A summary of the user past activity, including duration, type, and frequency.'),
});
export type SuggestDailyGoalInput = z.infer<typeof SuggestDailyGoalInputSchema>;

const SuggestDailyGoalOutputSchema = z.object({
  goal: z.string().describe('The suggested daily wellness goal.'),
  reason: z.string().describe('The reason why this goal is suggested.'),
});
export type SuggestDailyGoalOutput = z.infer<typeof SuggestDailyGoalOutputSchema>;

export async function suggestDailyGoal(input: SuggestDailyGoalInput): Promise<SuggestDailyGoalOutput> {
  return suggestDailyGoalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDailyGoalPrompt',
  input: {schema: SuggestDailyGoalInputSchema},
  output: {schema: SuggestDailyGoalOutputSchema},
  prompt: `You are a personal wellness assistant. Based on the user's profile and past activity, suggest a personalized daily wellness goal.

User Profile: {{{userProfile}}}
Past Activity: {{{pastActivity}}}

Suggest a single, actionable daily goal and explain the rationale behind it.
`,
});

const suggestDailyGoalFlow = ai.defineFlow(
  {
    name: 'suggestDailyGoalFlow',
    inputSchema: SuggestDailyGoalInputSchema,
    outputSchema: SuggestDailyGoalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
