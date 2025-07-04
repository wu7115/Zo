import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import type { AiInsightFeedData } from '@/app/types/feed';

export function AiInsightCard({ data }: { data: AiInsightFeedData }) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary flex items-center">
          <Lightbulb className="h-6 w-6 mr-2 text-accent" />
          {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-md font-medium text-foreground">{data.statement}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.rationale}</p>
        {data.sourceUrl && (
          <a href={data.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
            Source
          </a>
        )}
      </CardContent>
    </Card>
  );
} 