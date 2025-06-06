
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

interface JourneyMonth {
  id: string;
  month: number;
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

const allJourneys: Journey[] = [
  {
    id: 'mindful-mover',
    name: 'Mindful Mover Challenge',
    overallTargets: ['Integrate 30 minutes of mindful movement daily', 'Improve focus and reduce stress', 'Build sustainable wellness habits'],
    description: 'A 90-day challenge to harmonize mind and body through daily movement and mindfulness practices. Enhance your physical well-being while cultivating mental clarity, emotional balance, and sustainable habits.',
    icon: Rocket,
    totalDays: 90,
    protocol: [
      {
        id: 'm1', month: 1, title: 'June (Days 1-30): Foundation & Awareness',
        targets: ['Establish a consistent daily movement routine (15-20 mins)', 'Practice 5-10 minutes of mindfulness daily', 'Track mood and energy levels'],
        tasks: [
          { id: 't1', name: 'Track daily activities (movement, mindfulness)' },
          { id: 't2', name: 'Follow guided mindful movement videos (3x week)' },
          { id: 't3', name: 'Complete daily mindfulness meditation session' },
          { id: 't4', name: 'Log sleep patterns and quality' },
          { id: 't5', name: 'Journal stress levels and coping mechanisms' },
          { id: 't6', name: 'Take initial Insights Snapshot (if available)' },
        ],
      },
      {
        id: 'm2', month: 2, title: 'July (Days 31-60): Deepening Practice',
        targets: ['Increase movement duration to 30 mins', 'Explore varied mindfulness techniques', 'Identify personal motivation triggers'],
        tasks: [
          { id: 't7', name: 'Advanced mindful movement routines (30 mins)' },
          { id: 't8', name: 'Try 2 new mindfulness techniques (e.g., body scan, loving-kindness)' },
          { id: 't9', name: 'Weekly reflection on progress and challenges' },
        ],
      },
      {
        id: 'm3', month: 3, title: 'August (Days 61-90): Integration & Lifestyle',
        targets: ['Maintain 30+ minutes of mindful movement most days', 'Incorporate mindfulness into daily activities', 'Reflect on long-term wellness habits'],
        tasks: [
          { id: 't10', name: 'Plan weekly movement schedule independently' },
          { id: 't11', name: 'Practice mindful eating for at least one meal a day' },
          { id: 't12', name: 'Set a new 30-day wellness goal for after the challenge' },
          { id: 't13', name: 'Review progress and celebrate achievements' },
        ],
      }
    ],
  },
  {
    id: 'gut-reset',
    name: 'Gut Health Reset',
    description: '21 days focusing on diet and lifestyle for a healthier gut microbiome. Discover foods that nourish your gut, reduce inflammation, and boost overall vitality.',
    icon: HeartPulse,
    totalDays: 21,
    overallTargets: ['Improve digestion', 'Identify food sensitivities', 'Increase beneficial gut bacteria'],
    protocol: [
      {
        id: 'gr-m1', month: 1, title: 'Phase 1: Elimination & Cleansing (Days 1-7)',
        targets: ['Remove common gut irritants', 'Focus on whole, unprocessed foods'],
        tasks: [
          { id: 'gr-t1', name: 'Follow elimination diet plan' },
          { id: 'gr-t2', name: 'Track symptoms (bloating, energy, mood)' },
          { id: 'gr-t3', name: 'Hydrate adequately (2-3 liters/day)' },
          { id: 'gr-t4', name: 'Take prescribed Microbiome test' },
        ]
      },
      {
        id: 'gr-m2', month: 1, title: 'Phase 2: Reintroduction & Observation (Days 8-14)',
        targets: ['Systematically reintroduce food groups', 'Monitor reactions closely'],
        tasks: [
          { id: 'gr-t5', name: 'Follow reintroduction schedule' },
          { id: 'gr-t6', name: 'Keep detailed food & symptom diary' },
        ]
      },
       {
        id: 'gr-m3', month: 1, title: 'Phase 3: Personalization & Maintenance (Days 15-21)',
        targets: ['Develop a personalized, sustainable gut-friendly diet', 'Receive Insights Snapshot based on test'],
        tasks: [
          { id: 'gr-t7', name: 'Review Microbiome test results & Insights' },
          { id: 'gr-t8', name: 'Plan meals based on personalized recommendations' },
        ]
      }
    ]
  },
  {
    id: 'sleep-plan',
    name: 'Sleep Improvement Plan',
    description: 'A 14-day plan with strategies for better sleep hygiene and duration. Learn to create a restful environment and habits that promote deep, restorative sleep.',
    icon: BedDouble,
    totalDays: 14,
    overallTargets: ['Achieve 7-9 hours of quality sleep', 'Establish a consistent sleep schedule', 'Reduce sleep disturbances'],
     protocol: [
      {
        id: 'sp-m1', month: 1, title: 'Week 1: Sleep Hygiene Foundation',
        targets: ['Optimize bedroom environment', 'Implement pre-sleep routine'],
        tasks: [
          { id: 'sp-t1', name: 'Set consistent bedtime and wake-up time' },
          { id: 'sp-t2', name: 'No screens 1 hour before bed' },
          { id: 'sp-t3', name: 'Ensure dark, quiet, cool bedroom' },
          { id: 'sp-t4', name: 'Track sleep duration and perceived quality' },
        ]
      },
      {
        id: 'sp-m2', month: 1, title: 'Week 2: Advanced Techniques & Troubleshooting',
        targets: ['Address common sleep disruptors', 'Practice relaxation techniques'],
        tasks: [
          { id: 'sp-t5', name: 'Limit caffeine and alcohol, especially in evening' },
          { id: 'sp-t6', name: 'Try guided meditation or relaxation exercises before bed' },
          { id: 'sp-t7', name: 'Review sleep log for patterns' },
        ]
      }
    ]
  },
  {
    id: 'strength-builder',
    name: 'Strength Builder Series',
    description: 'A 6-week program with progressive workouts to build foundational strength. Suitable for all levels, focusing on correct form and gradual overload.',
    icon: Dumbbell,
    totalDays: 42,
    overallTargets: ['Increase overall muscular strength', 'Improve body composition', 'Enhance functional fitness'],
     protocol: [
      {
        id: 'sb-m1', month: 1, title: 'Month 1 (Weeks 1-4): Foundational Strength',
        targets: ['Master basic compound movements', 'Complete 3 full-body workouts per week'],
        tasks: [
          { id: 'sb-t1', name: 'Workout A (Squats, Push-ups, Rows)' },
          { id: 'sb-t2', name: 'Workout B (Deadlifts, Overhead Press, Pull-aparts)' },
          { id: 'sb-t3', name: 'Track sets, reps, and weight lifted' },
          { id: 'sb-t4', name: 'Focus on proper form for all exercises' },
          { id: 'sb-t5', name: 'Ensure adequate protein intake' },
        ]
      },
       {
        id: 'sb-m2', month: 2, title: 'Month 2 (Weeks 5-6): Progressive Overload',
        targets: ['Gradually increase weight/reps', 'Introduce accessory exercises'],
        tasks: [
          { id: 'sb-t6', name: 'Continue core workouts with increased intensity' },
          { id: 'sb-t7', name: 'Add 2-3 accessory exercises per workout' },
        ]
      }
    ]
  },
  {
    id: 'hydration-hero',
    name: 'Hydration Hero',
    description: '7 days to establish consistent and optimal hydration habits. Understand your body\'s hydration needs and learn tips to stay adequately hydrated throughout the day.',
    icon: Droplets,
    totalDays: 7,
    overallTargets: ['Drink 2-3 liters of water daily', 'Recognize signs of dehydration', 'Make hydration a consistent habit'],
    protocol: [
      {
        id: 'hh-m1', month: 1, title: 'Week 1: Hydration Habit Formation',
        targets: ['Track water intake consistently', 'Experiment with hydration reminders'],
        tasks: [
          { id: 'hh-t1', name: 'Set daily water intake goal' },
          { id: 'hh-t2', name: 'Log every glass/bottle of water' },
          { id: 'hh-t3', name: 'Carry a water bottle at all times' },
          { id: 'hh-t4', name: 'Note energy levels and thirst cues' },
        ]
      }
    ]
  },
  {
    id: 'digital-detox',
    name: 'Digital Detox Challenge',
    description: 'A 10-day challenge to reduce screen time and improve mental clarity. Reclaim your time and attention by setting healthy boundaries with technology.',
    icon: WifiOff,
    totalDays: 10,
    overallTargets: ['Reduce daily screen time by 25%', 'Improve sleep quality', 'Increase present-moment awareness'],
    protocol: [
      {
        id: 'dd-m1', month: 1, title: 'Days 1-5: Awareness & Initial Reductions',
        targets: ['Track current screen time', 'Identify trigger apps/times', 'Implement "no-screen" zones/times'],
        tasks: [
          { id: 'dd-t1', name: 'Use a screen time tracking app' },
          { id: 'dd-t2', name: 'Turn off non-essential notifications' },
          { id: 'dd-t3', name: 'No screens in the bedroom' },
          { id: 'dd-t4', name: 'Schedule 1-hour tech-free block daily' },
        ]
      },
      {
        id: 'dd-m2', month: 1, title: 'Days 6-10: Deeper Disconnection & Alternatives',
        targets: ['Further reduce screen time', 'Engage in offline activities', 'Reflect on changes'],
        tasks: [
          { id: 'dd-t5', name: 'Designate a "tech-free" day (or half-day)' },
          { id: 'dd-t6', name: 'Replace screen time with hobbies, social interaction, or outdoor activities' },
          { id: 'dd-t7', name: 'Journal about feelings and observations during detox' },
        ]
      }
    ]
  },
  {
    id: 'mindful-eating',
    name: 'Mindful Eating Kickstart',
    description: '14 days to cultivate mindful eating practices for better digestion and awareness. Learn to savor your food, recognize hunger cues, and build a healthier relationship with eating.',
    icon: MindfulEatingIcon,
    totalDays: 14,
    overallTargets: ['Improve digestion and nutrient absorption', 'Reduce overeating', 'Increase enjoyment of food'],
    protocol: [
      {
        id: 'me-m1', month: 1, title: 'Week 1: Foundations of Mindful Eating',
        targets: ['Practice eating without distractions for one meal daily', 'Identify hunger and fullness cues'],
        tasks: [
          { id: 'me-t1', name: 'Eat at least one meal per day slowly and without screens' },
          { id: 'me-t2', name: 'Pay attention to taste, texture, smell of food' },
          { id: 'me-t3', name: 'Pause mid-meal to assess fullness' },
          { id: 'me-t4', name: 'Keep a mindful eating journal' },
        ]
      },
      {
        id: 'me-m2', month: 1, title: 'Week 2: Deepening Awareness & Emotional Eating',
        targets: ['Extend mindful eating to more meals', 'Recognize emotional eating triggers'],
        tasks: [
          { id: 'me-t5', name: 'Practice mindful eating for two meals daily' },
          { id: 'me-t6', name: 'Explore non-food coping mechanisms for emotions' },
          { id: 'me-t7', name: 'Reflect on relationship with food' },
        ]
      }
    ]
  },
];


export default function JourneyPage() {
  // For prototype, let's assume 'mindful-mover' is the current active journey
  // In a real app, this would come from user state, props, or URL params
  const currentJourneyId = 'mindful-mover';
  const currentJourney = allJourneys.find(j => j.id === currentJourneyId) || allJourneys[0];
  const recommendedJourneys = allJourneys.filter(j => j.id !== currentJourneyId);

  const [activeAccordionItem, setActiveAccordionItem] = React.useState<string | string[]>(`journey-${currentJourney.id}`);

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
                      <Target className="h-5 w-5 mr-2 text-secondary-foreground" /> Overall Targets & Goals
                    </h4>
                    <ul className="list-disc list-inside text-sm text-foreground/90 space-y-1 pl-2">
                      {currentJourney.overallTargets.map((target, index) => (
                        <li key={index}>{target}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold text-primary mb-1 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-secondary-foreground" /> Description
                    </h4>
                    <p className="text-sm text-foreground/90">{currentJourney.description}</p>
                  </div>

                  <div>
                    <h4 className="text-md font-semibold text-primary mb-2 flex items-center">
                      <ListChecks className="h-5 w-5 mr-2 text-secondary-foreground" /> Protocol Breakdown
                    </h4>
                    <Accordion type="multiple" className="w-full space-y-2">
                      {currentJourney.protocol.map((monthData) => (
                        <AccordionItem key={monthData.id} value={monthData.id} className="border bg-muted/20 rounded-md">
                          <AccordionTrigger className="p-3 text-sm font-medium text-primary hover:no-underline data-[state=open]:bg-muted/30">
                            {monthData.title}
                          </AccordionTrigger>
                          <AccordionContent className="p-3 space-y-2">
                            <div>
                              <h5 className="text-xs font-semibold text-primary mb-1">Monthly Targets:</h5>
                              <ul className="list-disc list-inside text-xs text-foreground/80 space-y-0.5 pl-2">
                                {monthData.targets.map((target, index) => (
                                  <li key={index}>{target}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-xs font-semibold text-primary mb-1">Tasks:</h5>
                              <ul className="list-disc list-inside text-xs text-foreground/80 space-y-0.5 pl-2">
                                {monthData.tasks.map((task) => (
                                  <li key={task.id}>{task.name}</li>
                                ))}
                              </ul>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
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
                      <AccordionContent className="p-3">
                        <p className="text-sm text-foreground/80 mb-2">{journey.description}</p>
                        <p className="text-xs text-muted-foreground">Total Duration: {journey.totalDays} days</p>
                        <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => alert(`Starting ${journey.name} - (prototype)`)}>
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
