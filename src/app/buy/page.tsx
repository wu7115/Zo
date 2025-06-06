
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Plus, FlaskConical } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const products = [
  {
    name: 'Bone Broth',
    priceIndicator: 'SS',
    imageUrl: 'https://placehold.co/343x130.png',
    imageHint: 'supplement packet',
  },
  {
    name: 'Hydration Powder',
    priceIndicator: 'SB',
    imageUrl: 'https://placehold.co/343x130.png',
    imageHint: 'hydration sachet',
  },
  {
    name: 'Probiotics',
    priceIndicator: 'SS',
    imageUrl: 'https://placehold.co/343x130.png',
    imageHint: 'probiotic packet',
  },
  {
    name: 'Recovery Coffee',
    priceIndicator: 'SJ',
    imageUrl: 'https://placehold.co/343x130.png',
    imageHint: 'coffee sachet',
  },
  {
    name: 'Bone Broth V2',
    priceIndicator: 'SS',
    imageUrl: 'https://placehold.co/343x130.png',
    imageHint: 'supplement packet beige',
  },
  {
    name: 'Hydration Powder XL',
    priceIndicator: 'SB',
    imageUrl: 'https://placehold.co/343x130.png',
    imageHint: 'hydration sachet blue',
  },
];

const testKits = [
  { name: 'ZoBiome', id: 'zobiome', imageUrl: 'https://placehold.co/343x130.png', imageHint: 'test kit zobiome' },
  { name: 'Viome', id: 'viome', imageUrl: 'https://placehold.co/343x130.png', imageHint: 'test kit viome' },
  { name: 'MBT', id: 'mbt', imageUrl: 'https://placehold.co/343x130.png', imageHint: 'test kit mbt' },
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
              <Button variant="secondary" size="sm" className="text-xs h-auto" asChild>
                <Link href="/gut-health-score">Score: 55/100</Link>
              </Button>
              <Badge variant="secondary" className="text-sm">Points: 421</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Accordion type="multiple" defaultValue={['products', 'test-kits']} className="w-full">
              <AccordionItem value="products" className="border-b-0 rounded-lg overflow-hidden">
                <AccordionTrigger className="bg-muted/20 hover:bg-muted/40 text-primary font-semibold p-3 data-[state=open]:bg-muted/30">
                  <h3 className="text-lg font-semibold text-primary">Products</h3>
                </AccordionTrigger>
                <AccordionContent className="bg-background p-0">
                  <div className="flex overflow-x-auto space-x-3 p-3">
                    {products.map((product, index) => (
                      <Card key={index} className="w-[343px] h-[200px] flex-shrink-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                        <div className="relative w-full h-[130px]">
                           <Image
                            src={product.imageUrl}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                            data-ai-hint={product.imageHint}
                            className="rounded-t-lg"
                          />
                          <Button variant="outline" size="icon" className="absolute top-1 right-1 h-7 w-7 bg-background/80 hover:bg-background">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardContent className="p-2 text-center flex-grow flex flex-col justify-center">
                          <div>
                            <p className="text-base font-semibold text-primary truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.priceIndicator}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="test-kits" className="border-b-0 rounded-lg overflow-hidden mt-3">
                <AccordionTrigger className="bg-muted/20 hover:bg-muted/40 text-primary font-semibold p-3 data-[state=open]:bg-muted/30">
                  <h3 className="text-lg font-semibold text-primary">Test Kits</h3>
                </AccordionTrigger>
                <AccordionContent className="bg-background p-0">
                   <div className="flex overflow-x-auto space-x-3 p-3">
                    {testKits.map((kit) => (
                      <Card key={kit.id} className="w-[343px] h-[200px] flex-shrink-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                        <div className="relative w-full h-[130px]">
                           <Image
                            src={kit.imageUrl}
                            alt={kit.name}
                            layout="fill"
                            objectFit="cover"
                            data-ai-hint={kit.imageHint}
                            className="rounded-t-lg"
                          />
                        </div>
                        <CardContent className="p-2 text-center flex-grow flex flex-col justify-between">
                           <div>
                            <p className="text-base font-semibold text-primary truncate">{kit.name}</p>
                           </div>
                           <Button variant="outline" size="sm" className="mt-1 w-full h-8 text-sm">
                            <Plus className="h-4 w-4 mr-1" /> Add
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


    