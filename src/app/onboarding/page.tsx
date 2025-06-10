
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowRight, CheckCircle, ListChecks } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();

  const handleFinishOnboarding = () => {
    // Simulate collecting and saving onboarding data
    console.log('Onboarding data (placeholder) collected.');
    localStorage.setItem('isOnboarded', 'true');
    // Conceptually, this data would be passed to AI services or user profile backend
    router.push('/');
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-accent to-secondary">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <div className="inline-block mx-auto p-3 bg-primary/10 rounded-full mb-4">
            <ListChecks className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline text-primary">Onboarding Process</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-1">
            Let's get to know you better! (Step 1 of X)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              This is a placeholder for the first step of the onboarding module.
              Here, you would typically ask the user questions about their preferences,
              goals, or initial data.
            </p>
            <div className="p-4 bg-muted/50 rounded-lg border text-sm text-foreground">
              Imagine form fields, selections, or interactive elements here to gather user input.
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 p-6 bg-muted/30 border-t">
          <Button variant="outline" size="lg" className="w-full sm:w-auto text-primary border-primary hover:bg-primary/5">
            <Link href="/launch">
              Back to Launch
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-primary border-primary hover:bg-primary/5" disabled>
              Next Step <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleFinishOnboarding}
            >
              Finish Onboarding <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      <p className="text-center text-xs text-primary-foreground/70 mt-8">
        The information gathered here will help personalize your Podium experience.
      </p>
    </main>
  );
}
