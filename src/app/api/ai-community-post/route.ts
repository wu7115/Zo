import { NextRequest, NextResponse } from 'next/server';
import { generateCommunityPost } from '@/ai/flows/generate-community-post-flow';

export async function POST(req: NextRequest) {
  try {
    const { onboardingAnswers, batchIndex = 0 } = await req.json();

    // Create user context from onboarding answers
    const userContext = `User is interested in wellness and health tracking. Onboarding answers: ${JSON.stringify(onboardingAnswers)}`;

    // Generate community post
    const communityPost = await generateCommunityPost({ 
      userContext, 
      batchIndex 
    });

    // Add avatar URL and image URL
    const result = {
      ...communityPost,
      friendAvatarUrl: `https://placehold.co/40x40.png?text=${communityPost.friendAvatarFallback}`,
      activityImageUrl: "https://placehold.co/600x400.png",
      activityImageAlt: "Community member's activity post",
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in ai-community-post API:', error);
    // Return a default response on error
    return NextResponse.json({
      friendName: "Alex Johnson",
      friendAvatarUrl: "https://placehold.co/40x40.png?text=AJ",
      friendAvatarFallback: "AJ",
      friendAvatarHint: "profile person",
      timestamp: "2 hours ago",
      activityDetails: "Just completed a 5K run! Feeling energized and ready for the day. 🏃‍♂️ #RunningGoals",
      activityImageUrl: "https://placehold.co/600x400.png",
      activityImageAlt: "Community member's activity post",
      activityImageHint: "running trail",
      likes: 12,
      comments: 3,
    });
  }
} 