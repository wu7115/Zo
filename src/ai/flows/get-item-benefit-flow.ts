
'use server';
/**
 * @fileOverview A Genkit flow for generating a personalized benefit explanation for an item.
 *
 * - getItemBenefit - A function that takes item details and returns a personalized explanation.
 * - GetItemBenefitInput - The input type for the getItemBenefit function.
 * - GetItemBenefitOutput - The return type for the getItemBenefit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetItemBenefitInputSchema = z.object({
  itemName: z.string().describe('The name of the item.'),
  itemCategory: z.string().describe('The category of the item (e.g., Product, Service, Learning Article, Test Kit).'),
  itemDescription: z.string().optional().describe('A brief description of the item.'),
  userContext: z.string().describe('Brief context about the user, like their current wellness goals or active journey. e.g., "Mindful Mover Challenge", "improving gut health", "better sleep"'),
});
export type GetItemBenefitInput = z.infer<typeof GetItemBenefitInputSchema>;

const GetItemBenefitOutputSchema = z.object({
  benefitExplanation: z.string().describe("A concise, personalized explanation of how the item could help the user, written in a friendly and encouraging tone from 'Podium', the AI wellness coach."),
});
export type GetItemBenefitOutput = z.infer<typeof GetItemBenefitOutputSchema>;

export async function getItemBenefit(input: GetItemBenefitInput): Promise<GetItemBenefitOutput> {
  return getItemBenefitFlow(input);
}

const benefitPrompt = ai.definePrompt({
  name: 'getItemBenefitPrompt',
  input: {schema: GetItemBenefitInputSchema},
  output: {schema: GetItemBenefitOutputSchema},
  prompt: `You are Podium, a friendly and encouraging AI wellness coach for the Podium Pulse app.
The user is viewing an item and wants to know how it might help them.

Item Name: {{{itemName}}}
Item Category: {{{itemCategory}}}
{{#if itemDescription}}Item Description: {{{itemDescription}}}{{/if}}

User's current focus/context: {{{userContext}}}

Based on this, provide a concise (1-2 sentences) and personalized explanation of how this '{{{itemName}}}' could specifically benefit the user in relation to their context: '{{{userContext}}}'.
If the item doesn't seem directly relevant, try to find a positive angle or suggest how it might complement their goals.
Address the user as "you".
Example: "Since you're on the Mindful Mover Challenge, this 'Recovery Coffee' could be a great way to support your muscle recovery after workouts, helping you stay consistent!"
`,
});

const getItemBenefitFlow = ai.defineFlow(
  {
    name: 'getItemBenefitFlow',
    inputSchema: GetItemBenefitInputSchema,
    outputSchema: GetItemBenefitOutputSchema,
  },
  async (input) => {
    const {output} = await benefitPrompt(input);
    if (!output) {
      throw new Error('No output received from AI model for item benefit.');
    }
    return output;
  }
);
