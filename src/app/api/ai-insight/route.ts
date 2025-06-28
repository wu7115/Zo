import { NextRequest, NextResponse } from 'next/server';
import { askAI } from '@/ai/flows/ask-gemini-flow';

export async function POST(req: NextRequest) {
  try {
    const { onboardingAnswers } = await req.json();
    const batchIndex = onboardingAnswers.batchIndex || 0;

    // Improved prompt for GPT-4o
    const prompt = `
      User's onboarding answers: ${JSON.stringify(onboardingAnswers)}
      Batch number: ${batchIndex}
      
      Generate a personalized health insight for this user. This is batch ${batchIndex}, so make sure this insight is different from previous batches.
      
      Create:
      1. A short, descriptive title (3-6 words) that captures the main point
      2. A brief statement (1 sentence, under 20 words) that states the key insight
      3. A rationale (2-3 sentences, under 60 words) that explains why this matters for their health
      
      Focus on different aspects of health for different batches:
      - Batch 0: General wellness tips
      - Batch 1: Nutrition and diet
      - Batch 2: Exercise and movement
      - Batch 3: Sleep and recovery
      - Batch 4: Stress management
      - Batch 5+: Rotate through the above categories
      
      Respond ONLY as a JSON object with:
      {
        "id": "unique-insight-id",
        "title": "Short descriptive title (3-6 words)",
        "statement": "A brief statement about the insight (under 20 words)",
        "rationale": "A brief explanation of why this matters (under 60 words)",
        "sourceUrl": "https://example.com/source" // Always include a real or placeholder URL
      }
      Do not include any text outside the JSON object.
      If you cannot generate a fact, return a default object with a generic insight and a placeholder URL.
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
      id: suggestion.id || `insight-${batchIndex}-${Date.now()}`,
      title: suggestion.title || "Fiber for IBS Relief",
      statement: suggestion.statement || "Fiber helps manage IBS symptoms effectively.",
      rationale: suggestion.rationale || "Soluble fiber absorbs water and forms a gel that helps regulate bowel movements. This can reduce both diarrhea and constipation, providing relief for IBS sufferers.",
      sourceUrl: suggestion.sourceUrl || "https://example.com/source"
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in ai-insight API:', error);
    // Return a default response on error
    return NextResponse.json({
      id: `insight-error-${Date.now()}`,
      title: "Fiber for IBS Relief",
      statement: "Fiber helps manage IBS symptoms effectively.",
      rationale: "Soluble fiber absorbs water and forms a gel that helps regulate bowel movements. This can reduce both diarrhea and constipation, providing relief for IBS sufferers.",
      sourceUrl: "https://example.com/source"
    });
  }
} 