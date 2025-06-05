
'use client';

import Link from 'next/link';
import { PlusCircle, User, Star as StarIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function TopHeader() {
  const [sleepRating, setSleepRating] = useState<number | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const router = useRouter();

  const handleSleepRate = (rating: number) => {
    setSleepRating(rating);
    // In a real app, you would call a function here to log the rating
    console.log(`Sleep rated: ${rating} stars`);
  };

  const handleMoodSelect = (selectedMoodEmoji: string) => {
    setMood(selectedMoodEmoji);
    // In a real app, you would call a function here to log the mood
    console.log(`Mood selected: ${selectedMoodEmoji}`);
  };

  const moodOptions = [
    { emoji: '😊', label: 'Excellent' },
    { emoji: '🙂', label: 'Good' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😟', label: 'Low' },
    { emoji: '😩', label: 'Very Low' },
  ];

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 z-40 h-16 w-full max-w-md bg-background/95 backdrop-blur-sm shadow-sm border-b border-border">
      <div className="flex h-full items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-primary flex items-baseline" style={{ fontFamily: 'Inter' }}>
          Podium
        </Link>
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary hover:text-accent">
                <PlusCircle className="h-7 w-7" />
                <span className="sr-only">Log Activity or Quick Updates</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Quick Updates</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-transparent cursor-default">
                <div className="w-full">
                  <p className="text-sm mb-1.5 text-foreground">Rate your sleep</p>
                  <div className="flex justify-between items-center px-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button
                        key={`sleep-${rating}`}
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-7 w-7 p-0 rounded-full",
                          sleepRating === rating ? "text-yellow-500 bg-yellow-100" : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-50"
                        )}
                        onClick={() => handleSleepRate(rating)}
                        aria-label={`Rate ${rating} stars`}
                      >
                        <StarIcon className={cn("h-5 w-5", sleepRating !== null && rating <= sleepRating ? "fill-yellow-400 text-yellow-500" : "fill-transparent" )}/>
                      </Button>
                    ))}
                  </div>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-transparent cursor-default mt-1">
                 <div className="w-full">
                    <p className="text-sm mb-1.5 text-foreground">Rate your mood</p>
                    <div className="flex justify-between items-center px-1">
                        {moodOptions.map((opt) => (
                            <Button
                                key={`mood-${opt.label}`}
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-8 w-8 p-0 text-xl rounded-full", 
                                    mood === opt.emoji ? "bg-accent/20 ring-2 ring-accent" : "hover:bg-accent/10"
                                )}
                                onClick={() => handleMoodSelect(opt.emoji)}
                                title={opt.label}
                                aria-label={opt.label}
                            >
                                {opt.emoji}
                            </Button>
                        ))}
                    </div>
                 </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => router.push('/track#diary-medication-&-supplement-use')} 
                className="w-full cursor-pointer"
              >
                Log supplements
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => router.push('/track#diary')} 
                className="w-full cursor-pointer"
              >
                Log other (Diary)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/profile" passHref>
            <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary hover:border-accent transition-colors">
              <AvatarFallback className="bg-muted text-muted-foreground">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
