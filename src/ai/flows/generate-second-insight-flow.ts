'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ---- SCHEMAS ----

const GenerateSecondInsightInputSchema = z.object({
  fullAnswers: z.record(z.string(), z.any()),
});
export type GenerateSecondInsightInput = z.infer<typeof GenerateSecondInsightInputSchema>;

const GenerateSecondInsightOutputSchema = z.object({
  categoryInsights: z.array(
    z.object({
      category: z.string(),
      recommendation: z.string(),
    })
  ),
});
export type GenerateSecondInsightOutput = z.infer<typeof GenerateSecondInsightOutputSchema>;

const InternalInputSchema = z.object({
  answersJson: z.string(),
});

// ---- PROMPTS ----

const prompt = ai.definePrompt({
  name: 'generateCategoryInsights',
  input: { schema: InternalInputSchema },
  output: { schema: GenerateSecondInsightOutputSchema },
  prompt: `
You are Zoe, the friendly AI wellness coach inside the Podium app.

The user has completed a comprehensive diagnostic survey. Based on the JSON-formatted answers below, generate a set of personalized wellness insights.

Return the output as a JSON array of objects like this:

[
  { "category": "Diet & Nutrition", "recommendation": "You may benefit from eating more fiber, such as leafy greens and chia seeds." },
  { "category": "Stress, Sleep, and Recovery", "recommendation": "Getting consistent sleep (7–8 hours) could improve both gut function and energy." }
]

Use only the following categories:
- Diet & Nutrition
- Digestive Health & Symptoms
- Non-Gut Health Conditions
- Gut-to-Brain / Nervous System
- Medication & Supplement Use
- Lifestyle Factors
- Stress, Sleep, and Recovery

Each recommendation should be:
- Personalized and friendly
- Brief (1–2 sentences max)
- Helpful and actionable
- Avoid clinical or diagnostic statements
- Based on what's shared in the answers

User's Answers:
\`\`\`json
{{{answersJson}}}
\`\`\`
`,
});

// ---- FLOWS ----

const generateSecondInsightFlow = ai.defineFlow(
  {
    name: 'generateSecondInsightFlow',
    inputSchema: GenerateSecondInsightInputSchema,
    outputSchema: GenerateSecondInsightOutputSchema,
  },
  async (input) => {
    const answersJson = JSON.stringify(input.fullAnswers, null, 2);
    const { output } = await prompt({ answersJson });
    if (!output) throw new Error('No insights received from AI');
    return output;
  }
);

export async function generateSecondInsight(input: GenerateSecondInsightInput): Promise<GenerateSecondInsightOutput> {
  return generateSecondInsightFlow(input);
}

// ---- NEW: Tracking Plan Prompt ----

