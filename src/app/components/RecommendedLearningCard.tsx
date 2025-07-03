import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Youtube, ExternalLink } from "lucide-react";

interface LearningItem {
  id: string;
  type: 'article' | 'video';
  title: string;
  snippet: string;
  source: string;
  imageUrl: string;
  tags?: string[];
  link: string;
  imageHint: string;
}

export function RecommendedLearningCard({ articles }: { articles?: LearningItem[] }) {
  // Only show error if articles is undefined or empty
  if (!articles || articles.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-accent" />
            Expand Your Knowledge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive text-sm">No learning content available.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary flex items-center">
          <BookOpen className="h-6 w-6 mr-2 text-accent" />
          Expand Your Knowledge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {articles.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group hover:bg-muted/50 p-4 rounded-lg transition-colors border bg-card"
            >
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 flex flex-col items-center pt-1">
                  <BookOpen className="h-7 w-7 text-accent mb-2" />
                  {/* Optionally, add a vertical line for visual separation */}
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-md font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2">{item.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">From: {item.source}</p>
                  <p className="text-sm text-foreground/80 mb-2 leading-relaxed line-clamp-3 flex-grow">{item.snippet}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <div className="text-xs text-primary hover:underline flex items-center mt-auto">
                    Read more <ExternalLink className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
