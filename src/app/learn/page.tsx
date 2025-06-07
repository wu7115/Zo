
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpenText, FileText, Podcast, PlayCircle, Bell, Menu } from 'lucide-react';

interface LearnItem {
  title: string;
  snippet: string;
  source?: string;
  duration?: string;
  type?: string;
  imageUrl: string;
  imageHint: string;
  link: string;
}

interface LearnCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  items: LearnItem[];
  defaultOpen?: boolean;
}

const learnCategories: LearnCategory[] = [
  {
    id: 'articles',
    title: 'Articles',
    icon: FileText,
    defaultOpen: true,
    items: [
      { title: 'Understanding Your Microbiome', snippet: 'Learn the basics of gut health and its importance.', source: 'Wellness Digest', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'microscope cells', link: '#' },
      { title: 'Top 5 Probiotic Foods', snippet: 'Discover natural food sources to boost your gut flora.', source: 'Nutrition Hub', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'probiotic food', link: '#' },
      { title: 'The Gut-Brain Axis', snippet: 'An exploration of the communication between your digestive system and brain.', source: 'Mind & Body Journal', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'brain connection', link: '#' },
      { title: 'Benefits of Fiber', snippet: 'Why fiber is crucial for digestive health.', source: 'Healthy Living', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'fiber foods', link: '#' },
    ],
  },
  {
    id: 'podcasts',
    title: 'Podcasts',
    icon: Podcast,
    items: [
      { title: 'The Gut Health Podcast Ep. 12', snippet: 'Discussion with Dr. Anya Sharma on fermented foods.', duration: '45 min', source: 'Gut Talks', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'podcast microphone', link: '#' },
      { title: 'Wellness Unpacked: Sleep', snippet: 'Exploring the critical link between quality sleep and digestion.', duration: '30 min', source: 'Holistic Health Radio', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'sleep podcast', link: '#' },
      { title: 'Biohacking Your Gut', snippet: 'Tips and tricks from experts on optimizing digestive health.', duration: '55 min', source: 'The Optimal Human', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'biohacking tech', link: '#' },
    ],
  },
  {
    id: 'videos',
    title: 'Videos',
    icon: PlayCircle,
    items: [
      { title: 'Animated Guide to Digestion', snippet: 'A visual journey through how your body processes food.', duration: '10 min', source: 'Science Explained YT', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'animation digestive system', link: '#' },
      { title: 'Cooking for Gut Health Demo', snippet: 'Chef Leo prepares a delicious and gut-friendly meal.', duration: '15 min', source: 'HealthyEats TV', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'cooking show', link: '#' },
      { title: 'Yoga for Digestion Flow', snippet: 'Follow along with this sequence to aid digestion and reduce bloating.', duration: '20 min', source: 'FlowWithGrace', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'yoga pose', link: '#' },
    ],
  },
  {
    id: 'partner-content',
    title: 'Partner Content',
    icon: FileText,
    items: [
      { title: "Viome's Guide to Nutrition", snippet: 'Learn how Viome tailors recommendations.', type: 'Article Series', source: 'Viome', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'nutrition science', link: '#' },
      { title: 'ZoBiome Webinar: Gut Score', snippet: 'An expert-led session on understanding your results.', type: 'Webinar Recording', source: 'ZoBiome Inc.', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'webinar presentation', link: '#' },
      { title: 'MBT Test Kits Offer', snippet: 'A limited-time promotion for Podium users.', type: 'Promotion', source: 'MBT Labs', imageUrl: 'https://placehold.co/171x150.png', imageHint: 'discount offer', link: '#' },
    ],
  },
];

export default function LearnPage() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-app-content overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                 <Button variant="ghost" size="icon" className="mr-2" asChild>
                  <Link href="/">
                    <ArrowLeft className="h-5 w-5 text-primary" />
                  </Link>
                </Button>
                <CardTitle className="text-2xl font-headline text-primary flex items-center">
                  <BookOpenText className="h-7 w-7 mr-2 text-accent" />
                  Learn
                </CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5 text-primary" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5 text-primary" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 pb-4">
             <Accordion type="multiple" defaultValue={learnCategories.filter(c => c.defaultOpen).map(c => c.id)} className="w-full">
              {learnCategories.map((category) => (
                <AccordionItem value={category.id} key={category.id} className="mb-2 rounded-lg border bg-muted/10 overflow-hidden">
                  <AccordionTrigger className="bg-muted/20 hover:bg-muted/40 text-primary font-semibold p-3 no-underline data-[state=open]:bg-muted/30">
                    <div className="flex items-center flex-1 text-left">
                      <category.icon className="h-5 w-5 mr-3 text-accent shrink-0" />
                      {category.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-background p-0">
                    <div className="flex overflow-x-auto space-x-3 p-3">
                      {category.items.length > 0 ? category.items.map((item, index) => (
                        <Link href={item.link || '#'} key={index} className="block w-[171px] h-[200px] flex-shrink-0">
                          <Card className="w-full h-full flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-lg border">
                            <div className="relative w-full h-[150px]">
                              <Image
                                src={item.imageUrl}
                                alt={item.title}
                                layout="fill"
                                objectFit="cover"
                                data-ai-hint={item.imageHint}
                                className="rounded-t-lg"
                              />
                            </div>
                            <CardContent className="p-2 flex-grow flex flex-col justify-center items-center">
                              <h4 className="font-semibold text-xs text-primary line-clamp-2 text-center">{item.title}</h4>
                            </CardContent>
                          </Card>
                        </Link>
                      )) : (
                        <p className="p-3 text-sm text-muted-foreground text-center w-full">No items in this category yet.</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
