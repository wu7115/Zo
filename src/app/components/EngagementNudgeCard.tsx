import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, TrendingUp } from "lucide-react";

export function EngagementNudgeCard() {
  return (
    <Link href="/log-activity" className="block hover:shadow-xl transition-shadow duration-200">
      <Card className="shadow-lg bg-secondary hover:bg-secondary/90 cursor-pointer">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-secondary-foreground" />
            <div>
              <CardTitle className="text-lg font-headline text-secondary-foreground">Keep Your Streak Alive!</CardTitle>
              <CardDescription className="text-secondary-foreground/80">Log your activity to stay on track.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4 border-2 border-dashed border-secondary-foreground/30 rounded-lg text-secondary-foreground hover:bg-secondary-foreground/10 transition-colors">
            <PlusCircle className="h-6 w-6 mr-2" />
            <p className="font-semibold">Log Your Daily Activity</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
