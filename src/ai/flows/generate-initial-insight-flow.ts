
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

// Define a flexible schema for answers, as Part 1 has various types
const OnboardingAnswersSchema = z.record(z.string(), z.any()).describe('A collection of answers from the Part 1 onboarding questionnaire.');

const GenerateInitialInsightInputSchema = z.object({
  onboardingAnswers: OnboardingAnswersSchema,
});
export type GenerateInitialInsightInput = z.infer<typeof GenerateInitialInsightInputSchema>;

const GenerateInitialInsightOutputSchema = z.object({
  insight: z.string().describe("A brief, personalized initial wellness insight based on the user's onboarding answers. Should be 1-2 sentences."),
});
export type GenerateInitialInsightOutput = z.infer<typeof GenerateInitialInsightOutputSchema>;

export async function generateInitialInsight(input: GenerateInitialInsightInput): Promise<GenerateInitialInsightOutput> {
  return generateInitialInsightFlow(input);
}

const insightPrompt = ai.definePrompt({
  name: 'generateInitialInsightPrompt',
  input: {schema: GenerateInitialInsightInputSchema},
  output: {schema: GenerateInitialInsightOutputSchema},
  helpers: {
    JSONstringify: function (context) {
      return JSON.stringify(context);
    },
  },
  promptOptions: {
    knownHelpersOnly: false, // Allow the locally defined helper
  },
  prompt: `You are Zoe, a friendly AI wellness coach for the Podium Pulse app.
The user has just completed the first part of their onboarding questionnaire.
Review their answers provided below and generate a single, concise (1-2 sentences) initial insight or a welcoming observation.
This is just a quick first look, so keep it light, encouraging, and very general.
Avoid making strong diagnoses or specific recommendations at this stage.
Focus on acknowledging something they'veshared or gently pointing towards a potential area of focus.
Address the user by a generic friendly name like "Wellness Seeker" or "Explorer" if their name isn't in the answers.

User's Onboarding Answers (Part 1):
\`\`\`json
{{{JSONstringify onboardingAnswers}}}
\`\`\`

Example insight: "Thanks for sharing, Wellness Seeker! It's great you're looking to improve your general gut health. We can definitely explore that together!"
Another example: "Welcome to Podium, Explorer! I see you're interested in increasing your energy levels – that's a fantastic goal to work towards."

Generate the insight:
`,
});

const generateInitialInsightFlow = ai.defineFlow(
  {
    name: 'generateInitialInsightFlow',
    inputSchema: GenerateInitialInsightInputSchema,
    outputSchema: GenerateInitialInsightOutputSchema,
  },
  async (input) => {
    const {output} = await insightPrompt(input);
    if (!output) {
      throw new Error('No output received from AI model for initial insight.');
    }
    return output;
  }
);