export const generateTrackingPlan = ai.definePrompt({
  name: 'generateTrackingPlan',
  input: { schema: z.object({
    answersJson: z.string(),
    categoryInsights: z.string(),
  }) },
  output: { schema: z.object({
    activities: z.array(
      z.object({
        categoryId: z.string(),
        title: z.string(),
        dailyTasks: z.array(
          z.object({
            id: z.string(),
            goal: z.string(),
            question: z.string(),
            inputType: z.string(),
            time: z.enum(['morning', 'afternoon', 'night']).nullable().optional(),
            options: z.array(z.string()).optional(),
            placeholder: z.string().optional(),
          })
        ),
        weeklyTasks: z.array(
          z.object({
            id: z.string(),
            goal: z.string(),
            question: z.string(),
            inputType: z.string(),
            options: z.array(z.string()).optional(),
            placeholder: z.string().optional(),
          })
        ),
      })
    ),
  }) },
  prompt: `
You are Zoe, the friendly AI inside the Podium app.

Based on:
1. The user's raw answers (answersJson),
2. Their category-based insights (categoryInsights),

Use only the following categories and their exact IDs and titles:
- Diet & Nutrition (categoryId: diet-&-nutrition, title: Diet & Nutrition)
- Digestive Health & Symptoms (categoryId: digestive-health-&-symptoms, title: Digestive Health & Symptoms)
- Non-Gut Health Conditions (categoryId: non-gut-health-conditions, title: Non-Gut Health Conditions)
- Gut-to-Brain / Nervous System (categoryId: gut-to-brain-&-nervous-system, title: Gut-to-Brain / Nervous System)
- Medication & Supplement Use (categoryId: medication-&-supplement-use, title: Medication & Supplement Use)
- Lifestyle Factors (categoryId: lifestyle-factors, title: Lifestyle Factors)
- Stress, Sleep, and Recovery (categoryId: sleep-&-recovery, title: Stress, Sleep, and Recovery)

For daily tasks, add a 'time' field with one of: "morning", "afternoon", "night", or null if not time-specific.
If a daily goal is too heavy for one period, split it into multiple daily tasks with different 'time' values. For example, instead of "Eat at least 5 servings of vegetables today", split into:
- "Eat at least 1 serving of vegetables in the morning" (time: "morning")
- "Eat at least 2 servings of vegetables in the afternoon" (time: "afternoon")
- "Eat at least 2 servings of vegetables at night" (time: "night")

Your audience is health-conscious, data-savvy, and appreciates evidence-based, clinically sound recommendations.
- Make each task specific, measurable, and actionable.
- Where possible, reference best practices in nutrition, lifestyle, or clinical guidelines (but do not cite studies directly).
- Avoid generic or overly basic tasks (e.g., "Drink water"); instead, use tasks like "Track your water intake and aim for 2.5L, adjusting for activity level."
- Include tasks that encourage self-tracking, reflection, or habit-building (e.g., "Log your fiber intake and note any digestive changes").
- Use professional, supportive, and clear language.
- For supplement or medication tasks, always include a reminder to consult with a healthcare provider before making changes.
- For weekly tasks, consider including review, reflection, or trend analysis (e.g., "Review your sleep data for the week and identify patterns").

For each category, generate up to 3 daily tasks and up to 2 weekly tasks. Each task should have:
- goal: a brief, actionable goal for the user (e.g., "Drink 2L water today")
- question: a short, clear question to ask the user (e.g., "How much water did you drink today?")
- inputType: one of 'number', 'boolean', 'options', 'rating-5', etc.
- time: (for daily tasks) "morning", "afternoon", "night", or null
- options: (if applicable)

Output format:
[
  {
    "categoryId": "diet-&-nutrition",
    "title": "Diet & Nutrition",
    "dailyTasks": [
      {
        "id": "d1",
        "goal": "Eat at least 1 serving of vegetables in the morning",
        "question": "How many servings of vegetables did you eat in the morning?",
        "inputType": "number",
        "time": "morning"
      },
      {
        "id": "d2",
        "goal": "Eat at least 2 servings of vegetables in the afternoon",
        "question": "How many servings of vegetables did you eat in the afternoon?",
        "inputType": "number",
        "time": "afternoon"
      },
      {
        "id": "d3",
        "goal": "Eat at least 2 servings of vegetables at night",
        "question": "How many servings of vegetables did you eat at night?",
        "inputType": "number",
        "time": "night"
      }
    ],
    "weeklyTasks": [
      {
        "id": "w1",
        "goal": "Try a new healthy recipe this week",
        "question": "Did you try a new healthy recipe this week?",
        "inputType": "boolean",
        "options": ["Yes", "No"]
      }
    ]
  }
]

Try to pick 1–3 daily tasks and 1–2 weekly tasks per category. Base your choices on what the insight recommends or implies.
If no insight is available for a category, skip it.
Keep all question texts short, conversational, and clear.
`,
});

// ---- EXPORTED FUNCTION (but only usable from client with both inputs) ----

export async function generateTrackingActivities(input: {
  fullAnswers: any;
  categoryInsights: any;
}) {
  const { fullAnswers, categoryInsights } = input;

  const result = await generateTrackingPlan({
    answersJson: JSON.stringify(fullAnswers, null, 2),
    categoryInsights: JSON.stringify(categoryInsights, null, 2),
  });

  if (!result.output) throw new Error('No activities received from AI');
  return result.output.activities;
}
