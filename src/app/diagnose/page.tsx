
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
import { ArrowLeft, HeartPulse, FlaskConical, FileText, UploadCloud, Plus } from 'lucide-react';

interface ShopItem {
  name: string;
  id?: string;
  imageUrl: string;
  imageHint: string;
  href: string; // Link for the "+" button or card action
}

const diagnosticTestKits: ShopItem[] = [
  { name: 'ZoBiome', id: 'zobiome', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'test kit zobiome', href: '/buy#zobiome' },
  { name: 'Viome', id: 'viome', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'test kit viome', href: '/buy#viome' },
  { name: 'MBT', id: 'mbt', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'test kit mbt', href: '/buy#mbt' },
];

const DiagnosticKitCard: React.FC<{ item: ShopItem }> = ({ item }) => (
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
    <div className="p-2.5 flex-grow flex flex-col justify-between">
      <div>
        <p className="text-xs font-semibold text-primary line-clamp-2">{item.name}</p>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7 bg-card hover:bg-muted/50 text-primary rounded-full p-1.5 flex items-center justify-center shrink-0 self-end border-primary/50"
        asChild
      >
        <Link href={item.href}>
          <Plus className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  </Card>
);


interface AccordionSection {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  content: React.ReactNode;
}

const sections: AccordionSection[] = [
  {
    id: 'test-kits-purchase',
    icon: FlaskConical,
    title: 'Test Kits',
    subtitle: 'Select to purchase',
    defaultOpen: true,
    content: (
      <div className="flex overflow-x-auto space-x-3 p-3">
        {diagnosticTestKits.map((kit) => (
          <DiagnosticKitCard key={kit.id} item={kit} />
        ))}
      </div>
    ),
  },
  {
    id: 'test-kits-prescription',
    icon: FlaskConical,
    title: 'Test Kits',
    subtitle: 'Prescription Required',
    content: <p className="text-sm text-muted-foreground p-3">Details about prescription test kits will appear here. This section does not use cards yet.</p>,
  },
  {
    id: 'results',
    icon: FileText,
    title: 'Results',
    content: <p className="text-sm text-muted-foreground p-3">Your test results will be displayed here. This section does not use cards yet.</p>,
  },
  {
    id: 'upload',
    icon: UploadCloud,
    title: 'Upload from 3rd Party',
    content: (
      <div className="h-32 bg-muted/20 border border-dashed border-border rounded-lg flex items-center justify-center p-3">
        <p className="text-sm text-muted-foreground text-center">drop result here (PDF up to 20 pages)</p>
      </div>
    ),
  },
];

export default function DiagnosePage() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-app-content overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-2xl font-headline text-primary flex items-center">
                <HeartPulse className="h-7 w-7 mr-2 text-accent" />
                Diagnose
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
              type="single"
              collapsible
              defaultValue={sections.find(s => s.defaultOpen)?.id}
              className="w-full space-y-3"
            >
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <AccordionItem value={section.id} key={section.id} className="rounded-lg border bg-card overflow-hidden">
                    <AccordionTrigger className="hover:bg-muted/20 data-[state=open]:bg-muted/30 p-4 w-full text-primary font-semibold no-underline">
                      <div className="flex items-center flex-1 text-left">
                        <IconComponent className="h-6 w-6 mr-3 text-primary shrink-0" />
                        <div>
                          <span className="text-md">{section.title}</span>
                          {section.subtitle && (
                            <p className="text-xs text-primary/80 font-normal mt-0.5">{section.subtitle}</p>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-background">
                      {/* Check if content is for the specific section that should have cards */}
                      {section.id === 'test-kits-purchase' ? (
                        section.content /* This already includes the div with flex overflow-x-auto */
                      ) : (
                        <div className="p-3">{section.content}</div> /* For other sections, keep the simple padding */
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
