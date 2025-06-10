
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
import { ArrowLeft, HeartPulse, FlaskConical, FileText, UploadCloud, Plus, Edit } from 'lucide-react'; // Added Edit icon
import * as React from 'react';
import { ItemDetailModal, type ModalItemData } from '@/app/components/ItemDetailModal';

interface DiagnosticKit {
  id: string;
  name: string;
  imageUrl: string;
  imageHint: string;
  href: string; 
  description?: string;
  category: string;
}

const diagnosticTestKits: DiagnosticKit[] = [
  { id: 'zobiome-kit', name: 'ZoBiome Test Kit', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'test kit zobiome', href: '/buy#zobiome', description: 'Comprehensive gut microbiome analysis by ZoBiome. Understand your gut flora.', category: 'Test Kit' },
  { id: 'viome-kit', name: 'Viome Health Intelligence', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'test kit viome', href: '/buy#viome', description: 'Personalized health insights based on your unique biology with Viome testing.', category: 'Test Kit' },
  { id: 'mbt-kit', name: 'MBT Metabolic Test', imageUrl: 'https://placehold.co/171x130.png', imageHint: 'test kit mbt', href: '/buy#mbt', description: 'Metabolic & Biome Test for a deeper understanding of your body\'s processes.', category: 'Test Kit' },
];

interface AccordionSection {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  content?: React.ReactNode; // Make content optional
  items?: DiagnosticKit[]; 
  isSurveySection?: boolean; // Flag for special survey section
}


export default function DiagnosePage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = React.useState<ModalItemData | null>(null);
  const currentUserContext = "seeking diagnostic information for better health"; 

  const handleOpenModal = (item: DiagnosticKit) => {
    setSelectedItemForModal({
      id: item.id,
      name: item.name,
      description: item.description || `Information about the ${item.name}.`,
      imageUrl: item.imageUrl,
      imageHint: item.imageHint,
      category: item.category,
    });
    setIsModalOpen(true);
  };
  
  const DiagnosticKitCard: React.FC<{ item: DiagnosticKit }> = ({ item }) => (
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
          onClick={() => handleOpenModal(item)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );

  const sections: AccordionSection[] = [
    {
      id: 'diagnostic-surveys',
      icon: Edit, // Using Edit icon for surveys
      title: 'Diagnostic Surveys',
      subtitle: 'Complete to enhance your profile',
      isSurveySection: true, // Mark this as the special survey section
      defaultOpen: false,
    },
    {
      id: 'test-kits-purchase',
      icon: FlaskConical,
      title: 'Test Kits',
      subtitle: 'Select to purchase',
      defaultOpen: true,
      items: diagnosticTestKits,
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
                      {section.isSurveySection ? (
                        <div className="p-3">
                          <Button asChild className="w-full">
                            <Link href="/diagnose/survey">
                              Complete Full Diagnostic Survey
                            </Link>
                          </Button>
                        </div>
                      ) : section.items && section.items.length > 0 ? (
                        <div className="flex overflow-x-auto space-x-3 p-3">
                          {section.items.map((kit) => (
                            <DiagnosticKitCard key={kit.id} item={kit} />
                          ))}
                        </div>
                      ) : (
                        <div className="p-3">{section.content}</div>
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
