
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    href: '#', // Using '#' for non-navigation action
    label: 'Ask AI', 
    icon: Bot, 
    action: () => window.dispatchEvent(new CustomEvent('toggleAiChatPanel')) 
  },
];

export function BottomNavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 h-16 w-full max-w-md bg-background/80 backdrop-blur-sm shadow-t-md border-t border-border">
      <div className="flex h-full items-center justify-around">
        {navItems.map((item) => {
          // For "Ask AI", isActive will depend on panel state, which is not available here directly.
          // So, it won't show active state based on pathname.
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
                  // isActive && "text-primary" // Active state for 'ask' would need global state
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
