
'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useRef, useEffect, useCallback, TouchEvent as ReactTouchEvent } from 'react';

interface GlobalSwipeNavigatorProps {
  children: React.ReactNode;
}

const SWIPE_THRESHOLD = 70; // Minimum pixels for a horizontal swipe to trigger navigation
const MAX_VERTICAL_OFFSET = 60; // Maximum vertical movement allowed for a horizontal swipe to be considered valid for navigation

export function GlobalSwipeNavigator({ children }: GlobalSwipeNavigatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const touchStartCoords = useRef<{ x: number; y: number } | null>(null);
  const touchEndCoords = useRef<{ x: number; y: number } | null>(null);

  // Disable global swipe on pages with their own horizontal scrolling or specific interactions
  const isSwipeDisabledOnPage = useCallback(() => {
    return pathname === '/buy' || pathname === '/learn' || pathname === '/community' || pathname.startsWith('/profile/integrations');
  }, [pathname]);

  const handleTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (isSwipeDisabledOnPage()) return;

    // Check if the touch starts on an element that should handle its own scrolling
    let target = e.target as HTMLElement;
    while (target && target !== e.currentTarget as HTMLElement) {
      const style = window.getComputedStyle(target);
      if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
        if (target.scrollWidth > target.clientWidth) {
          // Element is horizontally scrollable, let it handle the swipe
          touchStartCoords.current = null; // Mark that global swipe should not proceed
          return;
        }
      }
       // Also disable for common interactive elements to avoid conflicts
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable || target.tagName === 'BUTTON' || target.tagName === 'A') {
         touchStartCoords.current = null;
         return;
      }
      target = target.parentElement as HTMLElement;
    }

    touchStartCoords.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
    touchEndCoords.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
  }, [isSwipeDisabledOnPage]);

  const handleTouchMove = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (!touchStartCoords.current || isSwipeDisabledOnPage()) return;
    touchEndCoords.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };

    // Basic prevention attempt for vertical scroll during horizontal swipe detection
    // This is often tricky to get perfect without more complex logic or libraries
    const deltaX = Math.abs(e.targetTouches[0].clientX - touchStartCoords.current.x);
    const deltaY = Math.abs(e.targetTouches[0].clientY - touchStartCoords.current.y);
    if (deltaX > deltaY + 10 && deltaX > 20) { // If horizontal movement is dominant and significant
        // e.preventDefault(); // Potentially add if needed, requires non-passive listener
    }

  }, [isSwipeDisabledOnPage]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartCoords.current || !touchEndCoords.current || isSwipeDisabledOnPage()) {
      touchStartCoords.current = null;
      return;
    }

    const deltaX = touchEndCoords.current.x - touchStartCoords.current.x;
    const deltaY = touchEndCoords.current.y - touchStartCoords.current.y;

    // Check if it's a predominantly horizontal swipe with limited vertical movement
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaY) < MAX_VERTICAL_OFFSET) {
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX > 0) { // Swipe Right
          if (pathname !== '/track') router.push('/track');
        } else { // Swipe Left
          if (pathname !== '/journey') router.push('/journey');
        }
      }
    }
    touchStartCoords.current = null; // Reset for next touch
  }, [router, pathname, isSwipeDisabledOnPage]);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove} // Consider { passive: false } for onTouchMove if using e.preventDefault()
      onTouchEnd={handleTouchEnd}
      className="flex-1 flex flex-col" // Ensures the div takes up space to capture touches
    >
      {children}
    </div>
  );
}
