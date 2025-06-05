
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, ShoppingCart, Menu as MenuIcon, BookOpenText, HeartPulse, Activity, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import * as React from 'react'; // Added React import

// Custom Labubu-inspired SVG Icon
const LabubuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="14" r="3.5" />
    <path d="M9.5 11.5C9 8 7 6.5 8.5 4.5S12 6 12 6" />
    <path d="M14.5 11.5C15 8 17 6.5 15.5 4.5S12 6 12 6" />
    <circle cx="10.5" cy="14" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="13.5" cy="14" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: React.ElementType;
  action?: () => void;
  isMoreMenu?: boolean;
}

const navItems: NavItem[] = [
  { id: 'home', href: '/', label: 'Home', icon: Home },
  { id: 'marketplace', href: '/buy', label: 'Market', icon: ShoppingCart },
  { id: 'track', href: '/track', label: 'Track', icon: ClipboardList },
  {
    id: 'ask',
    href: '#',
    label: 'Ask AI',
    icon: LabubuIcon,
    action: () => window.dispatchEvent(new CustomEvent('toggleAiChatPanel'))
  },
  { id: 'more', href: '#', label: 'More', icon: MenuIcon, isMoreMenu: true },
];

const moreMenuItems = [
  { id: 'learn', href: '/learn', label: 'Learn', icon: BookOpenText },
  { id: 'diagnose', href: '/diagnose', label: 'Diagnose', icon: HeartPulse },
  { id: 'gut-health', href: '/diagnose', label: 'Gut Health Score', icon: Activity }, // Placeholder link
  { id: 'profile', href: '/profile', label: 'Profile', icon: UserIcon },
];


export function BottomNavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 h-16 w-full max-w-md bg-background/80 backdrop-blur-sm shadow-t-md border-t border-border">
      <div className="flex h-full items-center justify-around">
        {navItems.map((item) => {
          const isActive = !item.isMoreMenu && item.id !== 'ask' && pathname === item.href;

          if (item.isMoreMenu) {
            return (
              <DropdownMenu key={item.id}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex flex-col items-center justify-center w-1/5 h-full p-2 text-muted-foreground hover:text-primary transition-colors duration-150 focus-visible:ring-0 focus-visible:ring-offset-0",
                    )}
                  >
                    <item.icon className="h-6 w-6 mb-0.5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="center" className="w-56 mb-2">
                  {moreMenuItems.map((menuItem, index) => (
                    <React.Fragment key={menuItem.id}>
                      <DropdownMenuItem asChild>
                        <Link href={menuItem.href} className="flex items-center w-full">
                          <menuItem.icon className="h-4 w-4 mr-2" />
                          {menuItem.label}
                        </Link>
                      </DropdownMenuItem>
                      {index < moreMenuItems.length -1 && menuItem.id === 'diagnose' && <DropdownMenuSeparator />}
                    </React.Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }
          
          if (item.action) {
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.action) item.action();
                }}
                className={cn(
                  "flex flex-col items-center justify-center w-1/5 h-full p-2 text-muted-foreground hover:text-primary transition-colors duration-150 cursor-pointer",
                )}
              >
                <item.icon className={cn("h-6 w-6 mb-0.5", isActive ? "text-primary" : "")} />
                <span className={cn("text-xs font-medium", isActive ? "text-primary" : "")}>{item.label}</span>
              </a>
            );
          }

          return (
            <Link key={item.id} href={item.href} legacyBehavior>
              <a
                className={cn(
                  "flex flex-col items-center justify-center w-1/5 h-full p-2 text-muted-foreground hover:text-primary transition-colors duration-150",
                  isActive && "text-primary"
                )}
              >
                <item.icon className={cn("h-6 w-6 mb-0.5", isActive ? "text-primary" : "")} />
                <span className={cn("text-xs font-medium", isActive ? "text-primary" : "")}>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
      <style jsx global>{`
        .shadow-t-md {
          box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </nav>
  );
}

