import {genkit} from 'genkit';
import {openAI} from 'genkitx-openai';
import { config } from 'dotenv';

// Ensure .env variables are loaded at the earliest point
config();

export const ai = genkit({
  plugins: [openAI()],
  model: 'openai/gpt-4o',
});
