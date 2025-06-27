import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, MessageCircle, Bike, CalendarDays, MoreHorizontal } from "lucide-react";
import type { FriendActivityFeedData } from '@/app/types/feed';

interface FriendActivityCardProps {
  data: FriendActivityFeedData;
}

export function FriendActivityCard({ data }: FriendActivityCardProps) {
  // Use data from props, with fallbacks for missing data
  const friendName = data?.friendName || "Community Member";
  const friendAvatarUrl = data?.friendAvatarUrl || "https://placehold.co/40x40.png?text=CM";
  const friendAvatarFallback = data?.friendAvatarFallback || "CM";
  const friendAvatarHint = data?.friendAvatarHint || "profile person";
  const timestamp = data?.timestamp || "Recently";
  const activityDetails = data?.activityDetails || "Shared an activity update.";
  const activityImageUrl = data?.activityImageUrl;
  const activityImageAlt = data?.activityImageAlt || "Activity post";
  const activityImageHint = data?.activityImageHint || "activity";
  const likes = data?.likes || 0;
  const comments = data?.comments || 0;

  return (
    <Card className="shadow-lg relative">
      {/* Top right icon button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 p-1 h-7 w-7 text-muted-foreground hover:text-primary"
        aria-label="View Details"
      >
        <MoreHorizontal className="h-5 w-5" />
      </Button>
      <CardHeader className="flex flex-row items-center space-x-3 pb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={friendAvatarUrl} alt={friendName} data-ai-hint={friendAvatarHint} />
          <AvatarFallback>{friendAvatarFallback}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-md font-semibold text-primary">{friendName}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground flex items-center">
             <CalendarDays className="h-3 w-3 mr-1" /> {timestamp}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        {activityImageUrl && (
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-3 shadow-sm">
            <Image
              src={activityImageUrl}
              alt={activityImageAlt}
              layout="fill"
              objectFit="cover"
              data-ai-hint={activityImageHint}
            />
          </div>
        )}
        <div className="flex items-start space-x-3">
          <Bike className="h-6 w-6 text-accent mt-1 shrink-0" />
          <p className="text-foreground/90">{activityDetails}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="flex space-x-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <ThumbsUp className="h-4 w-4 mr-1.5" />
            Like ({likes})
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <MessageCircle className="h-4 w-4 mr-1.5" />
            Comment ({comments})
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
