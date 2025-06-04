import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckSquare, Edit3 } from 'lucide-react';

export default function LogActivityPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-muted">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-headline text-primary flex items-center">
                <Edit3 className="h-7 w-7 mr-2 text-accent" />
                Log Your Activity
              </CardTitle>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              This is where you'll log your daily wellness activities.
              Feature under development.
            </p>
            <div className="flex flex-col items-center space-y-2">
                <CheckSquare className="h-16 w-16 text-primary/30" />
                <p className="text-sm font-medium text-primary">Activity Logging Coming Soon!</p>
            </div>
            <Button className="w-full" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
