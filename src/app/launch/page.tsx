
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LaunchPage() {
  const router = useRouter();

  const handleGoToHome = () => {
    // Ensure the onboarding flag is set if user explicitly skips to home
    // This prevents them from being redirected back to launch from home
    localStorage.setItem('isOnboarded', 'true');
    router.push('/');
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-primary to-accent">
      <div className="text-center space-y-8 bg-card p-8 sm:p-12 rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex flex-col items-center">
          <Rocket className="h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold font-headline text-primary">
            Welcome to Podium!
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Your personalized wellness journey starts here.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
            asChild
          >
            <Link href="/onboarding">
              <Rocket className="mr-2 h-5 w-5" /> Start Onboarding
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full text-lg py-6 border-primary text-primary hover:bg-primary/5"
            onClick={handleGoToHome}
          >
            <Home className="mr-2 h-5 w-5" /> Go to Home Feed
          </Button>
        </div>
        <p className="text-xs text-muted-foreground pt-4">
          Onboarding helps us tailor your experience.
        </p>
      </div>
    </main>
  );
}
