
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, ShoppingCart, Menu as MenuIcon, BookOpenText, HeartPulse, Activity, User as UserIcon, Map } from 'lucide-react';
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
import * as React from 'react';

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
  action?: (hasTips: boolean) => void;
  isMoreMenu?: boolean;
}


export function BottomNavigationBar() {
  const pathname = usePathname();
  const [showTipsBadge, setShowTipsBadge] = React.useState(false);
  const [hasMounted, setHasMounted] = React.useState(false);
  
  const [askAiIsDisabled, setAskAiIsDisabled] = React.useState(true);
  const [askAiDynamicClasses, setAskAiDynamicClasses] = React.useState("cursor-default opacity-75 pointer-events-none");


  React.useEffect(() => {
    setHasMounted(true);
    setAskAiIsDisabled(false);
    setAskAiDynamicClasses("hover:text-primary cursor-pointer");

    // Initial request for status after mount
    const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('requestUnreadTipsStatus'));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleStatusUpdate = React.useCallback((event: Event) => {
    if (!hasMounted) return; 

    const customEvent = event as CustomEvent<{ hasUnread: boolean }>;
    if (typeof customEvent.detail?.hasUnread === 'boolean') {
      setShowTipsBadge(customEvent.detail.hasUnread);
    }
  }, [hasMounted]); 

  React.useEffect(() => {
    if (!hasMounted) return; 

    window.addEventListener('unreadTipsStatusChanged', handleStatusUpdate);
    
    return () => {
      window.removeEventListener('unreadTipsStatusChanged', handleStatusUpdate);
    };
  }, [hasMounted, handleStatusUpdate]); 

  React.useEffect(() => {
    if (!hasMounted) return; 
    
    const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('requestUnreadTipsStatus'));
    }, 100); 
    return () => clearTimeout(timer);
  }, [pathname, hasMounted]);


  const navItems: NavItem[] = [
    { id: 'home', href: '/', label: 'Home', icon: Home },
    { id: 'marketplace', href: '/buy', label: 'Market', icon: ShoppingCart },
    { id: 'track', href: '/track', label: 'Track', icon: ClipboardList },
    {
      id: 'ask',
      href: '#', 
      label: 'Ask AI',
      icon: LabubuIcon,
      action: (hasTipsFromClick) => { 
        if (hasTipsFromClick) {
          window.dispatchEvent(new CustomEvent('toggleAiTipsPanel'));
        } else {
          window.dispatchEvent(new CustomEvent('toggleAiChatPanel'));
        }
      }
    },
    { id: 'more', href: '#', label: 'More', icon: MenuIcon, isMoreMenu: true },
  ];
  
  const moreMenuItems = [
    { id: 'learn', href: '/learn', label: 'Learn', icon: BookOpenText },
    { id: 'diagnose', href: '/diagnose', label: 'Diagnose', icon: HeartPulse },
    { id: 'journey', href: '/journey', label: 'Journey', icon: Map },
    { id: 'gut-health', href: '/gut-health-score', label: 'Gut Health Score', icon: Activity }, 
    { id: 'profile', href: '/profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 h-16 w-full max-w-md bg-background/80 backdrop-blur-sm shadow-t-md border-t border-border">
      <div className="flex h-full items-center justify-around">
        {navItems.map((item) => {
          const isActive = !item.isMoreMenu && item.id !== 'ask' && pathname === item.href;
          
          if (item.id === 'ask') {
            return (
              <a
                key={item.id}
                href={item.href} 
                onClick={(e) => {
                  e.preventDefault();
                  if (hasMounted && typeof item.action === 'function') {
                    item.action(showTipsBadge);
                  }
                }}
                className={cn(
                  "flex flex-col items-center justify-center w-1/5 h-full p-2 text-muted-foreground transition-colors duration-150",
                  askAiDynamicClasses
                )}
              >
                <div className="relative"> {/* Container for icon and badge */}
                  <item.icon className={cn("h-6 w-6 mb-0.5")} />
                  {/* Badge is always rendered, visibility controlled by opacity */}
                  <span
                    className={cn(
                      "absolute top-0 right-0 block h-2.5 w-2.5 transform translate-x-1/4 -translate-y-1/4 rounded-full bg-red-600 ring-1 ring-background transition-opacity duration-200",
                      (hasMounted && showTipsBadge) ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                  />
                </div>
                <span className={cn("text-xs font-medium")}>{item.label}</span>
              </a>
            );
          }
          
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
                      {/* Logic for separators between specific items */}
                      {(menuItem.id === 'diagnose' || menuItem.id === 'journey' || menuItem.id === 'gut-health') && 
                       index < moreMenuItems.length - 1 && 
                       (moreMenuItems[index+1].id !== 'profile') && 
                       !((menuItem.id === 'diagnose' && moreMenuItems[index+1].id === 'journey') || 
                         (menuItem.id === 'journey' && moreMenuItems[index+1].id === 'gut-health')) 
                         && <DropdownMenuSeparator />}
                    </React.Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          // Default link items
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

