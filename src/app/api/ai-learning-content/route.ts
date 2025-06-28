import { NextRequest, NextResponse } from 'next/server';
import { askAI } from '@/ai/flows/ask-gemini-flow';

export async function POST(req: NextRequest) {
  try {
    const { onboardingAnswers, batchIndex = 0 } = await req.json();

    // Generate personalized learning content based on user's onboarding answers
    const prompt = `
      User's onboarding answers: ${JSON.stringify(onboardingAnswers)}
      Batch number: ${batchIndex}
      
      Generate 3 personalized learning items (articles or videos) for this user. This is batch ${batchIndex}, so make sure the content is different from previous batches.
      
      Analyze the user's onboarding answers and create learning content that's specifically relevant to their health situation.
      
      Focus on different aspects for different batches:
      - Batch 0: Primary health concerns and general wellness
      - Batch 1: Nutrition and diet based on their eating habits
      - Batch 2: Exercise and movement based on their activity level
      - Batch 3: Sleep and recovery based on their sleep patterns
      - Batch 4: Stress management based on their stress levels
      - Batch 5+: Rotate through the above categories
      
      For each item, create:
      - A compelling title that addresses their specific needs
      - A brief snippet that explains the value
      - Relevant tags based on their health profile
      - Choose between 'article' or 'video' type
      
      Respond ONLY as a JSON array with 3 objects:
      [
        {
          "id": "unique-id-1",
          "type": "article",
          "title": "Specific title based on user's needs",
          "snippet": "Brief description of what they'll learn (1-2 sentences)",
          "source": "Credible source name",
          "imageUrl": "https://placehold.co/600x400.png",
          "tags": ["Relevant", "Tags", "Based", "On", "User", "Profile"],
          "link": "https://example.com/article1",
          "imageHint": "descriptive image hint"
        },
        {
          "id": "unique-id-2", 
          "type": "video",
          "title": "Another specific title",
          "snippet": "Brief description",
          "source": "Credible source name",
          "imageUrl": "https://placehold.co/600x400.png",
          "tags": ["Relevant", "Tags"],
          "link": "https://example.com/video1",
          "imageHint": "descriptive image hint"
        },
        {
          "id": "unique-id-3",
          "type": "article", 
          "title": "Third specific title",
          "snippet": "Brief description",
          "source": "Credible source name",
          "imageUrl": "https://placehold.co/600x400.png",
          "tags": ["Relevant", "Tags"],
          "link": "https://example.com/article2",
          "imageHint": "descriptive image hint"
        }
      ]
      
      Do not include any text outside the JSON array.
      If you cannot generate content, return a default array with placeholder content.
    `;

    // Call AI
    const aiResult = await askAI({ prompt });
    let suggestions;
    try {
      suggestions = JSON.parse(aiResult.response || '[]');
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      suggestions = [];
    }

    // Generate fallback content based on user's answers
    const generateFallbackContent = (answers: any, batch: number) => {
      const contentSets = [
        [
          {
            id: 'fallback-1',
            type: 'article',
            title: "Understanding Your Digestive Health",
            snippet: "Learn about the factors that influence your gut health and how to optimize your digestive wellness.",
            source: "Wellness Today",
            imageUrl: "https://placehold.co/600x400.png",
            tags: ["Digestive Health", "Wellness", "Education"],
            link: "https://example.com/article1",
            imageHint: "digestive health illustration"
          },
          {
            id: 'fallback-2',
            type: 'video',
            title: "Nutrition for Energy and Vitality",
            snippet: "Discover how your diet choices impact your daily energy levels and overall well-being.",
            source: "Health Channel",
            imageUrl: "https://placehold.co/600x400.png",
            tags: ["Nutrition", "Energy", "Diet"],
            link: "https://example.com/video1",
            imageHint: "healthy food preparation"
          },
          {
            id: 'fallback-3',
            type: 'article',
            title: "Movement and Physical Wellness",
            snippet: "Explore how regular physical activity can improve your health and reduce digestive discomfort.",
            source: "Fitness Hub",
            imageUrl: "https://placehold.co/600x400.png",
            tags: ["Exercise", "Wellness", "Movement"],
            link: "https://example.com/article2",
            imageHint: "person exercising"
          }
        ],
        [
          {
            id: 'fallback-4',
            type: 'article',
            title: "Sleep Quality and Recovery",
            snippet: "Understand the connection between quality sleep and your digestive health.",
            source: "Sleep Science",
            imageUrl: "https://placehold.co/600x400.png",
            tags: ["Sleep", "Recovery", "Health"],
            link: "https://example.com/article3",
            imageHint: "peaceful sleep scene"
          },
          {
            id: 'fallback-5',
            type: 'video',
            title: "Stress Management for Gut Health",
            snippet: "Learn techniques to manage stress and its impact on your digestive system.",
            source: "Mindful Living",
            imageUrl: "https://placehold.co/600x400.png",
            tags: ["Stress", "Mental Health", "Meditation"],
            link: "https://example.com/video2",
            imageHint: "meditation practice"
          },
          {
            id: 'fallback-6',
            type: 'article',
            title: "Building Healthy Habits",
            snippet: "Discover how small daily changes can lead to significant improvements in your health.",
            source: "Wellness Weekly",
            imageUrl: "https://placehold.co/600x400.png",
            tags: ["Habits", "Lifestyle", "Wellness"],
            link: "https://example.com/article4",
            imageHint: "daily routine illustration"
          }
        ]
      ];
      
      return contentSets[batch % contentSets.length];
    };

    const fallbackContent = generateFallbackContent(onboardingAnswers, batchIndex);

    // Ensure we have exactly 3 items with intelligent fallbacks
    const result = Array.isArray(suggestions) && suggestions.length >= 3 
      ? suggestions.slice(0, 3) 
      : fallbackContent;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in ai-learning-content API:', error);
    
    // Return fallback content on error
    return NextResponse.json([
      {
        id: 'error-1',
        type: 'article',
        title: "Understanding Your Digestive Health",
        snippet: "Learn about the factors that influence your gut health and how to optimize your digestive wellness.",
        source: "Wellness Today",
        imageUrl: "https://placehold.co/600x400.png",
        tags: ["Digestive Health", "Wellness", "Education"],
        link: "https://example.com/article1",
        imageHint: "digestive health illustration"
      },
      {
        id: 'error-2',
        type: 'video',
        title: "Nutrition for Energy and Vitality",
        snippet: "Discover how your diet choices impact your daily energy levels and overall well-being.",
        source: "Health Channel",
        imageUrl: "https://placehold.co/600x400.png",
        tags: ["Nutrition", "Energy", "Diet"],
        link: "https://example.com/video1",
        imageHint: "healthy food preparation"
      },
      {
        id: 'error-3',
        type: 'article',
        title: "Movement and Physical Wellness",
        snippet: "Explore how regular physical activity can improve your health and reduce digestive discomfort.",
        source: "Fitness Hub",
        imageUrl: "https://placehold.co/600x400.png",
        tags: ["Exercise", "Wellness", "Movement"],
        link: "https://example.com/article2",
        imageHint: "person exercising"
      }
    ]);
  }
} 