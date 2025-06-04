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
  tags: string[];
  link: string;
  imageHint: string;
}

const learningItems: LearningItem[] = [
  {
    id: '1',
    type: 'article',
    title: "The Benefits of Morning Workouts",
    snippet: "Discover why starting your day with exercise can boost your energy and productivity...",
    source: "Wellness Today",
    imageUrl: "https://placehold.co/600x400.png",
    tags: ["Fitness", "Morning Routine", "Productivity"],
    link: "#",
    imageHint: "sunrise workout"
  },
  {
    id: '2',
    type: 'video',
    title: "10-Minute Guided Meditation for Stress Relief",
    snippet: "Follow this quick guided meditation to calm your mind and reduce stress effectively.",
    source: "Mindful Moments YT",
    imageUrl: "https://placehold.co/600x400.png",
    tags: ["Meditation", "Stress Relief", "Mindfulness"],
    link: "#",
    imageHint: "meditation nature"
  },
  {
    id: '3',
    type: 'article',
    title: "Healthy Eating on a Budget",
    snippet: "Learn practical tips for preparing nutritious meals without breaking the bank.",
    source: "Nutrition Hub",
    imageUrl: "https://placehold.co/600x400.png",
    tags: ["Nutrition", "Healthy Eating", "Budgeting"],
    link: "#",
    imageHint: "healthy food"
  },
];

export function RecommendedLearningCard() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary">Expand Your Knowledge</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {learningItems.map((item) => (
          <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className="block hover:bg-muted/50 p-4 rounded-lg transition-colors -m-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={150}
                height={100}
                className="rounded-md object-cover sm:w-[150px] sm:h-[100px] w-full h-auto aspect-[3/2]"
                data-ai-hint={item.imageHint}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                   <h3 className="text-md font-semibold text-primary group-hover:text-accent transition-colors">{item.title}</h3>
                   {item.type === 'article' ? <BookOpen className="h-5 w-5 text-secondary-foreground" /> : <Youtube className="h-5 w-5 text-red-600" />}
                </div>
                <p className="text-xs text-muted-foreground mb-1">From: {item.source}</p>
                <p className="text-sm text-foreground/80 mb-2 leading-relaxed">{item.snippet}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                 <div className="text-xs text-primary hover:underline flex items-center">
                    Read more <ExternalLink className="h-3 w-3 ml-1" />
                 </div>
              </div>
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
