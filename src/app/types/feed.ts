// src/app/types/feed.ts
import type React from 'react';

// Data for a Greeting Card
export interface GreetingFeedData {
  id: string;
  greetingText: string;
  syncStatus?: string;
  accomplishment?: string;
}

// Data for UserActivityCard (props it *should* take in the future)
export interface UserActivityFeedData {
  id: string;
  timestamp: string;
  activityType: string;
  details: string;
  // activityIcon is currently handled internally by UserActivityCard
  metrics: Array<{
    // icon: React.ElementType; // Would ideally be this
    iconName: string; // Placeholder for now, card needs refactor
    label: string;
    value: string;
  }>;
}

// Data for FriendActivityCard (props it *should* take in the future)
export interface FriendActivityFeedData {
  id: string;
  friendName: string;
  friendAvatarUrl: string;
  friendAvatarFallback: string;
  friendAvatarHint?: string;
  timestamp: string;
  activityDetails: string;
  // activityIcon is currently handled internally by FriendActivityCard
  activityImageUrl?: string;
  activityImageAlt?: string;
  activityImageHint?: string;
  likes: number;
  comments: number;
}

// Data for Time-Based Tracking Cards
export interface TimeBasedTrackingFeedData {
  id: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  priorities?: Record<string, 'high' | 'medium' | 'low'>;
}

// Data for Consolidated Missed Tasks Card
export interface ConsolidatedMissedTasksFeedData {
  id: string;
  currentTimeOfDay: 'morning' | 'afternoon' | 'evening';
  priorities?: Record<string, 'high' | 'medium' | 'low'>;
}

// For cards that are self-contained or fetch their own data,
// or for which we are not yet passing dynamic data.
export interface SelfContainedFeedData {
  id: string;
  // Potentially add specific identifiers if needed by the card, e.g. for fetching
}

// Data for AI Insight Card
export interface AiInsightFeedData {
  id: string;
  title: string;
  statement: string;
  rationale: string;
  sourceUrl?: string;
}

// Data for Suggested Topic Card
export interface SuggestedTopicFeedData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  tags: string[];
}

// Data for Suggested Product Card
export interface SuggestedProductFeedData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  link: string;
  price: string;
}

// Data for Posts Section
export interface PostsSectionFeedData {
  id: string;
}

// Discriminated Union for Feed Items
export type FeedItem =
  | { type: 'greeting'; id: string; data: GreetingFeedData }
  | { type: 'morningTracking'; id: string; data: TimeBasedTrackingFeedData }
  | { type: 'afternoonTracking'; id: string; data: TimeBasedTrackingFeedData }
  | { type: 'eveningTracking'; id: string; data: TimeBasedTrackingFeedData }
  | { type: 'consolidatedMissedTasks'; id: string; data: ConsolidatedMissedTasksFeedData }
  | { type: 'weeklySnapshot'; id: string; data: SelfContainedFeedData }
  | { type: 'todaysGoal'; id: string; data: SelfContainedFeedData }
  | { type: 'engagementNudge'; id: string; data: SelfContainedFeedData }
  | { type: 'userActivity'; id: string; data: UserActivityFeedData } // Data is defined, but card will render static for now
  | { type: 'friendActivity'; id: string; data: FriendActivityFeedData } // Data is defined, but card will render static for now
  | { type: 'recommendedLearning'; id: string; data: SelfContainedFeedData }
  | { type: 'productRecommendations'; id: string; data: SelfContainedFeedData }
  | { type: 'aiInsight'; id: string; data: AiInsightFeedData }
  | { type: 'suggestedTopic'; id: string; data: SuggestedTopicFeedData }
  | { type: 'suggestedProduct'; id: string; data: SuggestedProductFeedData }
  | { type: 'postsSection'; id: string; data: PostsSectionFeedData };
