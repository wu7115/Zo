
'use client'; // Required for usePathname

import type {Metadata} from 'next'; // Keep if you have static metadata elsewhere
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { TopHeader } from '@/app/components/TopHeader';
import { BottomNavigationBar } from '@/app/components/BottomNavigationBar';
import { AiAgentFab } from '@/app/components/AiAgentFab';
import { ContextualHelpFab } from '@/app/components/ContextualHelpFab';
import { GlobalSwipeNavigator } from '@/app/components/GlobalSwipeNavigator';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Static metadata can be defined here if needed, but it won't be dynamic per route this way.
// export const metadata: Metadata = {
//   title: 'Podium',
//   description: 'Your personal wellness companion',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showMainLayout = !pathname.startsWith('/launch') && !pathname.startsWith('/onboarding') && !pathname.startsWith('/diagnose/plan');

  return (
    <html lang="en">
      <head>
        {/* Title can be managed per-page using Next.js Metadata API in page.tsx/layout.tsx files */}
        <title>Podium</title>
        <meta name="description" content="Your personal wellness companion" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        {showMainLayout && <TopHeader />}
        <div
          id="main-app-content"
          className={cn(
            "mx-auto max-w-[408px] min-h-screen flex flex-col",
            showMainLayout ? "bg-background shadow-xl pt-16 pb-16 overflow-y-auto" : "bg-transparent" 
          )}
        >
          {showMainLayout ? <GlobalSwipeNavigator>{children}</GlobalSwipeNavigator> : children}
        </div>
        {showMainLayout && <BottomNavigationBar />}
        {showMainLayout && <AiAgentFab />}
        {showMainLayout && <ContextualHelpFab />}
        <Toaster />
      </body>
    </html>
  );
}
