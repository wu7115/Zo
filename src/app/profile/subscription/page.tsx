
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  isCurrent?: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  { id: 'basics', name: 'Gut Basics', description: 'Podium + AI companion' },
  { id: 'signal', name: 'Gut Signal', description: 'Podium, AI companion, annual Microbiome Test' },
  { id: 'genius', name: 'Gut Genius', description: 'Podium, AI companion, semiannual Microbiome Test', isCurrent: true },
  { id: 'concierge', name: 'Gut Concierge', description: 'Podium, AI companion, quarterly Microbiome Test' },
];

const referralCode = "PODIUM25"; // Example referral code

export default function SubscriptionPage() {
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
                  Subscription options
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "p-4 rounded-lg border flex items-center justify-between transition-all",
                    plan.isCurrent
                      ? "bg-secondary/30 border-primary shadow-md"
                      : "bg-muted/40 border-border hover:bg-muted/60"
                  )}
                >
                  <div>
                    <h3 className={cn(
                        "font-semibold",
                        plan.isCurrent ? "text-primary" : "text-foreground"
                    )}>
                        {plan.name}
                    </h3>
                    <p className={cn(
                        "text-sm",
                        plan.isCurrent ? "text-primary/90" : "text-accent" // Matching reddish-brown for description
                    )}>
                        {plan.description}
                    </p>
                  </div>
                  {plan.isCurrent && (
                    <div className="flex items-center text-primary">
                      <CheckCircle className="h-5 w-5 mr-1 text-green-600" />
                      <span className="text-xs font-medium">Current Plan</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-primary mb-2">
                Referral Code
              </h3>
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                <span className="text-accent font-mono tracking-wider">{referralCode}</span>
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(referralCode)}>
                  Copy
                </Button>
              </div>
            </div>

            <CardDescription className="text-xs text-center text-muted-foreground pt-4">
              Manage your subscription plan. Changes may affect your billing cycle.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

    