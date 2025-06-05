
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
      fetchRecommendations();
    }
  };

  const fetchRecommendations = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API call

    let content = "";
    const userName = "Alex"; // Mock user name

    switch (pathname) {
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
        content = `${userName}, explore this section to discover new features and tips to support your wellness journey.
- Tip 1: Consider exploring related topics.
- Tip 2: Check out the latest updates in this section.`;
    }
    setRecommendations(content);
    setIsLoading(false);
  };

  useEffect(() => {
    // Reset recommendations if the panel is open and path changes, or if panel is closed
    if (isPanelOpen && recommendations) {
        // If panel is open and path changes, refetch
        fetchRecommendations();
    } else if (!isPanelOpen) {
      setRecommendations(null); // Clear recommendations when panel closes
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isPanelOpen]); // Watch pathname and isPanelOpen

  useEffect(() => {
    // Fetch recommendations when panel opens for the first time on a page or if it was previously closed
    if (isPanelOpen && !recommendations && !isLoading) {
      fetchRecommendations();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPanelOpen]); // Only re-run if isPanelOpen changes


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
          "fixed right-0 w-full max-w-md bg-sidebar shadow-2xl z-40 transform transition-transform duration-300 ease-in-out flex flex-col",
          "bottom-16",
          "h-[33vh]",
          isPanelOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between p-3 border-b sticky top-0 bg-sidebar z-10">
          <CardTitle className="text-md font-semibold text-sidebar-primary flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-accent" /> AI Tips for Alex
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
