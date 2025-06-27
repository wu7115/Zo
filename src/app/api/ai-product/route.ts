import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/data/products';

export async function POST(req: NextRequest) {
  try {
    const { onboardingAnswers, batchIndex = 0 } = await req.json();

    // Cycle through the 8 products based on batch index
    const productIndex = batchIndex % products.length;
    const product = products[productIndex];

    // Ensure all required fields are present
    const result = {
      id: product.id,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      link: product.link,
      price: product.price
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in ai-product API:', error);
    // Return the first product as fallback
    const fallbackProduct = products[0];
    return NextResponse.json({
      id: fallbackProduct.id,
      name: fallbackProduct.name,
      description: fallbackProduct.description,
      imageUrl: fallbackProduct.imageUrl,
      link: fallbackProduct.link,
      price: fallbackProduct.price
    });
  }
} 