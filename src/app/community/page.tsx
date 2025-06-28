import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Users, Search, UserPlus, ThumbsUp, MessageCircle, Trophy, Settings, ShieldQuestion } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const placeholderUsers = [
  { id: '1', name: 'Sarah Day', avatar: 'https://placehold.co/40x40.png?text=SD', fallback: 'SD', mutual: 3, hint: 'profile woman' },
  { id: '2', name: 'Mike R.', avatar: 'https://placehold.co/40x40.png?text=MR', fallback: 'MR', mutual: 1, hint: 'profile man' },
  { id: '3', name: 'EcoWarriors Group', avatar: 'https://placehold.co/40x40.png?text=EG', fallback: 'EG', type: 'group', members: 120, hint: 'group logo nature' },
];

const placeholderChallenges = [
  { id: 'c1', name: '30-Day Fitness Streak', description: 'Complete a workout every day for 30 days.', participants: 78, icon: Trophy },
  { id: 'c2', name: 'Mindful Morning Challenge', description: 'Start your day with 10 mins of meditation.', participants: 55, icon: Trophy },
];

const placeholderActivity = {
  user: { name: "Jane Runner", avatarUrl: "https://placehold.co/40x40.png?text=JR", fallback: "JR", hint: "profile runner", timestamp: "3 hours ago" },
  timestamp: "3 hours ago",
  text: "Completed the 'Urban Explorer' 5K challenge! So much fun discovering new parts of the city. #ChallengeAccepted #RunningCommunity",
  likes: 23,
  comments: 5,
};

export default function CommunityPage() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-background overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl font-headline text-primary flex items-center">
                <Users className="h-7 w-7 mr-2 text-accent" />
                Community
              </CardTitle>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search people or groups..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="flex space-x-3">
              <Button className="flex-1">
                <UserPlus className="mr-2 h-4 w-4" /> Invite Friends
              </Button>
              <Button variant="outline" className="flex-1">
                <Users className="mr-2 h-4 w-4" /> Discover Groups
              </Button>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Activity Feed</h3>
              <Card className="bg-muted/30">
                <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={placeholderActivity.user.avatarUrl} alt={placeholderActivity.user.name} data-ai-hint={placeholderActivity.user.hint}/>
                    <AvatarFallback>{placeholderActivity.user.fallback}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-primary">{placeholderActivity.user.name}</p>
                    <p className="text-xs text-muted-foreground">{placeholderActivity.user.timestamp}</p>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-foreground/90">{placeholderActivity.text}</p>
                </CardContent>
                <CardFooter className="flex justify-start space-x-4 py-2 border-t">
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
                    <ThumbsUp className="h-3.5 w-3.5 mr-1" /> Like ({placeholderActivity.likes})
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
                    <MessageCircle className="h-3.5 w-3.5 mr-1" /> Comment ({placeholderActivity.comments})
                  </Button>
                </CardFooter>
              </Card>
              <Button variant="link" size="sm" className="mt-2 w-full">View More Activity</Button>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Discover People & Groups</h3>
              <div className="space-y-3">
                {placeholderUsers.map(user => (
                  <Card key={user.id} className="p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.hint}/>
                          <AvatarFallback>{user.fallback}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-primary">{user.name}</p>
                          {user.type === 'group' ? (
                            <p className="text-xs text-muted-foreground">{user.members} members</p>
                          ) : (
                            <p className="text-xs text-muted-foreground">{user.mutual} mutual connections</p>
                          )}
                        </div>
                      </div>
                      <Button variant={user.type === 'group' ? "outline" : "default"} size="sm">
                        {user.type === 'group' ? 'View' : 'Follow'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
               <Button variant="link" size="sm" className="mt-2 w-full">Show More Suggestions</Button>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Active Group Challenges</h3>
              <div className="space-y-3">
                {placeholderChallenges.map(challenge => (
                  <Card key={challenge.id} className="p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <challenge.icon className="h-8 w-8 text-accent" />
                        <div>
                          <p className="text-sm font-semibold text-primary">{challenge.name}</p>
                          <p className="text-xs text-muted-foreground">{challenge.participants} participants</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    <CardDescription className="text-xs mt-2 ml-11">{challenge.description}</CardDescription>
                  </Card>
                ))}
              </div>
              <Button variant="link" size="sm" className="mt-2 w-full">Explore More Challenges</Button>
            </div>
            
            <Separator />

            <div className="text-center p-2 bg-muted/30 rounded-md">
                <p className="text-xs text-muted-foreground flex items-center justify-center">
                    <ShieldQuestion className="h-4 w-4 mr-1.5 text-primary/70"/>
                    Manage your <Link href="/profile/settings" className="text-primary underline hover:text-accent mx-1">profile visibility</Link> and <Link href="/settings" className="text-primary underline hover:text-accent ml-1">notification settings</Link>.
                </p>
                 <p className="text-xs text-muted-foreground mt-1">
                    Full community features like posting, detailed search, and direct messaging are under development.
                 </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </main>
  );
}
