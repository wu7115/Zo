
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ChevronRight, Heart, Zap, Users, Shuffle, Target } from 'lucide-react';
import Image from 'next/image';

interface IntegrationItemProps {
  name: string;
  icon: React.ElementType;
  connected?: boolean;
  action?: () => void;
  bgImageUrl?: string; // For Apple Health special background
  imageHint?: string;
}

const IntegrationListItem: React.FC<IntegrationItemProps> = ({ name, icon: Icon, connected, action, bgImageUrl, imageHint }) => {
  const itemBaseClasses = "flex items-center justify-between p-4 rounded-lg transition-colors duration-150";
  const connectedClasses = "bg-secondary/20 hover:bg-secondary/30 text-primary"; // Softer version of connected
  const notConnectedClasses = "bg-muted hover:bg-muted/80 text-foreground"; // Darker items

  return (
    <div
      className={`${itemBaseClasses} ${connected ? connectedClasses : notConnectedClasses} ${bgImageUrl ? 'relative' : ''}`}
      onClick={action}
      role={action ? "button" : undefined}
      tabIndex={action ? 0 : undefined}
    >
      {bgImageUrl && (
        <Image
          src={bgImageUrl}
          alt={`${name} background`}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 opacity-20 rounded-lg pointer-events-none"
          data-ai-hint={imageHint}
        />
      )}
      <div className="flex items-center space-x-3 relative z-10">
        <Icon className={`h-6 w-6 ${connected ? 'text-accent' : 'text-primary/70'}`} />
        <span className="text-md font-medium">{name}</span>
      </div>
      {connected && <ChevronRight className="h-5 w-5 text-primary relative z-10" />}
    </div>
  );
};

const integrations = {
  connected: [
    { name: 'APPLE HEALTH', icon: Heart, bgImageUrl: 'https://placehold.co/600x100.png', imageHint: 'health graph' },
  ],
  notConnected: [
    { name: 'Strava', icon: Zap },
    { name: 'TrainingPeaks', icon: Users },
    { name: 'Withings', icon: Heart },
    { name: 'Pliability', icon: Shuffle },
    { name: 'Cronometer', icon: Target },
  ],
};

export default function IntegrationsPage() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-app-content overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="mr-2" asChild>
                  <Link href="/profile">
                    <ArrowLeft className="h-5 w-5 text-primary" />
                  </Link>
                </Button>
                <CardTitle className="text-xl font-headline text-primary">
                  INTEGRATIONS
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Connected Section - Apple Health with unique styling */}
            <IntegrationListItem
              name={integrations.connected[0].name}
              icon={integrations.connected[0].icon}
              connected
              bgImageUrl={integrations.connected[0].bgImageUrl}
              imageHint={integrations.connected[0].imageHint}
              action={() => console.log('Navigate to Apple Health Settings')}
            />

            {/* Not Connected Section */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                NOT CONNECTED
              </h3>
              <div className="space-y-3">
                {integrations.notConnected.map((item) => (
                  <IntegrationListItem
                    key={item.name}
                    name={item.name}
                    icon={item.icon}
                    action={() => console.log(`Connect ${item.name}`)}
                  />
                ))}
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center pt-4">
              Manage your connected apps and services. More integrations coming soon!
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
