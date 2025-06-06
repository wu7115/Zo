
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
    link: '/buy#recovery-coffee', 
  },
  {
    id: '3',
    name: 'Omega-3 Power Capsules',
    description: 'Essential fatty acids for brain & heart.',
    imageUrl: 'https://placehold.co/200x200.png',
    imageHint: 'supplement capsules',
    link: '/buy#bone-broth', 
  },
  {
    id: '4',
    name: 'Energizing Electrolytes',
    description: 'Replenish and hydrate post-workout.',
    imageUrl: 'https://placehold.co/200x200.png',
    imageHint: 'electrolyte powder',
    link: '/buy#hydration-powder',
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
      <CardContent>
        <div className="flex overflow-x-auto space-x-4 pb-2 -mx-4 px-4">
          {recommendedProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow w-52 flex-shrink-0">
              <div className="relative w-full aspect-square">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={product.imageHint}
                />
              </div>
              <CardContent className="p-3 flex flex-col h-[calc(100%-theme(spacing.52))]"> {/* Assuming aspect-square image, so height is w-52 */}
                <h3 className="text-md font-semibold text-primary mb-1 truncate">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-2 h-10 line-clamp-2 flex-grow">{product.description}</p>
                <Button variant="outline" size="sm" className="w-full text-primary hover:bg-muted/50 mt-auto" asChild>
                  <Link href={product.link}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> View Product
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
