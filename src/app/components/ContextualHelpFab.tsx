
'use client';

import { useState, useEffect, useCallback, SVGProps } from 'react';
import { usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; 

// LabubuIcon
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
  const pathname = usePathname();
  const userName = "Alex"; 
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
      case '/gut-health-score':
        content = `${userName}, your Gut Health Score is a great snapshot!
- Tap the chart to see a detailed breakdown of what contributes to your score.
- Remember, your 'Today's Focus' on the home page often aligns with improving areas of your score.
- Consistent tracking in the 'Diary' helps make this score even more accurate over time.`;
        break;
      case '/gut-health-score/breakdown':
        content = `${userName}, viewing your score breakdown is insightful!
- Notice how 'Microbial Diversity' and 'Diet' play significant roles. Small adjustments here can make a big difference.
- Compare these details with your current 'Journey' – are there overlapping goals you can focus on?
- Use these insights to ask the main AI assistant for specific tips, like 'How can I improve my microbial diversity?'`;
        break;
      default:
        return ""; 
    }
    return content;
  }, [userName]);

  const checkForNewTips = useCallback((currentPath: string): boolean => {
    if (!hasMounted) return false;
    return getMockRecommendations(currentPath).trim().length > 0;
  }, [getMockRecommendations, hasMounted]);

  const fetchRecommendations = useCallback(async () => {
    if (!hasMounted) return;
    setIsLoading(true);
    setRecommendations(null); 
    await new Promise(resolve => setTimeout(resolve, 300)); 
    const content = getMockRecommendations(pathname);
    setRecommendations(content || "No specific tips for this page right now, but feel free to explore!");
    setIsLoading(false);
  }, [pathname, getMockRecommendations, hasMounted]);

  const dispatchUnreadStatus = useCallback(() => {
    if (!hasMounted) return;
    const newStatus = !isPanelOpen && checkForNewTips(pathname);
    window.dispatchEvent(new CustomEvent('unreadTipsStatusChanged', { detail: { hasUnread: newStatus } }));
  }, [isPanelOpen, checkForNewTips, pathname, hasMounted]);

  const handleTogglePanel = useCallback(() => {
    setIsPanelOpen(prevIsPanelOpen => {
      const nextPanelOpenState = !prevIsPanelOpen;
      if (nextPanelOpenState) { 
        fetchRecommendations();
      }
      // Defer dispatch until after the state update has likely completed
      setTimeout(() => dispatchUnreadStatus(), 0);
      return nextPanelOpenState;
    });
  }, [fetchRecommendations, dispatchUnreadStatus]);


  useEffect(() => {
    if (!hasMounted) return;
    window.addEventListener('toggleAiTipsPanel', handleTogglePanel);
    return () => {
      window.removeEventListener('toggleAiTipsPanel', handleTogglePanel);
    };
  }, [handleTogglePanel, hasMounted]);
  
  useEffect(() => {
    if (hasMounted) { 
      dispatchUnreadStatus();
    }
  }, [pathname, hasMounted, dispatchUnreadStatus]); 
  
  useEffect(() => {
    const requestListener = () => {
      if (hasMounted) { 
        dispatchUnreadStatus();
      }
    };
    window.addEventListener('requestUnreadTipsStatus', requestListener);
    return () => {
      window.removeEventListener('requestUnreadTipsStatus', requestListener);
    };
  }, [dispatchUnreadStatus, hasMounted]);


  if (!isPanelOpen) {
    return null; 
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300 ease-in-out md:hidden" 
        onClick={handleTogglePanel} 
      />
      <Card
        className={cn(
          "fixed right-0 w-full max-w-[408px] bg-sidebar shadow-2xl z-40 transform transition-transform duration-300 ease-in-out flex flex-col", // Changed max-w-md to max-w-[408px]
           "bottom-16 md:bottom-20", 
          "h-[33vh]", 
          isPanelOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between p-3 border-b sticky top-0 bg-sidebar z-10">
          <CardTitle className="text-md font-semibold text-sidebar-primary flex items-center">
            <LabubuIcon className="mr-2 h-5 w-5 text-accent" /> AI Tips for {userName}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={handleTogglePanel} className="h-8 w-8">
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
