import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Youtube, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

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

export function RecommendedLearningCard() {
  const [learningItems, setLearningItems] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearningContent = async () => {
      try {
        // Get onboarding answers from localStorage
        const onboardingAnswers = JSON.parse(localStorage.getItem('onboardingAnswers') || '{}');
        
        const res = await fetch('/api/ai-learning-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            onboardingAnswers,
            batchIndex: 0 // You can implement batch rotation if needed
          }),
        });
        
        const aiContent = await res.json();
        
        if (Array.isArray(aiContent) && aiContent.length > 0) {
          setLearningItems(aiContent);
        } else {
          // Fallback to default content if AI fails
          setLearningItems([
            {
              id: '1',
              type: 'article',
              title: "Understanding Your Digestive Health",
              snippet: "Learn about the factors that influence your gut health and how to optimize your digestive wellness.",
              source: "Wellness Today",
              imageUrl: "https://placehold.co/600x400.png",
              tags: ["Digestive Health", "Wellness", "Education"],
              link: "#",
              imageHint: "digestive health illustration"
            },
            {
              id: '2',
              type: 'video',
              title: "Nutrition for Energy and Vitality",
              snippet: "Discover how your diet choices impact your daily energy levels and overall well-being.",
              source: "Health Channel",
              imageUrl: "https://placehold.co/600x400.png",
              tags: ["Nutrition", "Energy", "Diet"],
              link: "#",
              imageHint: "healthy food preparation"
            },
            {
              id: '3',
              type: 'article',
              title: "Movement and Physical Wellness",
              snippet: "Explore how regular physical activity can improve your health and reduce digestive discomfort.",
              source: "Fitness Hub",
              imageUrl: "https://placehold.co/600x400.png",
              tags: ["Exercise", "Wellness", "Movement"],
              link: "#",
              imageHint: "person exercising"
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching learning content:', error);
        // Fallback to default content on error
        setLearningItems([
          {
            id: '1',
            type: 'article',
            title: "Understanding Your Digestive Health",
            snippet: "Learn about the factors that influence your gut health and how to optimize your digestive wellness.",
            source: "Wellness Today",
            imageUrl: "https://placehold.co/600x400.png",
            tags: ["Digestive Health", "Wellness", "Education"],
            link: "#",
            imageHint: "digestive health illustration"
          },
          {
            id: '2',
            type: 'video',
            title: "Nutrition for Energy and Vitality",
            snippet: "Discover how your diet choices impact your daily energy levels and overall well-being.",
            source: "Health Channel",
            imageUrl: "https://placehold.co/600x400.png",
            tags: ["Nutrition", "Energy", "Diet"],
            link: "#",
            imageHint: "healthy food preparation"
          },
          {
            id: '3',
            type: 'article',
            title: "Movement and Physical Wellness",
            snippet: "Explore how regular physical activity can improve your health and reduce digestive discomfort.",
            source: "Fitness Hub",
            imageUrl: "https://placehold.co/600x400.png",
            tags: ["Exercise", "Wellness", "Movement"],
            link: "#",
            imageHint: "person exercising"
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningContent();
  }, []);

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary">Expand Your Knowledge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex overflow-x-auto space-x-4 pb-2 -mx-4 px-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-72 flex-shrink-0 border bg-card rounded-lg p-4 animate-pulse">
                <div className="bg-muted h-48 rounded-md mb-4"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-3 rounded mb-2"></div>
                <div className="bg-muted h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary">Expand Your Knowledge</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex overflow-x-auto space-x-4 pb-2 -mx-4 px-4">
          {learningItems.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:bg-muted/50 p-4 rounded-lg transition-colors w-72 flex-shrink-0 border bg-card"
            >
              <div className="flex flex-col gap-4 items-start h-full">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={288} 
                  height={192} 
                  className="rounded-md object-cover w-full aspect-[3/2]"
                  data-ai-hint={item.imageHint}
                />
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-md font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2">{item.title}</h3>
                    {item.type === 'article' ? <BookOpen className="h-5 w-5 text-secondary-foreground shrink-0" /> : <Youtube className="h-5 w-5 text-red-600 shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">From: {item.source}</p>
                  <p className="text-sm text-foreground/80 mb-2 leading-relaxed line-clamp-3 flex-grow">{item.snippet}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.tags.map((tag) => (
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
