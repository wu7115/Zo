import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import Image from 'next/image';
import type { SuggestedTopicFeedData } from '@/app/types/feed';
import { BookOpen, ExternalLink } from 'lucide-react';

export function SuggestedTopicCard({ data }: { data: SuggestedTopicFeedData }) {
  // Add fallbacks for missing data
  const title = data?.title || "Health Topic";
  const description = data?.description || "Learn about personalized health topics.";
  const tags = Array.isArray(data?.tags) ? data.tags : ["Health"];
  const link = data?.link || "#";

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary flex items-center">
          <BookOpen className="h-6 w-6 mr-2 text-accent" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {/* <Image src={data.imageUrl} alt={data.title} width={288} height={192} className="rounded-md object-cover w-full aspect-[3/2]" /> */}
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center">
            Read more <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
} 