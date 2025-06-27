import { NextRequest, NextResponse } from 'next/server';
import { askAI } from '@/ai/flows/ask-gemini-flow';

export async function POST(req: NextRequest) {
  try {
    const { onboardingAnswers, trackingQuestions } = await req.json();

    const prompt = `
Given the user's onboarding answers (JSON) and a list of daily tracking questions (JSON), assign each question a priority: "high", "medium", or "low". 
Base your decision on which questions are most relevant or impactful for this user. 
Return a JSON array of objects: [{ "id": "question_id", "priority": "high" | "medium" | "low" }].

User's onboarding answers:
${JSON.stringify(onboardingAnswers, null, 2)}

Tracking questions:
${JSON.stringify(trackingQuestions, null, 2)}

Respond ONLY with the JSON array, no extra text.`;

    // Call AI
    const aiResult = await askAI({ prompt });
    let priorities;
    try {
      priorities = JSON.parse(aiResult.response || '[]');
    } catch {
      priorities = [];
    }

    // Validate and fallback if needed
    if (!Array.isArray(priorities)) priorities = [];
    priorities = priorities.filter(
      (item) => item && typeof item.id === 'string' && ['high', 'medium', 'low'].includes(item.priority)
    );

    return NextResponse.json(priorities);
  } catch (error) {
    console.error('Error in ai-prioritize-tracking-questions API:', error);
    // Return a default response on error
    return NextResponse.json([]);
  }
} 