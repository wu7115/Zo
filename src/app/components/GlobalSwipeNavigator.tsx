
'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useRef, useCallback, TouchEvent as ReactTouchEvent } from 'react';

interface GlobalSwipeNavigatorProps {
  children: React.ReactNode;
}

const SWIPE_THRESHOLD = 50; // Minimum pixels for a horizontal swipe
const MAX_VERTICAL_OFFSET = 70; // Max vertical movement for a horizontal swipe
const MAX_SWIPE_DURATION = 500; // Max duration for a swipe gesture in ms

export function GlobalSwipeNavigator({ children }: GlobalSwipeNavigatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const touchStartCoords = useRef<{ x: number; y: number; time: number } | null>(null);

  const isSwipeDisabledOnPage = useCallback(() => {
    // Add any pages here that have their own complex horizontal scrolling or gestures
    return pathname === '/buy' || 
           pathname === '/learn' || 
           pathname === '/community' || 
           pathname.startsWith('/profile/integrations');
  }, [pathname]);

  const handleTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (isSwipeDisabledOnPage()) {
      return;
    }

    let target = e.target as HTMLElement;
    let swipeShouldBeDisabledForTarget = false;

    // Check if the touch target or its parents are common interactive elements or explicitly scrollable horizontally
    while (target && target !== e.currentTarget as HTMLElement) {
      const style = window.getComputedStyle(target);
      if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
        if (target.scrollWidth > target.clientWidth) {
          swipeShouldBeDisabledForTarget = true;
          break;
        }
      }
      if (['INPUT', 'TEXTAREA', 'BUTTON', 'A', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        swipeShouldBeDisabledForTarget = true;
        break;
      }
      if (target.getAttribute('role') === 'slider' || target.classList.contains('recharts-surface') || target.closest('.recharts-wrapper')) {
          swipeShouldBeDisabledForTarget = true;
          break;
      }
      target = target.parentElement as HTMLElement;
    }

    if (swipeShouldBeDisabledForTarget) {
      touchStartCoords.current = null;
      return;
    }
    
    touchStartCoords.current = { 
      x: e.targetTouches[0].clientX, 
      y: e.targetTouches[0].clientY,
      time: Date.now() 
    };
  }, [isSwipeDisabledOnPage, pathname]);

  const handleTouchMove = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (!touchStartCoords.current || isSwipeDisabledOnPage()) return;
    // Intentionally left blank for this version.
    // Could add e.preventDefault() if horizontal dominance is clear,
    // but requires careful handling with passive: false.
  }, [isSwipeDisabledOnPage]);

  const handleTouchEnd = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (!touchStartCoords.current || e.changedTouches.length === 0 || isSwipeDisabledOnPage()) {
      touchStartCoords.current = null; // Ensure reset
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndTime = Date.now();

    const deltaX = touchEndX - touchStartCoords.current.x;
    const deltaY = touchEndY - touchStartCoords.current.y;
    const deltaTime = touchEndTime - touchStartCoords.current.time;
    
    // Store current start coords before resetting, in case of re-entry or quick checks
    const currentStart = touchStartCoords.current;
    touchStartCoords.current = null; // Reset for next touch

    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&  // More horizontal than vertical
      Math.abs(deltaY) < MAX_VERTICAL_OFFSET &&
      Math.abs(deltaX) > SWIPE_THRESHOLD &&
      deltaTime < MAX_SWIPE_DURATION 
    ) {
      if (deltaX > 0) { // Swipe Right (finger moved L to R)
        if (pathname !== '/track') {
          router.push('/track');
        }
      } else { // Swipe Left (finger moved R to L)
        if (pathname !== '/journey') {
          router.push('/journey');
        }
      }
    }
  }, [router, pathname, isSwipeDisabledOnPage]);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="flex-1 flex flex-col w-full h-full" // Ensures it takes up space
      style={{ touchAction: 'pan-y' }} // Hint to browser for vertical panning
    >
      {children}
    </div>
  );
}
