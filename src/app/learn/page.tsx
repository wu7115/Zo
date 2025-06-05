
import Link from 'next/link';
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
      { title: 'Understanding Your Microbiome', snippet: 'Learn the basics of gut health and its importance.', source: 'Wellness Digest' },
      { title: 'Top 5 Probiotic Foods for a Healthy Gut', snippet: 'Discover natural food sources to boost your gut flora.', source: 'Nutrition Hub' },
      { title: 'The Gut-Brain Axis: How Your Stomach and Mind Connect', snippet: 'An exploration of the communication between your digestive system and brain.', source: 'Mind & Body Journal' },
    ],
  },
  {
    id: 'podcasts',
    title: 'Podcasts',
    icon: Podcast,
    items: [
      { title: 'The Gut Health Podcast Ep. 12: Fermented Foods', snippet: 'Discussion with Dr. Anya Sharma on the benefits of fermentation.', duration: '45 min', source: 'Gut Talks' },
      { title: 'Wellness Unpacked: Sleep and Digestion', snippet: 'Exploring the critical link between quality sleep and a healthy digestive system.', duration: '30 min', source: 'Holistic Health Radio' },
      { title: 'Biohacking Your Gut for Optimal Performance', snippet: 'Tips and tricks from experts on optimizing your digestive health.', duration: '55 min', source: 'The Optimal Human' },
    ],
  },
  {
    id: 'videos',
    title: 'Videos',
    icon: PlayCircle,
    items: [
      { title: 'Animated Guide to the Digestive System', snippet: 'A visual journey through how your body processes food.', duration: '10 min', source: 'Science Explained YT' },
      { title: 'Cooking for Gut Health: Easy Recipe Demo', snippet: 'Chef Leo prepares a delicious and gut-friendly meal.', duration: '15 min', source: 'HealthyEats TV' },
      { title: 'Yoga for Digestion: A Gentle 20-Minute Flow', snippet: 'Follow along with this sequence to aid digestion and reduce bloating.', duration: '20 min', source: 'FlowWithGrace' },
    ],
  },
  {
    id: 'partner-content',
    title: 'Partner Content',
    icon: FileText,
    items: [
      { title: "Exclusive: Viome's Guide to Personalized Nutrition", snippet: 'Learn how Viome tailors recommendations based on your unique biology.', type: 'Article Series', source: 'Viome' },
      { title: 'ZoBiome Webinar: Decoding Your Gut Score', snippet: 'An expert-led session on understanding your ZoBiome test results.', type: 'Webinar Recording', source: 'ZoBiome Inc.' },
      { title: 'Special Offer: 20% off MBT Test Kits', snippet: 'A limited-time promotion for Podium users on MBT diagnostic kits.', type: 'Promotion', source: 'MBT Labs' },
    ],
  },
];

export default function LearnPage() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-background overflow-y-auto">
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
            <div className="flex items-center space-x-2">
              <Button variant="secondary" size="sm" className="text-xs h-auto" asChild>
                 <Link href="/gut-health-score">ZoGut Score 55/100</Link>
              </Button>
              <Badge variant="secondary" className="text-sm">ZoPoints 431</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 pb-4">
             <Accordion type="multiple" defaultValue={learnCategories.filter(c => c.defaultOpen).map(c => c.id)} className="w-full">
              {learnCategories.map((category) => (
                <AccordionItem value={category.id} key={category.id} className="mb-2 rounded-lg border bg-muted/20 overflow-hidden">
                  <AccordionTrigger className="bg-amber-50 hover:bg-amber-100/80 text-primary font-semibold p-3.5 no-underline data-[state=open]:bg-amber-100">
                    <div className="flex items-center flex-1 text-left">
                      <category.icon className="h-5 w-5 mr-3 text-primary/80 shrink-0" />
                      {category.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-background">
                    <ul className="divide-y divide-border">
                      {category.items.map((item, index) => (
                        <li key={index} className="p-3 hover:bg-muted/30">
                          <h4 className="font-semibold text-sm text-primary">{item.title}</h4>
                          <p className="text-xs text-foreground/80 mt-0.5">{item.snippet}</p>
                          {item.source && <p className="text-xs text-muted-foreground mt-1">Source: {item.source}</p>}
                          {item.duration && <p className="text-xs text-muted-foreground mt-1">Duration: {item.duration}</p>}
                          {item.type && <p className="text-xs text-muted-foreground mt-1">Type: {item.type}</p>}
                        </li>
                      ))}
                       {category.items.length === 0 && (
                        <li className="p-3 text-sm text-muted-foreground text-center">No items in this category yet.</li>
                      )}
                    </ul>
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
    
