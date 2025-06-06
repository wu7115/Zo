
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, MessageCircle, Bike, CalendarDays } from "lucide-react";

const friendActivity = {
  friend: {
    name: "Alex Doe",
    avatarUrl: "https://placehold.co/40x40.png",
    avatarFallback: "AD",
    avatarHint: "profile person"
  },
  timestamp: "Yesterday, 6:30 PM",
  activityDetails: "Just crushed a 20km bike ride! Feeling fantastic. 🚴‍♀️ #CyclingLife",
  activityIcon: Bike,
  likes: 15,
  comments: 3,
};

export function FriendActivityCard() {
  const ActivityIcon = friendActivity.activityIcon || Bike;

  return (
    <Card className="shadow-lg">
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
      <CardContent className="pb-4">
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
        <Button variant="outline" size="sm">View Details</Button>
      </CardFooter>
    </Card>
  );
}
