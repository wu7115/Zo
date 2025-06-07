
'use server';
/**
 * @fileOverview A Genkit flow for estimating calories burned from an activity.
 *
 * - estimateActivityCalories - A function that takes activity details and returns estimated calories.
 * - EstimateActivityCaloriesInput - The input type for the estimateActivityCalories function.
 * - EstimateActivityCaloriesOutput - The return type for the estimateActivityCalories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateActivityCaloriesInputSchema = z.object({
  activityName: z.string().describe('The name or description of the physical activity performed.'),
  timeMinutes: z.number().min(1).describe('The duration of the activity in minutes.'),
  effortLevel: z.number().min(1).max(4).describe('The perceived effort level of the activity, on a scale of 1 (very light) to 4 (very intense).'),
});
export type EstimateActivityCaloriesInput = z.infer<typeof EstimateActivityCaloriesInputSchema>;

const EstimateActivityCaloriesOutputSchema = z.object({
  estimatedCalories: z.number().describe('The estimated number of calories burned during the activity. Provide a whole number.'),
  reasoning: z.string().optional().describe('A brief explanation of how the estimate was derived, if useful.'),
});
export type EstimateActivityCaloriesOutput = z.infer<typeof EstimateActivityCaloriesOutputSchema>;

export async function estimateActivityCalories(input: EstimateActivityCaloriesInput): Promise<EstimateActivityCaloriesOutput> {
  return estimateActivityCaloriesFlow(input);
}

const caloriesPrompt = ai.definePrompt({
  name: 'estimateActivityCaloriesPrompt',
  input: {schema: EstimateActivityCaloriesInputSchema},
  output: {schema: EstimateActivityCaloriesOutputSchema},
  prompt: `You are a fitness AI assistant. Based on general knowledge of physical activities, estimate the calories burned.

Activity Name: {{{activityName}}}
Duration: {{{timeMinutes}}} minutes
Effort Level (1=very light, 2=light, 3=moderate, 4=very intense): {{{effortLevel}}}

Provide an estimated number of calories burned.
If possible, briefly mention factors considered for the estimate in the reasoning field (e.g., "Estimate based on moderate intensity for the given activity type and duration.").
Return only a whole number for estimatedCalories.
Ensure the estimatedCalories field is a number.
`,
});

const estimateActivityCaloriesFlow = ai.defineFlow(
  {
    name: 'estimateActivityCaloriesFlow',
    inputSchema: EstimateActivityCaloriesInputSchema,
    outputSchema: EstimateActivityCaloriesOutputSchema,
  },
  async (input) => {
    const {output} = await caloriesPrompt(input);
    if (!output) {
      throw new Error('No output received from AI model for calorie estimation.');
    }
    // Ensure estimatedCalories is a number
    if (typeof output.estimatedCalories !== 'number') {
        const parsedCalories = parseInt(String(output.estimatedCalories), 10);
        if (isNaN(parsedCalories)) {
            throw new Error('AI returned an invalid number for estimated calories.');
        }
        output.estimatedCalories = parsedCalories;
    }
    return output;
  }
);

