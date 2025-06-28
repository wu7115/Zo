import { NextRequest, NextResponse } from 'next/server';
import { askAI } from '@/ai/flows/ask-gemini-flow';

export async function POST(req: NextRequest) {
  try {
    const { onboardingAnswers, batchIndex = 0 } = await req.json();

    // Improved prompt for GPT-4o with better personalization
    const prompt = `
      User's onboarding answers: ${JSON.stringify(onboardingAnswers)}
      Batch number: ${batchIndex}
      
      Generate a personalized health topic for this user. This is batch ${batchIndex}, so make sure this topic is different from previous batches.
      
      Analyze the user's onboarding answers and create a topic that's specifically relevant to their health situation.
      
      Focus on different aspects for different batches:
      - Batch 0: Primary health concerns from their answers
      - Batch 1: Nutrition and diet based on their eating habits
      - Batch 2: Exercise and movement based on their activity level
      - Batch 3: Sleep and recovery based on their sleep patterns
      - Batch 4: Stress management based on their stress levels
      - Batch 5+: Rotate through the above categories
      
      Make the title specific and descriptive based on their actual answers.
      Keep the description to 1-2 sentences maximum.
      
      Respond ONLY as a JSON object with:
      {
        "id": "unique-topic-id",
        "title": "Specific, descriptive topic title based on user's answers",
        "description": "Brief description (1-2 sentences max) explaining why this topic is relevant to them.",
        "imageUrl": "https://placehold.co/600x400.png?text=Topic",
        "link": "https://example.com/topic",
        "tags": ["Personalized", "Health", "Relevant Tag"]
      }
      
      Do not include any text outside the JSON object.
      If you cannot suggest a topic, return a default object with a placeholder link and tags.
    `;

    // Call AI
    const aiResult = await askAI({ prompt });
    let suggestion;
    try {
      suggestion = JSON.parse(aiResult.response || '{}');
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      suggestion = {};
    }

    // Generate fallback based on user's actual answers
    const generateFallbackTopic = (answers: any, batch: number) => {
      const topics = [
        {
          title: "Understanding Your Digestive Health",
          description: "Learn about the factors that influence your gut health and how to optimize your digestive wellness.",
          tags: ["Digestive Health", "Wellness"]
        },
        {
          title: "Nutrition for Energy and Vitality",
          description: "Discover how your diet choices impact your daily energy levels and overall well-being.",
          tags: ["Nutrition", "Energy"]
        },
        {
          title: "Movement and Physical Wellness",
          description: "Explore how regular physical activity can improve your health and reduce digestive discomfort.",
          tags: ["Exercise", "Wellness"]
        },
        {
          title: "Sleep Quality and Recovery",
          description: "Understand the connection between quality sleep and your digestive health.",
          tags: ["Sleep", "Recovery"]
        },
        {
          title: "Stress Management for Gut Health",
          description: "Learn techniques to manage stress and its impact on your digestive system.",
          tags: ["Stress", "Mental Health"]
        }
      ];
      
      return topics[batch % topics.length];
    };

    const fallback = generateFallbackTopic(onboardingAnswers, batchIndex);

    // Ensure all required fields are present with intelligent fallbacks
    const result = {
      id: suggestion.id || `topic-${batchIndex}-${Date.now()}`,
      title: suggestion.title || fallback.title,
      description: suggestion.description || fallback.description,
      imageUrl: suggestion.imageUrl || "https://placehold.co/600x400.png?text=Topic",
      link: suggestion.link || "https://example.com/topic",
      tags: Array.isArray(suggestion.tags) ? suggestion.tags : fallback.tags
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in ai-topic API:', error);
    
    // Generate a fallback based on batch index
    const fallbackTopics = [
      {
        title: "Understanding Your Digestive Health",
        description: "Learn about the factors that influence your gut health and how to optimize your digestive wellness.",
        tags: ["Digestive Health", "Wellness"]
      },
      {
        title: "Nutrition for Energy and Vitality", 
        description: "Discover how your diet choices impact your daily energy levels and overall well-being.",
        tags: ["Nutrition", "Energy"]
      },
      {
        title: "Movement and Physical Wellness",
        description: "Explore how regular physical activity can improve your health and reduce digestive discomfort.",
        tags: ["Exercise", "Wellness"]
      },
      {
        title: "Sleep Quality and Recovery",
        description: "Understand the connection between quality sleep and your digestive health.",
        tags: ["Sleep", "Recovery"]
      },
      {
        title: "Stress Management for Gut Health",
        description: "Learn techniques to manage stress and its impact on your digestive system.",
        tags: ["Stress", "Mental Health"]
      }
    ];
    
    const batchIndex = 0; // Default to first topic
    const fallback = fallbackTopics[batchIndex];
    
    return NextResponse.json({
      id: `topic-error-${Date.now()}`,
      title: fallback.title,
      description: fallback.description,
      imageUrl: "https://placehold.co/600x400.png?text=Topic",
      link: "https://example.com/topic",
      tags: fallback.tags
    });
  }
} 