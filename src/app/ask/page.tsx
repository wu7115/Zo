"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, User, Bot, Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { askAI, AskAIInput } from "@/ai/flows/ask-gemini-flow";
import Link from "next/link";
import { trackingQuestions } from "@/data/trackingQuestions";
import { getAnytimeTaskAllocation } from "@/utils/taskAllocation";
import ReactMarkdown from 'react-markdown';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { loadDailyTrackingAnswers } from '@/lib/trackingService';
import { app } from '@/lib/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

// Utility to load onboarding data from Firestore (copied from onboarding/page.tsx)
async function loadOnboardingDataFromFirestore(uid: string) {
  const db = getFirestore(app);
  const docRef = doc(db, 'users', uid, 'onboarding', 'answers');
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() || {};
    }
  } catch (error) {
    // fallback: try alternative path
    try {
      const altDocRef = doc(db, 'users', uid, 'answers');
      const altDocSnap = await getDoc(altDocRef);
      if (altDocSnap.exists()) {
        return altDocSnap.data() || {};
      }
    } catch {}
  }
  return {};
}

export default function AskAiPage() {
  const [inputPrompt, setInputPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [onboardingAnswers, setOnboardingAnswers] = useState<any>({});
  const [part2Answers, setPart2Answers] = useState<any>({});
  const [trackingAnswers, setTrackingAnswers] = useState<any>({});
  const [anytimeAllocation, setAnytimeAllocation] = useState<Record<string, string>>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Listen for auth state changes
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Load all user data from Firestore after auth
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoadingUserData(false);
        return;
      }
      setLoadingUserData(true);
      try {
        // Onboarding/part1/part2
        const onboardingData = await loadOnboardingDataFromFirestore(user.uid);
        setOnboardingAnswers(onboardingData.part1Answers || {});
        setPart2Answers(onboardingData.part2Answers || {});
        // Tracking answers (today)
        const tracking = await loadDailyTrackingAnswers();
        setTrackingAnswers(tracking || {});
        // Anytime allocation
        const allocation = await getAnytimeTaskAllocation();
        setAnytimeAllocation(allocation || {});
      } catch (e) {
        setOnboardingAnswers({});
        setPart2Answers({});
        setTrackingAnswers({});
        setAnytimeAllocation({});
      } finally {
        setLoadingUserData(false);
      }
    };
    fetchUserData();
  }, [user]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector(
        "div[data-radix-scroll-area-viewport]"
      );
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Helper to build a summary of tracking tasks (now async)
  const buildTrackingSummary = async () => {
    // Use loaded trackingAnswers and anytimeAllocation
    const tasksByTime: Record<string, { id: string; text: string; answered: boolean; answer?: any }[]> = {
      morning: [],
      afternoon: [],
      evening: [],
    };
    Object.entries(trackingQuestions).forEach(([category, questions]) => {
      (questions as any[]).forEach((q) => {
        let time: 'morning' | 'afternoon' | 'evening' | null = null;
        if (q.timeOfDay === 'Morning') time = 'morning';
        else if (q.timeOfDay === 'Afternoon') time = 'afternoon';
        else if (q.timeOfDay === 'Evening') time = 'evening';
        else if (q.timeOfDay === 'Anytime' && anytimeAllocation[q.id]) {
          const alloc = anytimeAllocation[q.id];
          if (alloc === 'Morning') time = 'morning';
          else if (alloc === 'Afternoon') time = 'afternoon';
          else if (alloc === 'Evening') time = 'evening';
        }
        if (time) {
          const taskId = `${category.toLowerCase().replace(/[^a-z0-9]+/g, '-') }__${q.id}`;
          tasksByTime[time].push({
            id: taskId,
            text: q.text,
            answered: trackingAnswers[taskId] !== undefined && trackingAnswers[taskId] !== '',
            answer: trackingAnswers[taskId],
          });
        }
      });
    });
    // Build summary strings
    const summary: string[] = [];
    (['morning', 'afternoon', 'evening'] as const).forEach((period) => {
      const tasks = tasksByTime[period];
      if (tasks.length) {
        summary.push(`\n${period.charAt(0).toUpperCase() + period.slice(1)} Tasks:`);
        tasks.forEach((t) => {
          if (t.answered) {
            summary.push(`- [Done] ${t.text} (Answer: ${JSON.stringify(t.answer)})`);
          } else {
            summary.push(`- [Missed] ${t.text}`);
          }
        });
      }
    });
    return summary.join('\n');
  };

  const handleSubmitPrompt = async () => {
    if (!inputPrompt.trim()) return;
    const newUserMessage: ChatMessage = {
      id: Date.now().toString() + "-user",
      sender: "user",
      text: inputPrompt,
    };
    setChatHistory((prev) => [...prev, newUserMessage]);
    const currentPrompt = inputPrompt;
    setInputPrompt("");
    setIsLoading(true);
    setError(null);

    // Gather user data for context (from Firestore)
    const trackingSummary = await buildTrackingSummary();
    const contextString = `\nUser Profile Data:\n- Onboarding Answers: ${JSON.stringify(onboardingAnswers)}\n- Part 2 Answers: ${JSON.stringify(part2Answers)}\n- Tracking Answers: ${JSON.stringify(trackingAnswers)}\n- Tracking Task Summary: ${trackingSummary}\n`;

    try {
      const aiResponse = await askAI({ prompt: `${contextString}\nUser: ${currentPrompt}` } as AskAIInput);
      const newAiMessage: ChatMessage = {
        id: Date.now().toString() + "-ai",
        sender: "ai",
        text: aiResponse.response,
      };
      setChatHistory((prev) => [...prev, newAiMessage]);
    } catch (e: any) {
      console.error("Error calling AI:", e);
      let errorMessage = "Sorry, I encountered an error. Please try again.";
      let errorAiText = errorMessage;
      if (e && e.message) {
        const errorString = String(e.message).toLowerCase();
        if (
          errorString.includes("503") ||
          errorString.includes("overloaded") ||
          errorString.includes("service unavailable")
        ) {
          errorMessage = "The AI model is currently busy. Please try again in a few moments.";
          errorAiText = "I'm currently experiencing high demand. Could you try asking again in a few moments?";
        }
      }
      setError(errorMessage);
      const errorAiMessage: ChatMessage = {
        id: Date.now().toString() + "-error",
        sender: "ai",
        text: errorAiText,
      };
      setChatHistory((prev) => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingUserData) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8 bg-background min-h-screen">
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center h-[80vh]">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-lg text-muted-foreground">Loading your data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8 bg-background min-h-screen">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-xl flex flex-col h-[80vh]">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5 text-primary" />
                </Link>
              </Button>
              <CardTitle className="text-2xl font-headline text-primary flex items-center ml-2">
                <Bot className="h-7 w-7 mr-2 text-accent" /> Ask AI
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-grow flex flex-col overflow-hidden">
            <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {chatHistory.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-start space-x-3",
                      message.sender === "user" ? "justify-end" : ""
                    )}
                  >
                    {message.sender === "ai" && (
                      <Avatar className="h-8 w-8 bg-accent text-accent-foreground flex items-center justify-center">
                        <Bot className="h-5 w-5" />
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "p-3 rounded-lg max-w-[80%]",
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none",
                        message.id.includes("-error") && message.sender === "ai"
                          ? "bg-destructive/20 text-destructive-foreground border border-destructive/50"
                          : ""
                      )}
                    >
                      {message.sender === 'ai' ? (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>{message.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      )}
                    </div>
                    {message.sender === "user" && (
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
                    if (e.key === "Enter" && !e.shiftKey) {
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
      </div>
    </main>
  );
}
