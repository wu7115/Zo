
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  UserCircle2,
  Edit3,
  Users,
  UserPlus,
  MapPin,
  CreditCard,
  Rocket,
  BarChartBig,
  Bookmark,
  History,
  Settings2,
  Gift,
  AppWindow,
  Bell,
  ShieldCheck,
  HelpCircle,
  Camera,
  ChevronRight,
  HeartPulse, // For Gut Health
  BedDouble,  // For Sleep
  Dumbbell,   // For Strength
  CheckCircle,
} from 'lucide-react';
import * as React from 'react';

interface Journey {
  id: string;
  name: string;
  description: string;
  progress: number;
  daysCompleted: number;
  totalDays: number;
  icon: React.ElementType;
}

const allJourneys: Journey[] = [
  {
    id: 'mindful-mover',
    name: 'Mindful Mover Challenge',
    description: '30 days of integrating movement and mindfulness.',
    progress: 60,
    daysCompleted: 18,
    totalDays: 30,
    icon: Rocket,
  },
  {
    id: 'gut-reset',
    name: 'Gut Health Reset',
    description: 'Focus on diet and lifestyle for a healthier gut.',
    progress: 25, // Example progress
    daysCompleted: 5,
    totalDays: 21,
    icon: HeartPulse,
  },
  {
    id: 'sleep-plan',
    name: 'Sleep Improvement Plan',
    description: 'Strategies for better sleep hygiene and duration.',
    progress: 10, // Example progress
    daysCompleted: 1,
    totalDays: 14,
    icon: BedDouble,
  },
  {
    id: 'strength-builder',
    name: 'Strength Builder Series',
    description: 'Progressive workouts to build strength over 6 weeks.',
    progress: 0,
    daysCompleted: 0,
    totalDays: 42,
    icon: Dumbbell,
  },
];

const initialProfileData = {
  user: {
    name: 'Alex Podium',
    bio: 'Passionate about wellness and achieving peak performance. Join me on my journey to a healthier life!',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarFallback: 'AP',
    avatarHint: 'profile user',
  },
  followersCount: 1250,
  followingCount: 300,
  addresses: ['123 Wellness Lane, Fitville, CA 90210'],
  paymentMethod: 'Visa **** 1234',
};

const SectionTitle: React.FC<{ title: string; onEdit?: () => void }> = ({ title, onEdit }) => (
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-lg font-semibold text-primary">{title}</h3>
    {onEdit && (
      <Button variant="ghost" size="icon" onClick={onEdit} className="text-primary hover:text-accent">
        <Edit3 className="h-4 w-4" />
      </Button>
    )}
  </div>
);

const InfoRow: React.FC<{ label: string; value: string; onEdit?: () => void; icon?: React.ElementType }> = ({ label, value, onEdit, icon: Icon }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center">
      {Icon && <Icon className="h-5 w-5 mr-3 text-muted-foreground" />}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
    {onEdit && (
      <Button variant="ghost" size="icon" onClick={onEdit} className="text-primary hover:text-accent h-8 w-8">
        <Edit3 className="h-4 w-4" />
      </Button>
    )}
  </div>
);

const SettingsListItem: React.FC<{ label: string; icon: React.ElementType; href?: string }> = ({ label, icon: Icon, href = "#" }) => (
  <Link href={href} className="flex items-center justify-between py-3 px-1 hover:bg-muted/50 rounded-md -mx-1">
    <div className="flex items-center">
      <Icon className="h-5 w-5 mr-3 text-primary" />
      <span className="text-sm text-foreground">{label}</span>
    </div>
    <ChevronRight className="h-4 w-4 text-muted-foreground" />
  </Link>
);


