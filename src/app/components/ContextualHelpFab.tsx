
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Lightbulb, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ContextualHelpFab() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
    if (!isPanelOpen && !recommendations) {
      // Simulate fetching recommendations when panel opens for the first time
      fetchRecommendations();
    }
  };

  const fetchRecommendations = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRecommendations(`Here are some AI-powered suggestions for the ${pathname === '/' ? 'Home' : pathname.substring(1)} page:\n\n- Tip 1: Consider exploring related topics.\n- Tip 2: Check out the latest updates in this section.\n- Tip 3: Engage with the community features.`);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isPanelOpen && !recommendations && !isLoading) {
      fetchRecommendations();
    }
    if (!isPanelOpen) {
      // Optionally clear recommendations when panel closes to refetch next time
      // setRecommendations(null); 
    }
  }, [isPanelOpen, pathname]);

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-xl z-30 animate-pulse bg-accent hover:bg-accent/90 text-accent-foreground"
        onClick={togglePanel}
        aria-label="Toggle AI Recommendations"
      >
        <Lightbulb className="h-7 w-7" />
      </Button>

      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300 ease-in-out md:hidden"
          onClick={togglePanel} 
        />
      )}

      <Card
        className={cn(
          "fixed right-0 w-full max-w-md bg-background shadow-2xl z-40 transform transition-transform duration-300 ease-in-out flex flex-col",
          "bottom-16", // Positioned above the BottomNavigationBar
          "h-[33vh]",  // Approximately 1/3 of viewport height
          isPanelOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between p-3 border-b sticky top-0 bg-background z-10">
          <CardTitle className="text-md font-semibold text-primary flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-accent" /> AI Recommendations
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={togglePanel} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-grow flex flex-col overflow-hidden">
          <ScrollArea className="flex-grow p-3">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading tips...</p>
              </div>
            )}
            {!isLoading && recommendations && (
              <p className="text-sm text-foreground whitespace-pre-wrap">{recommendations}</p>
            )}
            {!isLoading && !recommendations && (
              <p className="text-sm text-muted-foreground text-center pt-4">No recommendations available at the moment.</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
