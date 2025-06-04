
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList } from 'lucide-react'; // Removed Bot
import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

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
    {/* Head-like circle */}
    <circle cx="12" cy="14" r="3.5" />
    {/* Left Ear */}
    <path d="M9.5 11.5C9 8 7 6.5 8.5 4.5S12 6 12 6" />
    {/* Right Ear */}
    <path d="M14.5 11.5C15 8 17 6.5 15.5 4.5S12 6 12 6" />
    {/* Eyes - simple dots */}
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
}

const navItems: NavItem[] = [
  { id: 'track', href: '/track', label: 'Track', icon: ClipboardList },
  { id: 'home', href: '/', label: 'Home', icon: Home },
  {
    id: 'ask',
    href: '#',
    label: 'Ask AI',
    icon: LabubuIcon, // Using the new Labubu-inspired icon
    action: () => window.dispatchEvent(new CustomEvent('toggleAiChatPanel'))
  },
];

export function BottomNavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 h-16 w-full max-w-md bg-background/80 backdrop-blur-sm shadow-t-md border-t border-border">
      <div className="flex h-full items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.id !== 'ask' && pathname === item.href;

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
                  "flex flex-col items-center justify-center w-1/3 h-full p-2 text-muted-foreground hover:text-primary transition-colors duration-150 cursor-pointer",
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
                  "flex flex-col items-center justify-center w-1/3 h-full p-2 text-muted-foreground hover:text-primary transition-colors duration-150",
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
