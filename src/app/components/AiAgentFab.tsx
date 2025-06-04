
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PencilLine, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AiAgentFab() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => setIsPanelOpen(!isPanelOpen);

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className={cn(
          "fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-xl z-50 bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 ease-in-out",
          isPanelOpen && "opacity-0 scale-0"
        )}
        onClick={togglePanel}
        aria-label="Open AI Assistant"
      >
        <PencilLine className="h-7 w-7" />
      </Button>

      {isPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out"
          onClick={togglePanel} 
        />
      )}

      <Card
        className={cn(
          "fixed bottom-0 right-0 h-[70vh] w-full max-w-md bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isPanelOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <CardTitle className="text-lg font-semibold text-primary">AI Assistant</CardTitle>
          <Button variant="ghost" size="icon" onClick={togglePanel}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 flex-grow overflow-y-auto">
          <p className="text-muted-foreground">
            AI assistant panel. Feature under development.
          </p>
          {/* Placeholder for AI chat interface */}
          <div className="flex flex-col items-center justify-center h-full">
            <PencilLine className="h-16 w-16 text-primary/30" />
            <p className="text-sm font-medium text-primary mt-2">AI Interaction Coming Soon!</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

    