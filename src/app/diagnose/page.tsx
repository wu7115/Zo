
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
import { ArrowLeft, HeartPulse, MinusCircle, CheckCircle2, FlaskConical, FileText, UploadCloud } from 'lucide-react';

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
  icon?: React.ElementType; // Icon for the trigger title area, not the left-most minus
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
    content: <p className="text-sm text-muted-foreground p-3">Upload test results from other providers here.</p>,
  },
];

export default function DiagnosePage() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-background overflow-y-auto">
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
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-sm">Score: 55/100</Badge>
              <Badge variant="secondary" className="text-sm">Points: 421</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Accordion type="single" collapsible defaultValue={sections.find(s => s.defaultOpen)?.id} className="w-full">
              {sections.map((section) => (
                <AccordionItem value={section.id} key={section.id} className="mb-2 rounded-lg border bg-muted/10 overflow-hidden">
                  <AccordionTrigger className="bg-sky-50 hover:bg-sky-100/80 text-primary font-semibold p-4 no-underline data-[state=open]:bg-sky-100">
                    <div className="flex items-center flex-1 text-left">
                      <MinusCircle className="h-6 w-6 mr-3 text-primary/70 shrink-0" />
                      <div>
                        <span className="text-md">{section.title}</span>
                        {section.subtitle && (
                          <p className="text-xs text-primary/80 font-normal mt-0.5">{section.subtitle}</p>
                        )}
                      </div>
                    </div>
                    {/* ChevronDown is added by default by AccordionTrigger */}
                  </AccordionTrigger>
                  <AccordionContent className="bg-background">
                    <div className="p-2">{section.content}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-4 h-32 bg-muted/20 border border-dashed border-border rounded-lg">
              {/* This is the empty panel at the bottom */}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
