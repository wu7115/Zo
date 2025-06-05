
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ArrowLeft,
  UserCircle2,
  Edit3,
  Users,
  UserPlus,
  MapPin,
  CreditCard,
  Rocket,
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
  HeartPulse,
  BedDouble,
  Dumbbell,
  Droplets,
  WifiOff,
  Apple as MindfulEatingIcon, 
  Map, 
} from 'lucide-react';
import * as React from 'react';
import type { SVGProps } from 'react';

// LabubuIcon definition
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
    description: '30 days of integrating movement and mindfulness for a holistic boost.',
    progress: 60,
    daysCompleted: 18,
    totalDays: 30,
    icon: Rocket,
  },
  {
    id: 'gut-reset',
    name: 'Gut Health Reset',
    description: '21 days focusing on diet and lifestyle for a healthier gut microbiome.',
    progress: 25,
    daysCompleted: 5,
    totalDays: 21,
    icon: HeartPulse,
  },
  {
    id: 'sleep-plan',
    name: 'Sleep Improvement Plan',
    description: '14-day plan with strategies for better sleep hygiene and duration.',
    progress: 10,
    daysCompleted: 1,
    totalDays: 14,
    icon: BedDouble,
  },
  {
    id: 'strength-builder',
    name: 'Strength Builder Series',
    description: 'A 6-week program with progressive workouts to build foundational strength.',
    progress: 0,
    daysCompleted: 0,
    totalDays: 42,
    icon: Dumbbell,
  },
  {
    id: 'hydration-hero',
    name: 'Hydration Hero',
    description: '7 days to establish consistent and optimal hydration habits.',
    progress: 75,
    daysCompleted: 5,
    totalDays: 7,
    icon: Droplets,
  },
  {
    id: 'digital-detox',
    name: 'Digital Detox Challenge',
    description: '10-day challenge to reduce screen time and improve mental clarity.',
    progress: 30,
    daysCompleted: 3,
    totalDays: 10,
    icon: WifiOff,
  },
  {
    id: 'mindful-eating',
    name: 'Mindful Eating Kickstart',
    description: '14 days to cultivate mindful eating practices for better digestion and awareness.',
    progress: 5,
    daysCompleted: 1,
    totalDays: 14,
    icon: MindfulEatingIcon,
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
  const activeJourney = allJourneys.find(j => j.id === 'mindful-mover') || allJourneys[0];
  const [isEditingPayment, setIsEditingPayment] = React.useState(false);

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

            <div>
              <SectionTitle title="Account Details" />
              <InfoRow label="Addresses" value={initialProfileData.addresses[0] || 'No address on file'} onEdit={() => { /* Handle address edit */ }} icon={MapPin} />
              <Separator className="my-1" />

              {!isEditingPayment ? (
                <InfoRow
                  label="Payment Method"
                  value={initialProfileData.paymentMethod}
                  onEdit={() => setIsEditingPayment(true)}
                  icon={CreditCard}
                />
              ) : (
                <div className="py-2">
                  <div className="flex items-center mb-3">
                    <CreditCard className="h-5 w-5 mr-3 text-muted-foreground" />
                    <h4 className="text-sm font-semibold text-primary">Edit Payment Method</h4>
                  </div>
                  <div className="space-y-4 pl-8"> {/* Indent to align with InfoRow content */}
                    <div>
                      <Label htmlFor="cardNumber" className="text-xs">Card Number</Label>
                      <Input id="cardNumber" placeholder="•••• •••• •••• ••••" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiryDate" className="text-xs">Expiry (MM/YY)</Label>
                        <Input id="expiryDate" placeholder="MM/YY" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-xs">CVV</Label>
                        <Input id="cvv" placeholder="•••" type="password" className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardholderName" className="text-xs">Cardholder Name</Label>
                      <Input id="cardholderName" placeholder="Name on card" className="mt-1" />
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <p className="text-xs font-medium text-muted-foreground mb-2">Or use alternative payment methods:</p>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <Button variant="outline" className="w-full justify-center text-sm py-2 h-auto">
                        {/* Placeholder for Apple Pay Icon */}
                        <svg viewBox="0 0 16 16" className="w-5 h-5 mr-2 fill-current" aria-hidden="true"><path d="M8.273.98A3.333 3.333 0 005.422 0H5.35C3.045 0 1.297.873.486 2.658c-.808 1.79-.31 4.815 1.258 6.377.962.962 2.132 1.503 3.483 1.503.273 0 .548-.027.81-.082a4.42 4.42 0 001.02-.328c.027.027.027.027.054.054.518.518 1.2.788 1.956.788.082 0 .163-.027.245-.027.902-.136 1.603-.68 1.956-1.386.082-.218.11-.435.11-.652a2.386 2.386 0 00-.788-1.764c-.626-.626-1.467-.81-2.09-.81-.624 0-1.144.11-1.603.354-.273-.873-.982-1.359-1.928-1.359-.932 0-1.57.49-2.091 1.359-.761.054-1.385.272-1.87.652C2.186 9.176 1.177 7.73 1.177 6.114c0-1.254.49-2.29 1.284-3.018C3.27 2.29 4.135 1.83 5.323 1.83h.11c1.033 0 1.87.518 2.338 1.332.326-.081.65-.135.98-.135.734 0 1.44.243 2.006.702.272-.243.518-.46.734-.65C12.44 2.126 13.052.98 14.194.98h.217a3.52 3.52 0 012.312 1.033c.027.027.054.054.054.082v.054c0 .027-.027.054-.054.054C15.11 6.004 14.075 7.648 14.075 9.49c0 1.332.408 2.472 1.196 3.282.652.705.818 1.386.762 2.09-.054.762-.435 1.414-1.037 1.872-.518.354-1.115.544-1.737.544-.68 0-1.332-.218-1.843-.652-.6-.518-1.037-1.254-1.284-2.208-.054-.19-.082-.38-.082-.572a2.199 2.199 0 01.082-.572c.217-.762.652-1.332 1.256-1.708.244-.163.408-.38.408-.652a.823.823 0 00-.818-.818c-.354 0-.626.19-.788.49-.49.902-1.115 1.63-1.983 2.122-.3.163-.626.245-.982.245a2.12 2.12 0 01-.982-.245c-.873-.49-1.497-1.226-1.983-2.122-.163-.3-.435-.49-.788-.49a.823.823 0 00-.818.818c0 .272.163.49.408.652.6.38 1.036.95 1.256 1.708.027.19.054.381.054.572 0 .19-.027.38-.082.572-.244.954-.68 1.69-1.284 2.208-.518.435-1.17.652-1.843.652-.626 0-1.228-.19-1.737-.544-.6-.462-.982-1.114-1.036-1.872-.054-.704.11-1.386.762-2.09.788-.81 1.196-1.95 1.196-3.282C5.55 7.648 4.516 6.004 2.873 3.256c-.027-.027-.054-.027-.054-.054V3.15c0-.027.027-.054.054-.054A3.52 3.52 0 015.133.98h.217c1.142 0 1.754 1.146 2.062 2.15.218.027.435.082.653.135.734.19 1.305.598 1.575 1.2.3-.68.87-.954 1.522-.954.217 0 .435.027.626.082l.027.027z" fillRule="evenodd"></path></svg>
                        Apple Pay
                      </Button>
                      <Button variant="outline" className="w-full justify-center text-sm py-2 h-auto">
                        {/* Placeholder for Google Pay Icon */}
                         <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" aria-hidden="true"><path d="M10.21,15.269V8.731H8.75V6.5h5.438v2.231H12.75v6.538Z" fill="#EA4335"></path><path d="M19.062,10.635a6.273,6.273,0,0,0-.422-2.383,6.561,6.561,0,0,0-1.2-1.828,6.621,6.621,0,0,0-1.828-1.2,6.366,6.366,0,0,0-2.383-.422H13V4.5h.231a6.323,6.323,0,0,0,4.523,1.914,6.5,6.5,0,0,0,3.328-1.016L19.5,7.039A5.253,5.253,0,0,1,16.5,8.125a5.138,5.138,0,0,1-3.273-1.086V8.922h1.883A3.633,3.633,0,0,1,18.5,12.5a3.633,3.633,0,0,1-3.383,3.578H13v.289A6.762,6.762,0,0,0,19.062,10.635Z" fill="#4285F4"></path><path d="M7.25,10.635a6.273,6.273,0,0,1,.422-2.383,6.561,6.561,0,0,1,1.2-1.828,6.621,6.621,0,0,1,1.828-1.2,6.366,6.366,0,0,1,2.383-.422H13V4.5h-.231a6.323,6.323,0,0,1-4.523,1.914,6.5,6.5,0,0,1-3.328-1.016L6.5,7.039A5.253,5.253,0,0,0,9.5,8.125a5.138,5.138,0,0,0,3.273-1.086V8.922H10.883A3.633,3.633,0,0,0,7.5,12.5a3.633,3.633,0,0,0,3.383,3.578H13v.289A6.762,6.762,0,0,1,7.25,10.635Z" fill="#FBBC04"></path><path d="M13,19.5h.231a6.323,6.323,0,0,0,4.523-1.914,6.5,6.5,0,0,0,3.328,1.016L19.5,16.961A5.253,5.253,0,0,1,16.5,15.875a5.138,5.138,0,0,1-3.273,1.086V15.078h1.883A3.633,3.633,0,0,0,18.5,11.5a3.633,3.633,0,0,0-3.383-3.578H13v-.289A6.762,6.762,0,0,0,7.25,13.365a6.273,6.273,0,0,0-.422,2.383,6.561,6.561,0,0,0,1.2,1.828,6.621,6.621,0,0,0,1.828,1.2,6.366,6.366,0,0,0,2.383.422H13Z" fill="#34A853"></path></svg>
                        Google Pay
                      </Button>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-6">
                      <Button variant="outline" onClick={() => setIsEditingPayment(false)}>Cancel</Button>
                      <Button onClick={() => { /* Handle save */ setIsEditingPayment(false); }}>Save Changes</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

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
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                     <Link href="/journey">
                        <Map className="mr-2 h-4 w-4" /> Modify Journey
                     </Link>
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1" asChild>
                    <Link href="/journey">
                        <Map className="mr-2 h-4 w-4" /> Choose Another
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

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

            <div>
              <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                <Settings2 className="mr-2 h-5 w-5 text-accent" /> Settings
              </h3>
              <div className="space-y-0.5">
                <SettingsListItem label="Subscription" icon={Gift} href="/profile/subscription" />
                <SettingsListItem label="Integrations" icon={AppWindow} href="/profile/integrations" />
                <SettingsListItem label="Notification Preferences" icon={Bell} href="/profile/notifications" />
                <SettingsListItem label="Profile Privacy Settings" icon={ShieldCheck} href="/profile/privacy" />
                <SettingsListItem label="Help & Support" icon={HelpCircle} href="/profile/help" />
              </div>
            </div>

            <Button variant="destructive" className="w-full mt-4">
              Log Out
            </Button>

            <CardDescription className="text-xs text-center text-muted-foreground pt-4">
              Note: Editable fields will have an edit icon. Full edit functionality is under development. Some links are placeholders.
            </CardDescription>

          </CardContent>
        </Card>
      </div>
    </main>
  );
}
