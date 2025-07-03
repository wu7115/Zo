import { NextRequest, NextResponse } from 'next/server';
import { askAI } from '@/ai/flows/ask-gemini-flow';

export async function POST(req: NextRequest) {
  try {
    const { page, onboardingAnswers, part2Answers, trackingAnswers, trackingHistory } = await req.json();
    let context = '';
    let prompt = '';
    if (page === 'track') {
      context = `User's tracking answers: ${JSON.stringify(trackingAnswers)}\nUser's onboarding answers: ${JSON.stringify(onboardingAnswers)}\nUser's part 2 answers: ${JSON.stringify(part2Answers)}\nUser's tracking history (last 7 days): ${JSON.stringify(trackingHistory)}`;
      prompt = `You are an AI assistant for a health tracking app. The user is on the tracking page.\n\nGiven the user's answers and tracking data below, generate a brief, actionable summary (max 3 bullet points) that:\n- References specific tasks (by name or question) the user missed today\n- Suggests what the user should do next (e.g., \"Log your mood\", \"Complete your water intake task\")\n- Optionally highlight the most important or high-priority task\n- Only use the user's actual tracking data, not generic health advice.\n\n${context}`;
    } else if (page === 'buy') {
      context = `User's onboarding answers: ${JSON.stringify(onboardingAnswers)}\nUser's part 2 answers: ${JSON.stringify(part2Answers)}`;
      prompt = `You are an AI assistant for a health product shop. The user is on the buy page.\n\nGiven the user's answers below, recommend up to 2 products that are most relevant to their needs.\n- Reference the user's goals, preferences, or issues from onboarding and survey answers.\n- Be concise and actionable.\n- Format as a markdown list.\n\n${context}`;
    } else if (page === 'learn') {
      context = `User's onboarding answers: ${JSON.stringify(onboardingAnswers)}\nUser's part 2 answers: ${JSON.stringify(part2Answers)}`;
      prompt = `You are an AI assistant for a health education app. The user is on the learn page.\n\nGiven the user's answers below, suggest up to 2 articles or topics that would be most helpful for their current goals or challenges.\n- Reference the user's goals, preferences, or issues from onboarding and survey answers.\n- Be concise and actionable.\n- Format as a markdown list.\n\n${context}`;
    } else if (page === 'diagnose') {
      context = `User's onboarding answers: ${JSON.stringify(onboardingAnswers)}\nUser's part 2 answers: ${JSON.stringify(part2Answers)}`;
      prompt = `You are an AI assistant for a health self-diagnosis tool. The user is on the diagnose page.\n\nGiven the user's answers below, provide a brief, actionable suggestion for what the user should focus on next in their health journey.\n- Reference the user's goals, symptoms, or issues from onboarding and survey answers.\n- Be concise and actionable.\n- Format as a single markdown bullet point.\n\n${context}`;
    } else {
      prompt = `You are an AI assistant. Provide a brief, relevant suggestion for the user based on their data.`;
    }

    const aiResult = await askAI({ prompt });
    return NextResponse.json({ suggestion: aiResult.response });
  } catch (error) {
    return NextResponse.json({ suggestion: 'AI Pencil is unavailable right now.' }, { status: 500 });
  }
} 