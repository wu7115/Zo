'use server';
/**
 * @fileOverview A Genkit flow for generating dynamic community posts.
 *
 * - generateCommunityPost - A function that generates a realistic community post.
 * - GenerateCommunityPostInput - The input type for the generateCommunityPost function.
 * - GenerateCommunityPostOutput - The return type for the generateCommunityPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCommunityPostInputSchema = z.object({
  userContext: z.string().describe('Context about the user to personalize the community post.'),
  batchIndex: z.number().describe('Batch index to ensure variety in generated content.'),
});
export type GenerateCommunityPostInput = z.infer<typeof GenerateCommunityPostInputSchema>;

const GenerateCommunityPostOutputSchema = z.object({
  friendName: z.string().describe('Realistic first and last name for the community member.'),
  friendAvatarFallback: z.string().describe('2-3 letter initials for the avatar fallback.'),
  friendAvatarHint: z.string().describe('AI hint for generating the avatar image.'),
  timestamp: z.string().describe('Realistic timestamp like "2 hours ago" or "Yesterday, 3:45 PM".'),
  activityDetails: z.string().describe('Engaging activity description with emojis and hashtags.'),
  activityImageHint: z.string().describe('AI hint for generating the activity image.'),
  likes: z.number().describe('Realistic number of likes (5-50).'),
  comments: z.number().describe('Realistic number of comments (1-15).'),
});
export type GenerateCommunityPostOutput = z.infer<typeof GenerateCommunityPostOutputSchema>;

export async function generateCommunityPost(input: GenerateCommunityPostInput): Promise<GenerateCommunityPostOutput> {
  return generateCommunityPostFlow(input);
}

const communityPostPrompt = ai.definePrompt({
  name: 'generateCommunityPostPrompt',
  input: {schema: GenerateCommunityPostInputSchema},
  output: {schema: GenerateCommunityPostOutputSchema},
  prompt: `You are generating realistic community posts for a wellness app. Create engaging, diverse content that feels authentic.

User Context: {{{userContext}}}
Batch Index: {{{batchIndex}}}

Generate a community post with:
1. A realistic name (first + last name)
2. 2-3 letter initials for avatar
3. Realistic timestamp (within last 48 hours)
4. Engaging activity description with 1-2 emojis and 1-2 hashtags
5. Realistic engagement numbers

Focus on different activities for different batches:
- Batch 0: Running/Jogging
- Batch 1: Cycling
- Batch 2: Swimming
- Batch 3: Yoga/Meditation
- Batch 4: Hiking/Walking
- Batch 5: Gym workout
- Batch 6: Dance/Zumba
- Batch 7: Team sports
- Batch 8+: Rotate through activities

Make the content feel authentic and inspiring. Include specific details like distances, times, or achievements.

Respond ONLY as a JSON object with the exact fields specified.`,
});

const generateCommunityPostFlow = ai.defineFlow(
  {
    name: 'generateCommunityPostFlow',
    inputSchema: GenerateCommunityPostInputSchema,
    outputSchema: GenerateCommunityPostOutputSchema,
  },
  async (input) => {
    const {output} = await communityPostPrompt(input);
    if (!output) {
      throw new Error('No output received from AI model for community post.');
    }
    return output;
  }
); 