
'use client';

import Link from 'next/link';
import Image from 'next/image';
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
import { ArrowLeft, Map, Target, ListChecks, BookOpen, ChevronRight, Rocket, HeartPulse, BedDouble, Dumbbell, Droplets, WifiOff, Apple as MindfulEatingIcon } from 'lucide-react';
import * as React from 'react';
import type { SVGProps } from 'react';

// LabubuIcon copied from BottomNavigationBar.tsx for consistency if needed elsewhere
const LabubuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="14" r="3.5" />
    <path d="M9.5 11.5C9 8 7 6.5 8.5 4.5S12 6 12 6" />
    <path d="M14.5 11.5C15 8 17 6.5 15.5 4.5S12 6 12 6" />
    <circle cx="10.5" cy="14" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="13.5" cy="14" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

interface JourneyTask {
  id: string;
  name: string;
  completed?: boolean;
}

interface JourneyMonth { // Renamed from JourneyMonth to JourneyProtocolItem for clarity
  id: string;
  month: number; // Retained for potential sorting or phase indication
  title: string;
  targets: string[];
  tasks: JourneyTask[];
}

interface Journey {
  id: string;
  name: string;
  overallTargets: string[];
  description: string;
  protocol: JourneyMonth[];
  icon: React.ElementType;
  totalDays: number;
}

import { allJourneys } from '@/lib/data/journeys';

export default function JourneyPage() {
  const currentJourneyId = 'mindful-mover';
  const currentJourney = allJourneys.find(j => j.id === currentJourneyId) || allJourneys[0];
  const recommendedJourneys = allJourneys.filter(j => j.id !== currentJourneyId);

  const [activeAccordionItem, setActiveAccordionItem] = React.useState<string | string[]>(`journey-${currentJourney.id}`);

  const renderProtocolBreakdown = (protocol: JourneyMonth[]) => (
    <div>
      <h4 className="text-md font-semibold text-primary mb-2 flex items-center">
        <ListChecks className="h-5 w-5 mr-2 text-accent" /> Protocol Breakdown
      </h4>
      <Accordion type="multiple" className="w-full space-y-2">
        {protocol.map((protocolItem) => (
          <AccordionItem key={protocolItem.id} value={protocolItem.id} className="border bg-muted/20 rounded-md">
            <AccordionTrigger className="p-3 text-sm font-medium text-primary hover:no-underline data-[state=open]:bg-muted/30">
              {protocolItem.title}
            </AccordionTrigger>
            <AccordionContent className="p-3 space-y-2">
              <div>
                <h5 className="text-xs font-semibold text-primary mb-1">Targets:</h5>
                <ul className="list-disc list-inside text-xs text-foreground/80 space-y-0.5 pl-2">
                  {protocolItem.targets.map((target, index) => (
                    <li key={index}>{target}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-xs font-semibold text-primary mb-1">Tasks:</h5>
                <ul className="list-disc list-inside text-xs text-foreground/80 space-y-0.5 pl-2">
                  {protocolItem.tasks.map((task) => (
                    <li key={task.id}>{task.name}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-app-content overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-headline text-primary flex items-center">
                <Map className="h-7 w-7 mr-2 text-accent" />
                Your Journey
              </CardTitle>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Current Journey Details */}
            <Accordion type="single" collapsible defaultValue={`journey-${currentJourney.id}`} value={activeAccordionItem} onValueChange={setActiveAccordionItem} className="w-full">
              <AccordionItem value={`journey-${currentJourney.id}`} className="border bg-card rounded-lg shadow-md">
                <AccordionTrigger className="p-4 text-lg font-semibold text-primary hover:no-underline data-[state=open]:bg-muted/50">
                  <div className="flex items-center">
                    <currentJourney.icon className="h-6 w-6 mr-3 text-accent" />
                    {currentJourney.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 space-y-4">
                  <div>
                    <h4 className="text-md font-semibold text-primary mb-1 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-accent" /> Overall Targets & Goals
                    </h4>
                    <ul className="list-disc list-inside text-sm text-foreground/90 space-y-1 pl-2">
                      {currentJourney.overallTargets.map((target, index) => (
                        <li key={index}>{target}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold text-primary mb-1 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-accent" /> Description
                    </h4>
                    <p className="text-sm text-foreground/90">{currentJourney.description}</p>
                  </div>
                  {renderProtocolBreakdown(currentJourney.protocol)}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Recommended Journeys */}
            <div className="mt-8">
              <h3 className="text-xl font-headline text-primary mb-3">Recommended Journeys</h3>
              <Accordion type="multiple" className="w-full space-y-3">
                {recommendedJourneys.map((journey) => {
                  const JourneyIcon = journey.icon;
                  return (
                    <AccordionItem key={journey.id} value={`recommended-${journey.id}`} className="border bg-card rounded-lg shadow-sm">
                      <AccordionTrigger className="p-3 text-md font-semibold text-primary hover:no-underline hover:bg-muted/30 data-[state=open]:bg-muted/30">
                        <div className="flex items-center">
                          <JourneyIcon className="h-5 w-5 mr-2 text-accent" />
                          {journey.name}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 space-y-4">
                        <div>
                          <h4 className="text-md font-semibold text-primary mb-1 flex items-center">
                            <Target className="h-5 w-5 mr-2 text-accent" /> Overall Targets & Goals
                          </h4>
                          <ul className="list-disc list-inside text-sm text-foreground/90 space-y-1 pl-2">
                            {journey.overallTargets.map((target, index) => (
                              <li key={index}>{target}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-md font-semibold text-primary mb-1 flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-accent" /> Description
                          </h4>
                          <p className="text-sm text-foreground/90">{journey.description}</p>
                        </div>
                        {renderProtocolBreakdown(journey.protocol)}
                        <p className="text-xs text-muted-foreground mt-3">Total Duration: {journey.totalDays} days</p>
                        <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => alert(`Starting ${journey.name} - (prototype)`)}>
                          Switch to this Journey
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
