
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-daily-goal.ts';
import '@/ai/flows/ask-gemini-flow.ts';
import '@/ai/flows/personalize-gut-score-insight-flow.ts';
import '@/ai/flows/get-item-benefit-flow.ts'; // Added new flow
