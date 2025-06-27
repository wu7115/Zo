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
import * as React from 'react';
import { ItemDetailModal, type ModalItemData } from '@/app/components/ItemDetailModal';
import { products as zoProducts } from '@/data/products';
import type { Product } from '@/data/products';
import { SuggestedProductCard } from '@/app/components/SuggestedProductCard';

interface ShopItem {
  id: string;
  name: string;
  priceIndicator?: string;
  imageUrl: string;
  imageHint: string;
  description?: string;
  category: string;
}

const services: ShopItem[] = [
  { id: 'wellness-coaching', name: 'Wellness Coaching', priceIndicator: 'Consultation', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'coaching session', description: 'Personalized coaching sessions to help you achieve your wellness goals.', category: 'Service' },
  { id: 'meal-plan', name: 'Personalized Meal Plan', priceIndicator: 'Subscription', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'meal plan', description: 'Custom meal plans tailored to your dietary needs and preferences.', category: 'Service' },
  { id: 'fitness-assessment', name: 'Fitness Assessment', priceIndicator: 'One-time', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'fitness assessment', description: 'Comprehensive fitness assessment to understand your current fitness level.', category: 'Service' },
];

const partnerSolutions: ShopItem[] = [
  { id: 'corporate-wellness', name: 'Corporate Wellness Program', priceIndicator: 'Inquiry', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'corporate team', description: 'Wellness programs designed for businesses and their employees.', category: 'Partner Solution' },
  { id: 'gym-discount', name: 'Gym Membership Discount', priceIndicator: 'Partner Offer', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'gym equipment', description: 'Exclusive gym membership discounts through our partners.', category: 'Partner Solution' },
  { id: 'meal-delivery-partner', name: 'Healthy Meal Delivery', priceIndicator: 'Sponsored', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'meal delivery', description: 'Convenient healthy meal delivery options from our partners.', category: 'Partner Solution' },
];

// AI Product Feed State Management
function useSharedAiProductFeed(onboardingAnswers: any) {
  const [aiProducts, setAiProducts] = React.useState<any[]>([]);
  const [batchIndex, setBatchIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // Try to load from localStorage
    const stored = localStorage.getItem('aiProductFeed');
    if (stored) {
      const { products, batchIndex: idx } = JSON.parse(stored);
      setAiProducts(products || []);
      setBatchIndex(idx || 0);
    } else {
      fetchNextBatch();
    }
    // eslint-disable-next-line
  }, []);

  async function fetchNextBatch() {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-product-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingAnswers, batchIndex: batchIndex + 1 }),
      });
      const newProducts = await res.json();
      const updatedProducts = [...aiProducts, ...newProducts];
      setAiProducts(updatedProducts);
      setBatchIndex(batchIndex + 1);
      localStorage.setItem('aiProductFeed', JSON.stringify({ products: updatedProducts, batchIndex: batchIndex + 1 }));
    } catch (e) {
      // fallback: do nothing
    }
    setLoading(false);
  }

  function consumeProduct() {
    if (aiProducts.length <= 2) {
      fetchNextBatch();
    }
    const [first, ...rest] = aiProducts;
    setAiProducts(rest);
    localStorage.setItem('aiProductFeed', JSON.stringify({ products: rest, batchIndex }));
    return first;
  }

  return { aiProducts, fetchNextBatch, loading, consumeProduct };
}

export default function BuyPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = React.useState<ModalItemData | null>(null);
  const currentUserContext = "enhancing overall wellness and vitality"; // Example context

  // Get onboarding answers from localStorage
  const [onboardingAnswers, setOnboardingAnswers] = React.useState<any>({});
  React.useEffect(() => {
    setOnboardingAnswers(JSON.parse(localStorage.getItem('onboardingAnswers') || '{}'));
  }, []);

  // Shared AI product feed
  const { aiProducts, fetchNextBatch, loading: loadingAiProducts } = useSharedAiProductFeed(onboardingAnswers);

  const handleOpenModal = (item: ShopItem) => {
    setSelectedItemForModal({
      id: item.id,
      name: item.name,
      description: item.description || `Learn more about ${item.name}.`,
      imageUrl: item.imageUrl,
      imageHint: item.imageHint,
      category: item.category,
    });
    setIsModalOpen(true);
  };

  const ShopItemCard: React.FC<{ item: ShopItem }> = ({ item }) => (
    <Card
      className="w-[171px] h-[200px] flex-shrink-0 rounded-xl border flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="w-full h-[130px] relative bg-muted/20">
        <Image
          src={item.imageUrl}
          alt={item.name}
          layout="fill"
          objectFit="contain"
          data-ai-hint={item.imageHint}
          className="rounded-t-xl"
        />
      </div>
      <div className="p-2.5 flex-grow flex flex-col justify-between">
        <div>
          <p className="text-xs font-semibold text-primary line-clamp-2">{item.name}</p>
          {item.priceIndicator && <p className="text-[10px] text-muted-foreground">{item.priceIndicator}</p>}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 bg-card hover:bg-muted/50 text-primary rounded-full p-1.5 flex items-center justify-center shrink-0 self-end border-primary/50"
          onClick={() => handleOpenModal(item)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );

  const accordionCategories = [
    {
      id: 'products',
      title: 'Products',
      icon: Package,
      items: zoProducts.slice(0, 4), // Only first four Zo products
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
      items: aiProducts,
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
                Buy
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
                          {category.id === 'marketplace-solutions'
                            ? category.items.map((item: any, idx: number) => (
                                <SuggestedProductCard key={`ai-product-${item.id || idx}`} data={item} />
                              ))
                            : category.items.map((item: Product) => (
                                <ShopItemCard key={`${category.id}-${item.id}`} item={item as any} />
                              ))}
                          {category.id === 'marketplace-solutions' && (
                            <Button onClick={fetchNextBatch} disabled={loadingAiProducts} className="min-w-[120px] h-[200px] flex-shrink-0 flex flex-col items-center justify-center border-dashed border-2 border-primary/30 bg-muted/30 hover:bg-muted/50">
                              {loadingAiProducts ? 'Loading...' : '+ More'}
                            </Button>
                          )}
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
      <ItemDetailModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        item={selectedItemForModal}
        userContext={currentUserContext}
      />
    </main>
  );
}
