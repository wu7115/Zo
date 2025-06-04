
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
// import { FixedHeader } from '@/app/components/FixedHeader'; // Removed
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
      <body className="font-body antialiased bg-muted">
        {/* <FixedHeader /> Removed */}
        <div className="mx-auto max-w-md min-h-screen flex flex-col bg-background shadow-xl pb-16"> {/* Removed pt-[20vh] */}
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

    
