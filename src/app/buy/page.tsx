
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Plus, FlaskConical } from 'lucide-react';

const products = [
  {
    name: 'Bone Broth',
    priceIndicator: 'SS',
    imageUrl: 'https://placehold.co/200x250.png',
    imageHint: 'supplement packet',
  },
  {
    name: 'Hydration Powder',
    priceIndicator: 'SB',
    imageUrl: 'https://placehold.co/200x250.png',
    imageHint: 'hydration sachet',
  },
  {
    name: 'Probiotics',
    priceIndicator: 'SS',
    imageUrl: 'https://placehold.co/200x250.png',
    imageHint: 'probiotic packet',
  },
  {
    name: 'Recovery Coffee',
    priceIndicator: 'SJ',
    imageUrl: 'https://placehold.co/200x250.png',
    imageHint: 'coffee sachet',
  },
  {
    name: 'Bone Broth',
    priceIndicator: 'SS',
    imageUrl: 'https://placehold.co/200x250.png',
    imageHint: 'supplement packet beige',
  },
  {
    name: 'Hydration Powder',
    priceIndicator: 'SB',
    imageUrl: 'https://placehold.co/200x250.png',
    imageHint: 'hydration sachet blue',
  },
];

const testKits = [
  { name: 'ZoBiome', id: 'zobiome' },
  { name: 'Viome', id: 'viome' },
  { name: 'MBT', id: 'mbt' },
];

export default function ShopPage() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-background overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-2xl font-headline text-primary flex items-center">
                <ShoppingCart className="h-7 w-7 mr-2 text-accent" />
                Shop
              </CardTitle>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm border-primary text-primary">Score: 55/100</Badge>
              <Badge variant="outline" className="text-sm border-primary text-primary">Points: 421</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Products</h3>
              <div className="grid grid-cols-2 gap-4">
                {products.map((product, index) => (
                  <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-3 relative aspect-square flex flex-col justify-between items-center">
                      <Button variant="outline" size="icon" className="absolute top-2 right-2 h-7 w-7 bg-background/80 hover:bg-background">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <div className="flex-grow flex items-center justify-center w-full pt-6">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={100}
                          height={125}
                          className="object-contain max-h-[100px]"
                          data-ai-hint={product.imageHint}
                        />
                      </div>
                      <div className="text-center w-full mt-2">
                        <p className="text-sm font-medium text-primary truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.priceIndicator}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Test Kits</h3>
              <div className="space-y-3">
                {testKits.map((kit) => (
                  <Card key={kit.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FlaskConical className="h-6 w-6 text-accent" />
                        <p className="text-sm font-medium text-primary">{kit.name}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
