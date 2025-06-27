import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, MessageCircle, Bike, CalendarDays, MoreHorizontal } from "lucide-react";

const friendActivity = {
  friend: {
    name: "Jane Runner", // Changed from Alex Doe
    avatarUrl: "https://placehold.co/40x40.png?text=JR", // Updated for new name
    avatarFallback: "JR", // Updated for new name
    avatarHint: "profile runner" // Updated hint
  },
  timestamp: "Yesterday, 6:30 PM",
  activityDetails: "Just crushed a 20km bike ride! Feeling fantastic. 🚴‍♀️ #CyclingLife",
  activityIcon: Bike,
  activityImageUrl: "https://placehold.co/600x400.png",
  activityImageAlt: "Friend's cycling activity post",
  activityImageHint: "cycling landscape",
  likes: 15,
  comments: 3,
};

export function FriendActivityCard() {
  const ActivityIcon = friendActivity.activityIcon || Bike;

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
          <AvatarImage src={friendActivity.friend.avatarUrl} alt={friendActivity.friend.name} data-ai-hint={friendActivity.friend.avatarHint} />
          <AvatarFallback>{friendActivity.friend.avatarFallback}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-md font-semibold text-primary">{friendActivity.friend.name}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground flex items-center">
             <CalendarDays className="h-3 w-3 mr-1" /> {friendActivity.timestamp}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        {friendActivity.activityImageUrl && (
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-3 shadow-sm">
            <Image
              src={friendActivity.activityImageUrl}
              alt={friendActivity.activityImageAlt}
              layout="fill"
              objectFit="cover"
              data-ai-hint={friendActivity.activityImageHint}
            />
          </div>
        )}
        <div className="flex items-start space-x-3">
          <ActivityIcon className="h-6 w-6 text-accent mt-1 shrink-0" />
          <p className="text-foreground/90">{friendActivity.activityDetails}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="flex space-x-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <ThumbsUp className="h-4 w-4 mr-1.5" />
            Like ({friendActivity.likes})
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <MessageCircle className="h-4 w-4 mr-1.5" />
            Comment ({friendActivity.comments})
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
