
'use client';

import { useState, useEffect, useCallback, SVGProps } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// LabubuIcon copied from BottomNavigationBar.tsx
const LabubuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="14" r="3.5" />
    <path d="M9.5 11.5C9 8 7 6.5 8.5 4.5S12 6 12 6" />
    <path d="M14.5 11.5C15 8 17 6.5 15.5 4.5S12 6 12 6" />
    <circle cx="10.5" cy="14" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="13.5" cy="14" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

export function ContextualHelpFab() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnreadTips, setHasUnreadTips] = useState(false);
  const pathname = usePathname();
  const userName = "Alex"; // Mock user name

  const getMockRecommendations = useCallback((currentPath: string): string => {
    let content = "";
    switch (currentPath) {
      case '/':
        content = `${userName}, welcome back!
- You've logged your sleep! How about adding a quick mood entry from the '+' icon to see how they correlate?
- Explore the 'Learn' section for articles related to your 'Mindful Mover' journey.
- Check 'Today's Focus' on the home page for a personalized goal.`;
        break;
      case '/track':
        content = `${userName}, let's refine your tracking:
- Remember to fill out the 'Bowel Health & Digestion' section in your diary for deeper insights.
- View your progress over time in the Dashboard. Are you meeting your step goals?
- Use the diary to note how different foods or activities affect your energy levels.`;
        break;
      case '/buy':
        content = `${userName}, some ideas for your marketplace visit:
- Considering your 'Mindful Mover' journey, our 'Recovery Coffee' or 'Hydration Powder' might be beneficial.
- Explore Test Kits like ZoBiome to get personalized insights for your next journey.
- Don't forget, purchases can earn you ZoPoints!`;
        break;
      case '/learn':
        content = `${userName}, expand your knowledge:
- Find articles on mindfulness or movement to support your 'Mindful Mover Challenge'.
- Watch a video on stress relief techniques – it complements an active lifestyle.
- Bookmark interesting content to revisit later from your Profile page.`;
        break;
      case '/diagnose':
        content = `${userName}, manage your diagnostics:
- If you've taken a test like Viome, remember to upload your results here.
- Considering a new test? Compare the options available for purchase.
- Your test results will help tailor future journey recommendations.`;
        break;
      case '/profile':
        content = `${userName}, fine-tune your profile:
- Review your 'Current Journey' progress. Are you on track with its tasks?
- Update your bio to reflect your latest wellness achievements or goals!
- Check your 'Notification Preferences' in Settings.`;
        break;
      case '/journey':
         content = `${userName}, focus on your journey:
- Deep dive into your 'Mindful Mover Challenge' protocol. Focus on today's tasks.
- Explore 'Recommended Journeys'. Perhaps 'Sleep Improvement' could complement your current one?
- Remember, consistency over a few weeks in a journey yields the best results!`;
        break;
      case '/log-activity':
        content = `${userName}, great job logging your activity!
- What's one small win you can log today? Even 10 minutes of stretching counts!
- Logging consistently helps the AI provide better recommendations for you.`;
        break;
      case '/ask':
         content = `${userName}, how can I help you today?
- Ask me about the benefits of mindful movement or how to improve sleep quality!
- I can help you brainstorm healthy meal ideas or find information on supplements.`;
        break;
      case '/community':
        content = `${userName}, connect with others:
- Share your 'Mindful Mover' progress in the feed or join a related challenge!
- Connect with others who are on similar journeys for motivation and support.
- Discover new groups based on your interests.`;
        break;
      default:
        // No specific recommendations for this path
        return "";
    }
    return content;
  }, [userName]);


  const checkForNewTips = useCallback((currentPath: string): boolean => {
    const availableRecommendations = getMockRecommendations(currentPath);
    return availableRecommendations.trim().length > 0;
  }, [getMockRecommendations]);

  useEffect(() => {
    if (!isPanelOpen) {
      setHasUnreadTips(checkForNewTips(pathname));
    }
  }, [pathname, isPanelOpen, checkForNewTips]);


  const fetchRecommendations = async () => {
    setIsLoading(true);
    setRecommendations(null); // Clear old recommendations
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API call
    
    const content = getMockRecommendations(pathname);
    setRecommendations(content || "No specific tips for this page right now, but feel free to explore!");
    setIsLoading(false);
  };

  const togglePanel = () => {
    const nextPanelOpenState = !isPanelOpen;
    setIsPanelOpen(nextPanelOpenState);

    if (nextPanelOpenState) { // Panel is opening
      fetchRecommendations();
      setHasUnreadTips(false); // Tips are now "read"
    } else { // Panel is closing
      // Re-check for tips for the current page if panel is closed
      setHasUnreadTips(checkForNewTips(pathname));
    }
  };
  
  useEffect(() => {
    // Initial check for tips on mount
    if (!isPanelOpen) {
      setHasUnreadTips(checkForNewTips(pathname));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount


  return (
    <>
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-xl z-30 bg-accent hover:bg-accent/90 text-accent-foreground"
        onClick={togglePanel}
        aria-label="Toggle AI Recommendations"
      >
        <LabubuIcon className="h-7 w-7" />
        {hasUnreadTips && (
           <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-600 ring-2 ring-background" />
        )}
      </Button>

      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300 ease-in-out md:hidden"
          onClick={togglePanel}
        />
      )}

      <Card
        className={cn(
          "fixed right-0 w-full max-w-md bg-sidebar shadow-2xl z-40 transform transition-transform duration-300 ease-in-out flex flex-col",
          "bottom-16 md:bottom-20", // Adjust bottom based on screen size
          "h-[33vh]",
          isPanelOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between p-3 border-b sticky top-0 bg-sidebar z-10">
          <CardTitle className="text-md font-semibold text-sidebar-primary flex items-center">
            <LabubuIcon className="mr-2 h-5 w-5 text-accent" /> AI Tips for {userName}
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
