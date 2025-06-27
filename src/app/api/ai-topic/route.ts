import { NextRequest, NextResponse } from 'next/server';
import { askAI } from '@/ai/flows/ask-gemini-flow';

export async function POST(req: NextRequest) {
  try {
    const { onboardingAnswers } = await req.json();

    // Improved prompt for Gemini
    const prompt = `
      User's onboarding answers: ${JSON.stringify(onboardingAnswers)}
      Suggest a personalized health topic for this user.
      Make the title specific and descriptive (e.g., "Managing IBS and Improving Sleep Quality").
      Keep the description to 1-2 sentences maximum.
      Respond ONLY as a JSON object with:
      {
        "id": "unique-topic-id",
        "title": "Specific, descriptive topic title",
        "description": "Brief description (1-2 sentences max).",
        "imageUrl": "https://placehold.co/600x400.png?text=Topic",
        "link": "https://example.com/topic", // Always include a real or placeholder URL
        "tags": ["Personalized", "Health"]
      }
      Do not include any text outside the JSON object.
      If you cannot suggest a topic, return a default object with a placeholder link and tags.
    `;

    // Call AI
    const aiResult = await askAI({ prompt });
    let suggestion;
    try {
      suggestion = JSON.parse(aiResult.response || '{}');
    } catch {
      suggestion = {};
    }

    // Ensure all required fields are present with fallbacks
    const result = {
      id: suggestion.id || `topic-${Date.now()}`,
      title: suggestion.title || "Managing IBS and Improving Sleep Quality",
      description: suggestion.description || "Learn how to manage IBS symptoms and improve your sleep quality through diet and lifestyle changes.",
      imageUrl: suggestion.imageUrl || "https://placehold.co/600x400.png?text=Topic",
      link: suggestion.link || "https://example.com/topic",
      tags: Array.isArray(suggestion.tags) ? suggestion.tags : ["Personalized", "Health"]
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in ai-topic API:', error);
    // Return a default response on error
    return NextResponse.json({
      id: `topic-error-${Date.now()}`,
      title: "Managing IBS and Improving Sleep Quality",
      description: "Learn how to manage IBS symptoms and improve your sleep quality through diet and lifestyle changes.",
      imageUrl: "https://placehold.co/600x400.png?text=Topic",
      link: "https://example.com/topic",
      tags: ["Personalized", "Health"]
    });
  }
} 