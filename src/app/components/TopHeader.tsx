
'use client';

import Link from 'next/link';
import { PlusCircle, User } from 'lucide-react';
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

export function TopHeader() {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 z-40 h-16 w-full max-w-md bg-background/95 backdrop-blur-sm shadow-sm border-b border-border">
      <div className="flex h-full items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-primary flex items-baseline" style={{ fontFamily: 'serif' }}>
          Podium <span className="text-xs text-muted-foreground ml-1 font-sans">(this is not the right style)</span>
        </Link>
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary hover:text-accent">
                <PlusCircle className="h-7 w-7" />
                <span className="sr-only">Log Activity or Quick Updates</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Quick Updates</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/track#diary-sleep-&-rest">Rate your sleep</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/track#diary-stress-&-relaxation">Rate your mood</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/track#diary-medication-&-supplement-use">Log supplements</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/track">Log other</Link>
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
