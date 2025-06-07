
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, HeartPulse, CheckCircle2, FlaskConical, FileText, UploadCloud, MinusCircle } from 'lucide-react';

interface TestKitItemProps {
  name: string;
  selected?: boolean;
  href: string;
}

const TestKitListItem: React.FC<TestKitItemProps> = ({ name, selected, href }) => (
  <Link href={href} passHref>
    <div className="flex items-center justify-between py-3 px-1 hover:bg-muted/50 rounded-md cursor-pointer">
      <span className={`text-sm ${selected ? 'font-semibold text-primary' : 'text-foreground'}`}>
        {name}
      </span>
      {selected ? (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      ) : (
        <MinusCircle className="h-5 w-5 text-slate-500" />
      )}
    </div>
  </Link>
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
      <div className="space-y-1 pt-2">
        <TestKitListItem name="ZoBiome" href="/buy#zobiome" />
        <TestKitListItem name="Viome" selected href="/buy#viome" />
        <TestKitListItem name="MBT" href="/buy#mbt" />
      </div>
    ),
  },
  {
    id: 'test-kits-prescription',
    icon: FlaskConical,
    title: 'Test Kits',
    subtitle: 'Prescription Required',
    content: <p className="text-sm text-muted-foreground p-3">Details about prescription test kits will appear here.</p>,
  },
  {
    id: 'results',
    icon: FileText,
    title: 'Results',
    content: <p className="text-sm text-muted-foreground p-3">Your test results will be displayed here.</p>,
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
                      <div className="p-3">{section.content}</div>
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
