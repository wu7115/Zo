
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { TopHeader } from '@/app/components/TopHeader';
import { BottomNavigationBar } from '@/app/components/BottomNavigationBar';
import { AiAgentFab } from '@/app/components/AiAgentFab';
import { ContextualHelpFab } from '@/app/components/ContextualHelpFab';

export const metadata: Metadata = {
  title: 'Podium',
  description: 'Your personal wellness companion',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background"> {/* Page Border color via --background */}
        <TopHeader />
        {/* This div is the main app content area */}
        <div className="mx-auto max-w-md min-h-screen flex flex-col bg-app-content shadow-xl pt-16 pb-16"> {/* Main content area color via --app-content-background */}
          {children}
        </div>
        <BottomNavigationBar />
        <AiAgentFab /> {/* For the main Gemini chat */}
        <ContextualHelpFab /> {/* For contextual recommendations */}
        <Toaster />
      </body>
    </html>
  );
}
