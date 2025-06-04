
'use client';

import Link from 'next/link';
import { PlusCircle, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function TopHeader() {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 z-40 h-16 w-full max-w-md bg-background/95 backdrop-blur-sm shadow-sm border-b border-border">
      <div className="flex h-full items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-primary" style={{ fontFamily: 'serif' }}>
          Podium
        </Link>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" asChild className="text-primary hover:text-accent">
            <Link href="/log-activity">
              <PlusCircle className="h-7 w-7" />
              <span className="sr-only">Log Activity</span>
            </Link>
          </Button>
          <Link href="/profile" passHref>
            <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary hover:border-accent transition-colors">
              <AvatarFallback className="bg-muted text-primary">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