export default function ProfilePage() {
  const [activeJourneyId, setActiveJourneyId] = React.useState<string>(allJourneys[0].id);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const activeJourney = allJourneys.find(j => j.id === activeJourneyId) || allJourneys[0];
  const otherJourneys = allJourneys.filter(j => j.id !== activeJourneyId);

  const handleSelectJourney = (journeyId: string) => {
    setActiveJourneyId(journeyId);
    setIsPopoverOpen(false); // Close popover after selection
  };

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-app-content overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-headline text-primary flex items-center">
                <UserCircle2 className="h-7 w-7 mr-2 text-accent" />
                Profile
              </CardTitle>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* User Info Section */}
            <div className="text-center">
              <div className="relative inline-block mb-3">
                <Avatar className="w-24 h-24 border-2 border-primary">
                  <AvatarImage src={initialProfileData.user.avatarUrl} alt={initialProfileData.user.name} data-ai-hint={initialProfileData.user.avatarHint} />
                  <AvatarFallback className="text-3xl">{initialProfileData.user.avatarFallback}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background hover:bg-muted border-primary text-primary">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-xl font-semibold text-primary">{initialProfileData.user.name}</h2>
              <p className="text-sm text-muted-foreground px-4">{initialProfileData.user.bio}</p>
              <Button variant="outline" size="sm" className="mt-3">
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </div>

            <Separator />

            {/* Followers/Following Section */}
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="followers">
                <AccordionTrigger className="text-md font-semibold text-primary hover:no-underline">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-accent" /> Followers ({initialProfileData.followersCount})
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground p-2">
                  Placeholder for list of followers.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="following">
                <AccordionTrigger className="text-md font-semibold text-primary hover:no-underline">
                  <div className="flex items-center">
                    <UserPlus className="mr-2 h-5 w-5 text-accent" /> Following ({initialProfileData.followingCount})
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground p-2">
                  Placeholder for list of users followed.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Separator />

            {/* Account Details Section */}
            <div>
              <SectionTitle title="Account Details" />
              <InfoRow label="Addresses" value={initialProfileData.addresses[0] || 'No address on file'} onEdit={() => {}} icon={MapPin} />
              <Separator className="my-1" />
              <InfoRow label="Payment Method" value={initialProfileData.paymentMethod} onEdit={() => {}} icon={CreditCard} />
            </div>

            <Separator />

            {/* Journey Section */}
            <div>
              <SectionTitle title="Current Journey" />
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-md font-semibold text-primary">{activeJourney.name}</p>
                    <activeJourney.icon className="h-5 w-5 text-accent"/>
                </div>
                <Progress value={activeJourney.progress} className="w-full h-3 mb-1" />
                <p className="text-xs text-muted-foreground text-right">
                  {activeJourney.progress}% ({activeJourney.daysCompleted}/{activeJourney.totalDays} days)
                </p>
                <div className="mt-3 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">Modify Journey</Button>
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="secondary" size="sm" className="flex-1">Choose Another</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none text-primary">Available Journeys</h4>
                          <p className="text-sm text-muted-foreground">
                            Select a new journey to embark on.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          {otherJourneys.map((journey) => {
                            const JourneyIcon = journey.icon;
                            return (
                              <Button
                                key={journey.id}
                                variant="ghost"
                                className="justify-start p-2 h-auto"
                                onClick={() => handleSelectJourney(journey.id)}
                              >
                                <div className="flex items-center space-x-3">
                                  <JourneyIcon className="h-5 w-5 text-accent" />
                                  <div>
                                    <p className="text-sm font-medium text-primary">{journey.name}</p>
                                    <p className="text-xs text-muted-foreground">{journey.description}</p>
                                  </div>
                                </div>
                              </Button>
                            );
                          })}
                           {otherJourneys.length === 0 && (
                            <p className="text-sm text-muted-foreground p-2 text-center">No other journeys available.</p>
                           )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <Separator />

            {/* Bookmarks & History Section */}
             <Accordion type="multiple" className="w-full">
              <AccordionItem value="bookmarks">
                <AccordionTrigger className="text-md font-semibold text-primary hover:no-underline">
                   <div className="flex items-center">
                    <Bookmark className="mr-2 h-5 w-5 text-accent" /> Bookmarks
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground p-2">
                  Placeholder for saved learnings, products, etc.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="history">
                <AccordionTrigger className="text-md font-semibold text-primary hover:no-underline">
                  <div className="flex items-center">
                    <History className="mr-2 h-5 w-5 text-accent" /> Activity History
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground p-2">
                  Placeholder for running audit of activities.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Separator />

            {/* Settings Section */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                <Settings2 className="mr-2 h-5 w-5 text-accent" /> Settings
              </h3>
              <div className="space-y-0.5">
                <SettingsListItem label="Subscription Management" icon={Gift} />
                <SettingsListItem label="Manage Apps and Devices" icon={AppWindow} />
                <SettingsListItem label="Notification Preferences" icon={Bell} />
                <SettingsListItem label="Profile Privacy Settings" icon={ShieldCheck} />
                <SettingsListItem label="Help & Support" icon={HelpCircle} />
              </div>
            </div>

            <Button variant="destructive" className="w-full mt-4">
              Log Out
            </Button>

            <CardDescription className="text-xs text-center text-muted-foreground pt-4">
              Note: Editable fields will have an edit icon. Full edit functionality is under development.
            </CardDescription>

          </CardContent>
        </Card>
      </div>
    </main>
  );
}
    
