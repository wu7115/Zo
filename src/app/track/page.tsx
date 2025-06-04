
'use client';

import Link from 'next/link';
import * as React from 'react';
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
import { ArrowLeft, ClipboardList, MinusCircle, CheckCircle2, BarChart3, HeartPulse, Utensils, Pill, BedDouble, Smile } from 'lucide-react';

interface TrackItem {
  id: string;
  label: string;
  checked: boolean;
}

interface TrackingCategory {
  id: string;
  title: string;
  items: TrackItem[];
  icon: React.ElementType;
}

const trackingCategoriesData: TrackingCategory[] = [
  {
    id: 'lifestyle',
    title: 'Lifestyle Data',
    icon: BarChart3,
    items: [
      { id: 'activity1', label: 'Activity 1 (e.g. Morning Walk)', checked: false },
      { id: 'activity2', label: 'Activity 2 (e.g. Drink 2L Water)', checked: true },
      { id: 'activity3', label: 'Activity 3 (e.g. Read for 30 mins)', checked: false },
    ],
  },
  {
    id: 'diet',
    title: 'Diet & Nutrition',
    icon: Utensils,
    items: [
      { id: 'meal1', label: 'Log Breakfast', checked: true },
      { id: 'meal2', label: 'Log Lunch', checked: false },
      { id: 'meal3', label: 'Log Dinner', checked: false },
      { id: 'snack1', label: 'Avoid sugary snacks', checked: true },
    ],
  },
  {
    id: 'digestive',
    title: 'Digestive Health',
    icon: HeartPulse,
    items: [
      { id: 'fiber', label: 'High-fiber meal', checked: false },
      { id: 'probiotics', label: 'Take probiotics', checked: true },
    ],
  },
  {
    id: 'meds',
    title: 'Meds & Supplements',
    icon: Pill,
    items: [
      { id: 'vitamin_d', label: 'Vitamin D', checked: true },
      { id: 'multivitamin', label: 'Multivitamin', checked: true },
      { id: 'prescription1', label: 'Prescription Med X', checked: false },
    ],
  },
  {
    id: 'sleep',
    title: 'Sleep & Recovery',
    icon: BedDouble,
    items: [
      { id: 'sleep_time', label: '8 hours of sleep', checked: false },
      { id: 'screen_time', label: 'No screens before bed', checked: true },
      { id: 'stretching', label: 'Evening stretching', checked: false },
    ],
  },
  {
    id: 'mental_wellness',
    title: 'Mental Wellness',
    icon: Smile,
    items: [
      { id: 'meditation', label: '10 min Meditation', checked: false },
      { id: 'journaling', label: 'Journaling', checked: true },
    ],
  },
];

export default function TrackPage() {
  // const [categories, setCategories] = React.useState(trackingCategoriesData);
  // If interactivity for checking items is needed later, uncomment above and implement handleCheckChange

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-background overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-2xl font-headline text-primary flex items-center">
                <ClipboardList className="h-7 w-7 mr-2 text-accent" />
                Track
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
          <CardContent className="space-y-1 pb-4">
            <Accordion type="multiple" defaultValue={['lifestyle']} className="w-full">
              {trackingCategoriesData.map((category) => (
                <AccordionItem value={category.id} key={category.id} className="border-b-0 mb-2 rounded-md overflow-hidden bg-muted/20">
                  <AccordionTrigger className="bg-sky-100 hover:bg-sky-200/80 text-primary font-semibold p-3 no-underline data-[state=open]:bg-sky-200">
                    <div className="flex items-center flex-1 text-left">
                      <category.icon className="h-5 w-5 mr-3 text-accent shrink-0" />
                      {category.title}
                    </div>
                    {/* Default ChevronDown icon will appear on the right */}
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 pb-0">
                    <ul className="space-y-px">
                      {category.items.map((item, index) => (
                        <li key={item.id} className={`flex items-center justify-between p-3 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'} hover:bg-muted/50`}>
                          <span className="text-sm text-foreground">{item.label}</span>
                          {item.checked ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <MinusCircle className="h-5 w-5 text-slate-500" />
                          )}
                        </li>
                      ))}
                      {category.items.length === 0 && (
                        <li className="p-3 text-sm text-muted-foreground text-center">No items in this category.</li>
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
