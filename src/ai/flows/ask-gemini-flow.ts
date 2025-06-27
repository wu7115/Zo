'use server';
/**
 * @fileOverview A Genkit flow for general purpose chat with AI.
 *
 * - askAI - A function that takes a user prompt and returns AI's response.
 * - AskAIInput - The input type for the askAI function.
 * - AskAIOutput - The return type for the askAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskAIInputSchema = z.object({
  prompt: z.string().describe('The user question or prompt for the AI.'),
});
export type AskAIInput = z.infer<typeof AskAIInputSchema>;

const AskAIOutputSchema = z.object({
  response: z.string().describe("The AI's response to the user's prompt."),
});
export type AskAIOutput = z.infer<typeof AskAIOutputSchema>;

export async function askAI(input: AskAIInput): Promise<AskAIOutput> {
  return askAIFlow(input);
}

const aiPrompt = ai.definePrompt({
  name: 'askAIPrompt',
  input: {schema: AskAIInputSchema},
  output: {schema: AskAIOutputSchema},
  prompt: `You are a helpful AI assistant. Please respond to the following user prompt:
{{{prompt}}}
`,
});

const askAIFlow = ai.defineFlow(
  {
    name: 'askAIFlow',
    inputSchema: AskAIInputSchema,
    outputSchema: AskAIOutputSchema,
  },
  async (input) => {
    const {output} = await aiPrompt(input);
    if (!output) {
      throw new Error('No output received from AI model.');
    }
    return output;
  }
);
