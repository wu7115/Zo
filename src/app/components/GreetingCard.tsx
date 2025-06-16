// src/app/components/GreetingCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GreetingFeedData } from "@/app/types/feed";

interface GreetingCardProps {
  data: GreetingFeedData;
}

export function GreetingCard({ data }: GreetingCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3 pt-5">
        <CardTitle className="text-xl font-headline text-primary">{data.greetingText}</CardTitle>
      </CardHeader>
      {(data.syncStatus || data.accomplishment) && (
        <CardContent className="pt-0">
          {data.syncStatus && <p className="text-foreground/90">{data.syncStatus}</p>}
          {data.accomplishment && <p className="text-green-600 font-semibold mt-1">{data.accomplishment}</p>}
        </CardContent>
      )}
    </Card>
  );
}
