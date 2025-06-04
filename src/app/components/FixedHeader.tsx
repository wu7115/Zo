
'use client';

import Link from 'next/link';
import {
  HeartPulse,
  Map,
  ClipboardList,
  ShoppingCart,
  BookOpen,
  Users,
} from 'lucide-react';

const menuItems = [
  { href: '/diagnose', label: 'Diagnose', icon: HeartPulse },
  { href: '/journey', label: 'Journey', icon: Map },
  { href: '/track', label: 'Track', icon: ClipboardList },
  { href: '/buy', label: 'Buy', icon: ShoppingCart },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/community', label: 'Community', icon: Users },
];

export function FixedHeader() {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 h-[20vh] w-full max-w-md bg-background/80 backdrop-blur-sm shadow-md">
      <div className="flex overflow-x-auto space-x-3 p-3 items-center h-full no-scrollbar">
        {menuItems.map((item) => (
          <Link key={item.label} href={item.href} legacyBehavior>
            <a className="flex flex-none flex-col items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground hover:bg-primary/80 transition-colors duration-150 cursor-pointer p-1 text-center shadow-lg transform hover:scale-105">
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium leading-tight">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </header>
  );
}
