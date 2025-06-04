
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, User, Bot, Loader2, AlertTriangle } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar'; // Assuming Avatar can take children for icons
import { cn } from '@/lib/utils';
import { askGemini, AskGeminiInput } from '@/ai/flows/ask-gemini-flow';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export function AiAgentFab() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const togglePanel = useCallback(() => {
    setIsPanelOpen(prevIsPanelOpen => {
      const newIsPanelOpen = !prevIsPanelOpen;
      if (!newIsPanelOpen) { // Panel is closing
        setInputPrompt('');
        setChatHistory([]);
        setError(null);
        setIsLoading(false);
      }
      return newIsPanelOpen;
    });
  }, []);

  useEffect(() => {
    const eventListener = () => {
      togglePanel();
    };
    window.addEventListener('toggleAiChatPanel', eventListener);
    return () => {
      window.removeEventListener('toggleAiChatPanel', eventListener);
    };
  }, [togglePanel]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmitPrompt = async () => {
    if (!inputPrompt.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      sender: 'user',
      text: inputPrompt,
    };
    setChatHistory((prev) => [...prev, newUserMessage]);
    const currentPrompt = inputPrompt;
    setInputPrompt('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await askGemini({ prompt: currentPrompt } as AskGeminiInput);
      const newAiMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        sender: 'ai',
        text: aiResponse.response,
      };
      setChatHistory((prev) => [...prev, newAiMessage]);
    } catch (e) {
      console.error('Error calling AI:', e);
      setError('Sorry, I encountered an error. Please try again.');
      const errorAiMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        sender: 'ai',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setChatHistory((prev) => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* The FAB button is removed, panel is controlled by event */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out"
          onClick={togglePanel} // Allow closing by clicking overlay
        />
      )}

      <Card
        className={cn(
          "fixed bottom-0 right-0 h-[70vh] w-full max-w-md bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isPanelOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
          <CardTitle className="text-lg font-semibold text-primary flex items-center">
            <Bot className="mr-2 h-6 w-6 text-accent" /> AI Assistant
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={togglePanel}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-grow flex flex-col overflow-hidden">
          <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-3",
                    message.sender === 'user' ? 'justify-end' : ''
                  )}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="h-8 w-8 bg-accent text-accent-foreground flex items-center justify-center">
                      <Bot className="h-5 w-5" />
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "p-3 rounded-lg max-w-[80%]",
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none',
                      message.id.includes('-error') ? 'bg-destructive text-destructive-foreground' : ''
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                  {message.sender === 'user' && (
                     <Avatar className="h-8 w-8 bg-blue-500 text-white flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>AI is thinking...</span>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-background sticky bottom-0">
            {error && (
                <div className="flex items-center space-x-2 text-sm text-destructive mb-2 p-2 bg-destructive/10 rounded-md">
                    <AlertTriangle className="h-4 w-4" />
                    <p>{error}</p>
                </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitPrompt();
              }}
              className="flex items-center space-x-2"
            >
              <Textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask anything..."
                className="flex-grow resize-none min-h-[40px] max-h-[120px]"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitPrompt();
                  }
                }}
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !inputPrompt.trim()}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
