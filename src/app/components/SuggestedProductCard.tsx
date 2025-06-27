import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import type { SuggestedProductFeedData } from '@/app/types/feed';
import { ShoppingCart, Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function SuggestedProductCard({ data }: { data: SuggestedProductFeedData }) {
  const [imageError, setImageError] = useState(false);
  
  // Add fallbacks for missing data
  const name = data?.name || "Health Product";
  const description = data?.description || "A product to support your health goals.";
  const price = data?.price || "$19.99";
  const originalPrice = (data as any)?.originalPrice;
  const rating = (data as any)?.rating;
  const sales = (data as any)?.sales;
  const source = (data as any)?.source; // For AI products
  const link = data?.link || "#";
  const imageUrl = data?.imageUrl || "/images/products/BoneBroth.png";

  // Check if this is an AI product (has source field)
  const isAiProduct = !!source;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2 text-accent" />
            {name}
          </div>
          {isAiProduct && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {source}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {/* Product Image - Only show for Zo products */}
          {!isAiProduct && (
            <div className="relative w-full h-48 rounded-md overflow-hidden bg-card">
              <Image 
                src={imageUrl} 
                alt={name} 
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setImageError(true)}
              />
            </div>
          )}
          
          {/* Rating and Sales */}
          {(rating || sales) && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {rating && (
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                  {rating}
                </div>
              )}
              {sales && (
                <span>{sales} sold</span>
              )}
            </div>
          )}
          
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          
          {/* Price Display */}
          <div className="flex items-center gap-2 mb-2">
            <div className="text-lg font-bold text-accent">{price}</div>
            {originalPrice && (
              <div className="text-sm text-muted-foreground line-through">{originalPrice}</div>
            )}
          </div>
          
          {link && link !== "#" ? (
            <Link href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center">
              {isAiProduct ? 'View on ' + source : 'View Product'} 
              <ExternalLink className="h-4 w-4 ml-1" />
            </Link>
          ) : (
            <span className="text-xs text-muted-foreground flex items-center">
              No product link available
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 