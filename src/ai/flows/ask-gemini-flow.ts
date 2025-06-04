'use server';
/**
 * @fileOverview A Genkit flow for general purpose chat with Gemini.
 *
 * - askGemini - A function that takes a user prompt and returns Gemini's response.
 * - AskGeminiInput - The input type for the askGemini function.
 * - AskGeminiOutput - The return type for the askGemini function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskGeminiInputSchema = z.object({
  prompt: z.string().describe('The user question or prompt for the AI.'),
});
export type AskGeminiInput = z.infer<typeof AskGeminiInputSchema>;

const AskGeminiOutputSchema = z.object({
  response: z.string().describe("The AI's response to the user's prompt."),
});
export type AskGeminiOutput = z.infer<typeof AskGeminiOutputSchema>;

export async function askGemini(input: AskGeminiInput): Promise<AskGeminiOutput> {
  return askGeminiFlow(input);
}

const geminiPrompt = ai.definePrompt({
  name: 'askGeminiPrompt',
  input: {schema: AskGeminiInputSchema},
  output: {schema: AskGeminiOutputSchema},
  prompt: `You are a helpful AI assistant. Please respond to the following user prompt:
{{{prompt}}}
`,
});

const askGeminiFlow = ai.defineFlow(
  {
    name: 'askGeminiFlow',
    inputSchema: AskGeminiInputSchema,
    outputSchema: AskGeminiOutputSchema,
  },
  async (input) => {
    const {output} = await geminiPrompt(input);
    if (!output) {
      throw new Error('No output received from AI model.');
    }
    return output;
  }
);
