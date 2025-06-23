type PathnameTips = {
    [path: string]: (userName: string) => string;
  };
  
  export const recommendationTips: PathnameTips = {
    '/': (userName) => `${userName}, welcome back!
  - You've logged your sleep! How about adding a quick mood entry from the '+' icon to see how they correlate?
  - Explore the 'Learn' section for articles related to your 'Mindful Mover' journey.
  - Check 'Today's Focus' on the home page for a personalized goal.`,
  
    '/track': (userName) => `${userName}, let's refine your tracking:
  - Remember to fill out the 'Bowel Health & Digestion' section in your diary for deeper insights.
  - View your progress over time in the Dashboard. Are you meeting your step goals?
  - Use the diary to note how different foods or activities affect your energy levels.`,
  
    '/buy': (userName) => `${userName}, some ideas for your marketplace visit:
  - Considering your 'Mindful Mover' journey, our 'Recovery Coffee' or 'Hydration Powder' might be beneficial.
  - Explore Test Kits like ZoBiome to get personalized insights for your next journey.
  - Don't forget, purchases can earn you ZoPoints!`,
  
    '/learn': (userName) => `${userName}, expand your knowledge:
  - Find articles on mindfulness or movement to support your 'Mindful Mover Challenge'.
  - Watch a video on stress relief techniques – it complements an active lifestyle.
  - Bookmark interesting content to revisit later from your Profile page.`,
  
    '/diagnose': (userName) => `${userName}, manage your diagnostics:
  - If you've taken a test like Viome, remember to upload your results here.
  - Considering a new test? Compare the options available for purchase.
  - Your test results will help tailor future journey recommendations.`,
  
    '/profile': (userName) => `${userName}, fine-tune your profile:
  - Review your 'Current Journey' progress. Are you on track with its tasks?
  - Update your bio to reflect your latest wellness achievements or goals!
  - Check your 'Notification Preferences' in Settings.`,
  
    '/journey': (userName) => `${userName}, focus on your journey:
  - Deep dive into your 'Mindful Mover Challenge' protocol. Focus on today's tasks.
  - Explore 'Recommended Journeys'. Perhaps 'Sleep Improvement' could complement your current one?
  - Remember, consistency over a few weeks in a journey yields the best results!`,
  
    '/log-activity': (userName) => `${userName}, great job logging your activity!
  - What's one small win you can log today? Even 10 minutes of stretching counts!
  - Logging consistently helps the AI provide better recommendations for you.`,
  
    '/ask': (userName) => `${userName}, how can I help you today?
  - Ask me about the benefits of mindful movement or how to improve sleep quality!
  - I can help you brainstorm healthy meal ideas or find information on supplements.`,
  
    '/community': (userName) => `${userName}, connect with others:
  - Share your 'Mindful Mover' progress in the feed or join a related challenge!
  - Connect with others who are on similar journeys for motivation and support.
  - Discover new groups based on your interests.`,
  
    '/gut-health-score': (userName) => `${userName}, your Gut Health Score is a great snapshot!
  - Tap the chart to see a detailed breakdown of what contributes to your score.
  - Remember, your 'Today's Focus' on the home page often aligns with improving areas of your score.
  - Consistent tracking in the 'Diary' helps make this score even more accurate over time.`,
  
    '/gut-health-score/breakdown': (userName) => `${userName}, viewing your score breakdown is insightful!
  - Notice how 'Microbial Diversity' and 'Diet' play significant roles. Small adjustments here can make a big difference.
  - Compare these details with your current 'Journey' – are there overlapping goals you can focus on?
  - Use these insights to ask the main AI assistant for specific tips, like 'How can I improve my microbial diversity?'`
  };