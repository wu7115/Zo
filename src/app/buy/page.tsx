
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
import { ArrowLeft, ShoppingCart, Plus, Package, HeartHandshake, FolderHeart, TrendingUp } from 'lucide-react';
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
    imageUrl: 'https://placehold.co/171x130.png',
    imageHint: 'supplement packet',
  },
  {
    name: 'Hydration Powder',
    priceIndicator: 'SB',
    imageUrl: 'https://placehold.co/171x130.png',
    imageHint: 'hydration sachet',
  },
  {
    name: 'Probiotics',
    priceIndicator: 'SS',
    imageUrl: 'https://placehold.co/171x130.png',
    imageHint: 'probiotic packet',
  },
  {
    name: 'Recovery Coffee',
    priceIndicator: 'SJ',
    imageUrl: 'https://placehold.co/171x130.png',
    imageHint: 'coffee sachet',
  },
  {
    name: 'Bone Broth V2',
    priceIndicator: 'SS',
    imageUrl: 'https://placehold.co/171x130.png',
    imageHint: 'supplement packet beige',
  },
  {
    name: 'Hydration Powder XL',
    priceIndicator: 'SB',
    imageUrl: 'https://placehold.co/171x130.png',
    imageHint: 'hydration sachet blue',
  },
];

const services = [
  { name: 'Wellness Coaching', priceIndicator: 'Consultation', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'coaching session' },
  { name: 'Personalized Meal Plan', priceIndicator: 'Subscription', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'meal plan' },
  { name: 'Fitness Assessment', priceIndicator: 'One-time', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'fitness assessment' },
];

const partnerSolutions = [
  { name: 'Corporate Wellness Program', priceIndicator: 'Inquiry', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'corporate team' },
  { name: 'Gym Membership Discount', priceIndicator: 'Partner Offer', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'gym equipment' },
  { name: 'Healthy Meal Delivery', priceIndicator: 'Sponsored', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'meal delivery' },
];

const testKits = [
  { name: 'ZoBiome', id: 'zobiome', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'test kit zobiome' },
  { name: 'Viome', id: 'viome', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'test kit viome' },
  { name: 'MBT', id: 'mbt', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'test kit mbt' },
];

interface ShopItem {
  name: string;
  priceIndicator?: string; // For products and services
  id?: string; // For test kits
  imageUrl: string;
  imageHint: string;
}

const ShopItemCard: React.FC<{ item: ShopItem }> = ({ item }) => (
  <Card
    className="w-[171px] h-[200px] flex-shrink-0 rounded-xl border flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow"
  >
    <div className="w-full h-[130px] relative">
      <Image
        src={item.imageUrl}
        alt={item.name}
        layout="fill"
        objectFit="cover"
        data-ai-hint={item.imageHint}
        className="rounded-t-xl"
      />
    </div>
    <div className="p-2.5 flex-grow flex flex-col justify-between"> {/* Adjusted padding slightly */}
      <div>
        <p className="text-xs font-semibold text-primary line-clamp-2">{item.name}</p>
        {item.priceIndicator && <p className="text-[10px] text-muted-foreground">{item.priceIndicator}</p>}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7 bg-card hover:bg-muted/50 text-primary rounded-full p-1.5 flex items-center justify-center shrink-0 self-end border-primary/50"
      >
        <Plus className="h-4 w-4" /> {/* Slightly larger plus icon */}
      </Button>
    </div>
  </Card>
);


export default function ShopPage() {
  const accordionCategories = [
    {
      id: 'products',
      title: 'Products',
      icon: Package,
      items: products,
      defaultOpen: true,
    },
    {
      id: 'services',
      title: 'Services',
      icon: HeartHandshake,
      items: services,
    },
    {
      id: 'partner-solutions',
      title: 'Partner Solutions',
      icon: FolderHeart,
      items: partnerSolutions,
    },
    {
      id: 'marketplace-solutions',
      title: 'Marketplace Solutions',
      icon: TrendingUp,
      items: testKits, // Using testKits data here
    },
  ];

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-app-content overflow-y-auto">
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
          </CardHeader>
          <CardContent className="space-y-3">
            <Accordion 
              type="multiple" 
              defaultValue={accordionCategories.filter(c => c.defaultOpen).map(c => c.id)} 
              className="w-full space-y-3"
            >
              {accordionCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <AccordionItem key={category.id} value={category.id} className="rounded-lg overflow-hidden border bg-card">
                    <AccordionTrigger className="hover:bg-muted/20 data-[state=open]:bg-muted/30 p-4 w-full">
                       <div className="flex items-center text-left flex-1">
                        <IconComponent className="h-6 w-6 mr-3 text-primary shrink-0" />
                        <h3 className="text-lg font-semibold text-primary">{category.title}</h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-background p-0">
                      {category.items.length > 0 ? (
                        <div className="flex overflow-x-auto space-x-3 p-3">
                          {category.items.map((item, index) => (
                            <ShopItemCard key={`${category.id}-${item.id || index}`} item={item} />
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-sm text-muted-foreground">Coming soon!</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
