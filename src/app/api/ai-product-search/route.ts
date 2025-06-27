import { NextRequest, NextResponse } from 'next/server';
import { askAI } from '@/ai/flows/ask-gemini-flow';

export async function POST(req: NextRequest) {
  try {
    const { onboardingAnswers, batchIndex = 0 } = await req.json();

    // Improved prompt for Gemini to find relevant online products
    const prompt = `
      User's onboarding answers: ${JSON.stringify(onboardingAnswers)}
      Search for 2 relevant online health/wellness products that would benefit this user.
      Focus on gut health, IBS, sleep, nutrition, or wellness products available online.
      
      Respond ONLY as a JSON array with 2 products:
      [
        {
          "id": "ai-product-1",
          "name": "Product Name",
          "description": "Brief description (1-2 sentences max).",
          "link": "https://amazon.com",
          "price": "$19.99",
          "source": "Amazon",
          "rating": "4.3/5 ⭐",
          "sales": "1,234 sold"
        },
        {
          "id": "ai-product-2", 
          "name": "Product Name",
          "description": "Brief description (1-2 sentences max).",
          "link": "https://amazon.com",
          "price": "$24.99",
          "source": "Amazon",
          "rating": "4.1/5 ⭐",
          "sales": "567 sold"
        }
      ]
      
      Focus on supplements, wellness products, or health tools.
      Do not include any text outside the JSON array.
    `;

    // Call AI
    const aiResult = await askAI({ prompt });
    let suggestions;
    try {
      suggestions = JSON.parse(aiResult.response || '[]');
    } catch {
      suggestions = [];
    }

    // Ensure we have valid products with fallbacks
    const validProducts = Array.isArray(suggestions) ? suggestions.slice(0, 2) : [];
    
    const result = validProducts.map((product, index) => ({
      id: product.id || `ai-product-${batchIndex}-${index + 1}`,
      name: product.name || "Health Product",
      description: product.description || "A wellness product to support your health goals.",
      imageUrl: "", // No image for AI products
      link: product.link || "https://amazon.com",
      price: product.price || "$19.99",
      source: product.source || "Online Store",
      rating: product.rating || "4.0/5 ⭐",
      sales: product.sales || "100+ sold"
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in ai-product-search API:', error);
    // Return default AI products on error
    return NextResponse.json([
      {
        id: `ai-product-error-1-${Date.now()}`,
        name: "Probiotic Supplement",
        description: "Advanced probiotic formula designed to support digestive health and immune function.",
        imageUrl: "", // No image for AI products
        link: "https://amazon.com",
        price: "$19.99",
        source: "Amazon",
        rating: "4.3/5 ⭐",
        sales: "1,234 sold"
      },
      {
        id: `ai-product-error-2-${Date.now()}`,
        name: "Sleep Support Formula",
        description: "Natural sleep aid with melatonin and calming herbs to improve sleep quality.",
        imageUrl: "", // No image for AI products
        link: "https://amazon.com",
        price: "$24.99",
        source: "Amazon",
        rating: "4.1/5 ⭐",
        sales: "567 sold"
      }
    ]);
  }
} 