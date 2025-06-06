
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingCart } from "lucide-react";

interface RecommendedProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  link: string;
}

const recommendedProducts: RecommendedProduct[] = [
  {
    id: '1',
    name: 'Probiotic Blend Forte',
    description: 'Supports gut diversity & immune health.',
    imageUrl: 'https://placehold.co/200x200.png',
    imageHint: 'probiotic bottle',
    link: '/buy#probiotics',
  },
  {
    id: '2',
    name: 'Mindful Moment Tea',
    description: 'Calming herbal infusion for relaxation.',
    imageUrl: 'https://placehold.co/200x200.png',
    imageHint: 'tea box herbal',
    link: '/buy#recovery-coffee', // Assuming tea might be near coffee
  },
  {
    id: '3',
    name: 'Omega-3 Power Capsules',
    description: 'Essential fatty acids for brain & heart.',
    imageUrl: 'https://placehold.co/200x200.png',
    imageHint: 'supplement capsules',
    link: '/buy#bone-broth', // General supplement category
  },
];

export function ProductRecommendationsCard() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary flex items-center">
          <Sparkles className="h-6 w-6 mr-2 text-accent" />
          Podium Picks For You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendedProducts.slice(0, 2).map((product) => ( // Show 2 products in grid for now
            <Card key={product.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={product.imageHint}
                />
              </div>
              <CardContent className="p-3">
                <h3 className="text-md font-semibold text-primary mb-1 truncate">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-2 h-8 overflow-hidden">{product.description}</p>
                <Button variant="outline" size="sm" className="w-full text-primary hover:bg-muted/50" asChild>
                  <Link href={product.link}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> View Product
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {recommendedProducts.length > 2 && (
          <div className="text-center">
            <Button variant="link" asChild>
              <Link href="/buy">
                See All Recommendations
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
