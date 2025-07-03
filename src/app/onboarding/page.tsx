'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, ArrowLeft, CheckCircle, Loader2, Lightbulb, AlertTriangle } from 'lucide-react';
import { generateInitialInsight, type GenerateInitialInsightInput, type GenerateInitialInsightOutput } from '@/ai/flows/generate-initial-insight-flow';
import { questionnaireData } from '@/data/questionnaireData';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { generateSecondInsight } from '@/ai/flows/generate-second-insight-flow';
import { trackingQuestions } from '@/data/trackingQuestions';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

type TrackingQuestionForLLM = {
  id: string;
  type: string;
  text: string;
  timeOfDay: string;
  options?: string[];
  placeholder?: string;
  condition?: any;
};

// UI Sub-Components
const OnboardingStepContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("h-full flex flex-col items-center justify-center p-6 sm:p-8 text-center", className)}>
        {children}
    </div>
);

const PrimaryButton = ({ children, className, ...props }: React.ComponentProps<typeof Button>) => (
    <Button
        {...props}
        size="lg"
        className={cn(
            "w-full font-bold py-3 px-4 rounded-lg shadow-md text-lg h-auto",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring",
            "transition-all duration-200 transform hover:scale-105",
            props.disabled && "opacity-50 cursor-not-allowed hover:scale-100",
            className
        )}
    >
        {children}
    </Button>
);

const OptionButton = ({ text, isSelected, onClick, className }: { text: string, isSelected: boolean, onClick: () => void, className?: string }) => (
    <button type="button" onClick={onClick} className={cn(
        "w-full border-2 rounded-lg p-3 my-1.5 flex items-center justify-start text-left transition-all duration-200 transform hover:scale-[1.02]",
        isSelected ? "bg-primary/10 border-primary ring-2 ring-primary text-primary" : "bg-card border-input hover:border-ring/50",
        className
    )} aria-pressed={isSelected}>
        <span className={cn("flex-grow", isSelected ? "font-semibold" : "text-foreground")}>{text}</span>
        <div className={cn("w-5 h-5 rounded-full border-2 ml-3 flex-shrink-0 flex items-center justify-center", isSelected ? "bg-primary border-primary" : "border-muted-foreground")}>
            {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
        </div>
    </button>
);

const MultiSelectQuestionComponent = ({ question, answer = [], onAnswerChange }: { question: any, answer: string[], onAnswerChange: (value: string[]) => void }) => {
    const toggleOption = (option: string) => {
        const newAnswer = answer.includes(option) ? answer.filter(item => item !== option) : [...answer, option];
        onAnswerChange(newAnswer);
    };
    return (
        <div>
            <h3 className="question-title">{question.text}</h3>
            {question.options.map((option: string) => (
                <OptionButton key={option} text={option} isSelected={answer.includes(option)} onClick={() => toggleOption(option)} />
            ))}
        </div>
    );
};

const SingleSelectQuestionComponent = ({ question, answer, onAnswerChange }: { question: any, answer: string, onAnswerChange: (value: string) => void }) => (
    <div>
        <h3 className="question-title">{question.text}</h3>
        {question.options.map((option: string) => (
            <OptionButton key={option} text={option} isSelected={answer === option} onClick={() => onAnswerChange(option)} />
        ))}
    </div>
);

const TextInputQuestionComponent = ({ question, answer, onAnswerChange }: { question: any, answer: string, onAnswerChange: (value: string) => void }) => (
    <div>
        <h3 className="question-title">{question.text}</h3>
        <Input
            type="text"
            value={answer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder={question.placeholder}
            className="w-full p-3 bg-card border-2 border-input rounded-lg text-base h-auto focus:ring-ring focus:border-ring"
        />
    </div>
);

const NumberInputQuestionComponent = ({ question, answer, onAnswerChange }: { question: any, answer: string, onAnswerChange: (value: string) => void }) => (
    <div>
        <h3 className="question-title">{question.text}</h3>
        <Input
            type="number"
            value={answer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder={question.placeholder}
            className="w-full p-3 bg-card border-2 border-input rounded-lg text-base h-auto focus:ring-ring focus:border-ring"
        />
    </div>
);


// Onboarding Step Components
const SplashScreenComponent = ({ onComplete }: { onComplete: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => onComplete(), 1500);
        return () => clearTimeout(timer);
    }, [onComplete]);
    return <OnboardingStepContainer><h1 className="font-headline text-5xl text-primary animate-pulse">Podium</h1></OnboardingStepContainer>;
};

const SignUpPageComponent = ({ onComplete, onSwitchToLogin }: { onComplete: () => void, onSwitchToLogin: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const auth = getAuth(app);

    const handleSignUp = async () => {
        setLoading(true);
        setError(null);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            onComplete();
        } catch (err: any) {
            setError(err.message || 'Failed to sign up.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <OnboardingStepContainer>
            <h1 className="font-headline text-3xl text-center mb-2 text-primary">Create Account</h1>
            <p className="text-center text-muted-foreground mb-8">Sign up to start your journey.</p>
            <div className="w-full max-w-sm space-y-4">
                <Input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 bg-card border-2 border-input rounded-lg text-base h-auto"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 bg-card border-2 border-input rounded-lg text-base h-auto"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                />
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <div className="w-full max-w-sm mt-6">
                <PrimaryButton onClick={handleSignUp} disabled={loading || !email || !password}>
                    {loading ? 'Signing up...' : 'Create Account'}
                </PrimaryButton>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account? <a href="#" className="font-semibold text-primary hover:underline" onClick={e => { e.preventDefault(); onSwitchToLogin(); }}>Sign In</a>
            </p>
        </OnboardingStepContainer>
    );
};

const LoginPageComponent = ({ onComplete, onSwitchToSignUp }: { onComplete: () => void, onSwitchToSignUp: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const auth = getAuth(app);

    const handleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onComplete();
        } catch (err: any) {
            setError(err.message || 'Failed to sign in.');
        } finally {
            setLoading(false);
        }
    };

    return (
    <OnboardingStepContainer>
        <h1 className="font-headline text-3xl text-center mb-2 text-primary">Welcome Back</h1>
        <p className="text-center text-muted-foreground mb-8">Sign in to continue your journey.</p>
        <div className="w-full max-w-sm space-y-4">
                <Input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 bg-card border-2 border-input rounded-lg text-base h-auto"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 bg-card border-2 border-input rounded-lg text-base h-auto"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                />
        </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <div className="w-full max-w-sm mt-6">
                <PrimaryButton onClick={handleSignIn} disabled={loading || !email || !password}>
                    {loading ? 'Signing in...' : 'Continue'}
                </PrimaryButton>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
                Don't have an account? <a href="#" className="font-semibold text-primary hover:underline" onClick={e => { e.preventDefault(); onSwitchToSignUp(); }}>Sign Up</a>
        </p>
    </OnboardingStepContainer>
);
};

const IntroCarouselComponent = ({ onComplete }: { onComplete: () => void }) => {
    const [page, setPage] = useState(0);
    const intros = [
        { line1: "Great health starts in the gut", line2: "Understand, optimize and take control of your health" },
        { line1: "What's Inside Podium", line2: "Set Your Health Goals, Track Your Progress, AI Companion, Gut Health Score" },
        { line1: "A Science-Backed Health Journey Tailored to You", line2: "Patented diagnostics technologies, AI insights" },
    ];

    const handleNext = () => page < intros.length - 1 ? setPage(p => p + 1) : onComplete();
    return (
        <div className="h-full flex flex-col justify-between p-6 sm:p-8 text-center">
            <div className="flex-grow flex flex-col justify-center">
                <h2 className="font-headline text-3xl sm:text-4xl text-primary leading-tight">{intros[page].line1}</h2>
                <p className="mt-4 text-muted-foreground text-base sm:text-lg">{intros[page].line2}</p>
            </div>
            <div className="flex-shrink-0">
                <div className="flex justify-center space-x-2 my-8">
                    {intros.map((_, i) => <div key={i} className={`h-2 w-2 rounded-full ${i === page ? 'bg-primary' : 'bg-border'}`}></div>)}
                </div>
                <PrimaryButton onClick={handleNext}>
                    {page < intros.length - 1 ? "Continue" : "Get Started"}
                </PrimaryButton>
            </div>
        </div>
    );
};

const Part1QuestionnaireComponent = ({ initialAnswers, onComplete }: { initialAnswers: any, onComplete: (answers: any) => void }) => {
    const [qIndex, setQIndex] = useState(0);
    const [answers, setAnswers] = useState(initialAnswers || {});
    
    useEffect(() => {
      console.log('Part1QuestionnaireComponent received initialAnswers:', initialAnswers);
      setAnswers(initialAnswers || {});
    }, [initialAnswers]);
    
    const questions = questionnaireData.part1;
    const currentQuestion = questions[qIndex];

    const handleAnswer = (value: any) => {
        setAnswers((prev: any) => ({ ...prev, [currentQuestion?.id ?? '']: value }));
    };

    const handleNext = () => {
        if (qIndex < questions.length - 1) {
            setQIndex(q => q + 1);
        } else {
            onComplete(answers);
        }
    };

    const renderQuestion = () => {
        const commonProps = { question: currentQuestion, answer: answers?.[currentQuestion?.id ?? ''], onAnswerChange: handleAnswer };
        switch (currentQuestion?.type) {
            case 'multi': return <MultiSelectQuestionComponent {...commonProps} />;
            case 'text': return <TextInputQuestionComponent {...commonProps} />;
            case 'number': return <NumberInputQuestionComponent {...commonProps} />;
            case 'single-dynamic': {
                const dynamicOptions = answers?.[currentQuestion?.dependsOn ?? ''] || [];
                if (!Array.isArray(dynamicOptions) || dynamicOptions.length === 0) {
                    return <p className="text-muted-foreground text-center py-4">Please select your primary reasons first to see this question.</p>;
                }
                return <SingleSelectQuestionComponent {...commonProps} question={{...currentQuestion, options: dynamicOptions.length > 0 ? dynamicOptions : ['Please select primary reasons first']}} />;
            }
            default: return <SingleSelectQuestionComponent {...commonProps} />;
        }
    };

    const isNextDisabled = currentQuestion?.type === 'single-dynamic' && (!answers?.[currentQuestion?.dependsOn ?? ''] || answers?.[currentQuestion?.dependsOn ?? ''].length === 0) && (!answers?.[currentQuestion?.id ?? '']);

    return (
         <div className="p-6 sm:p-8 h-full flex flex-col">
            <h2 className="font-headline text-2xl mb-6 text-center text-primary">Set Your Goals</h2>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">{renderQuestion()}</div>
            <div className="flex-shrink-0 mt-8 space-y-2">
                <PrimaryButton onClick={handleNext} disabled={isNextDisabled || (answers[currentQuestion?.id ?? ''] === undefined || (Array.isArray(answers[currentQuestion?.id ?? '']) && answers[currentQuestion?.id ?? ''].length === 0))}>Next</PrimaryButton>
                <Button variant="ghost" className="w-full text-sm text-muted-foreground p-2 h-auto">Save for Later</Button>
            </div>
        </div>
    );
};

const InitialInsightsComponent = ({ onComplete, answers }: { onComplete: (insightData: any) => void, answers: any }) => {
  const [healthInsight, setHealthInsight] = useState<string | null>(null);
  const [categoryRecommendations, setCategoryRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasGeneratedInsight = useRef(false);

  useEffect(() => {
    const fetchInsight = async () => {
      setIsLoading(true);
      setError(null);
      if (hasGeneratedInsight.current) {
        return;
      }
      try {
        const part1AnswerKeys = questionnaireData.part1.map(q => q.id);
        const part1Answers:any = {};
        for (const key of part1AnswerKeys) {
            if (answers.hasOwnProperty(key)) {
                part1Answers[key] = answers[key];
            }
        }
        if (Object.keys(part1Answers).length > 0) {
          hasGeneratedInsight.current = true;
          const result = await generateInitialInsight({ onboardingAnswers: part1Answers });
          const insightData = {
            healthInsight: result.healthInsight,
            categoryRecommendations: result.categoryRecommendations
          };
          setHealthInsight(result.healthInsight);
          setCategoryRecommendations(result.categoryRecommendations || []);
        } else {
            const defaultInsight = "Welcome to Podium! We're excited to help you on your wellness journey. Let's personalize it further in the next steps.";
            setHealthInsight(defaultInsight);
            setCategoryRecommendations([]);
        }
      } catch (e: any) {
        if (e?.message?.includes('quota') || e?.message?.includes('429')) {
          setError("Sorry, our AI coach is temporarily unavailable due to high demand. Please try again later!");
          setHealthInsight("We're excited to help you on your wellness journey!");
        } else {
          setError("Sorry, I couldn't generate an initial insight right now. Let's continue!");
          setHealthInsight("We're excited to help you on your wellness journey!");
        }
        setCategoryRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsight();
  }, [answers]);

  useEffect(() => {
    if (categoryRecommendations && categoryRecommendations.length > 0) {
      categoryRecommendations.forEach((rec: any) => {
        console.log('RECOMMENDATION RAW:', rec.recommendation);
      });
    }
  }, [categoryRecommendations]);

  return (
    <div className="h-full flex flex-col p-6 sm:p-8">
      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-col items-center justify-center min-h-full">
          <h2 className="font-headline text-3xl text-primary mb-4">Initial Insights</h2>
          {isLoading && (
            <div className="flex flex-col items-center space-y-3 text-muted-foreground animate-pulse">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p>Podium is preparing your first insights...</p>
            </div>
          )}
          {!isLoading && error && (
            <div className="p-4 bg-destructive/10 rounded-lg text-center max-w-sm">
              <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-2" />
              <p className="text-destructive-foreground font-semibold">Oops!</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          )}
          {!isLoading && !error && healthInsight && (
            <div className="p-4 bg-secondary/20 border border-secondary rounded-lg max-w-sm mx-auto flex flex-col items-center">
              <Lightbulb className="h-8 w-8 text-accent mb-2" />
              <p className="text-secondary-foreground text-base leading-relaxed text-center">{healthInsight}</p>
            </div>
          )}
          <p className="mt-6 text-muted-foreground text-sm max-w-xs text-center">This is just a quick glance. The more we know, the better we can tailor your Podium experience!</p>
        </div>
      </div>
      <div className="flex-shrink-0 w-full max-w-sm mx-auto mt-8">
        <PrimaryButton onClick={() => onComplete({ healthInsight, categoryRecommendations })}>Continue to Subscription Options</PrimaryButton>
      </div>
    </div>
  );
};

const SubscriptionPageComponent = ({ onComplete }: { onComplete: () => void }) => {
    const [referralCode, setReferralCode] = useState('');

    const handleApplyReferral = () => {
        console.log("Applying referral code:", referralCode);
        // Mock: Add toast notification here if desired
        alert(`Referral code "${referralCode}" applied (mock)!`);
    };

    return (
         <OnboardingStepContainer className="justify-between">
            <div className="text-center">
                <h2 className="font-headline text-3xl text-primary mb-3">Choose Your Podium Plan</h2>
                <p className="text-muted-foreground mb-8 max-w-xs mx-auto">Unlock personalized insights and premium features to accelerate your wellness journey.</p>
            </div>
            <div className="space-y-3 w-full max-w-sm">
                {['Gut Basics - Free', 'Gut Signal - $19/mo', 'Gut Genius - $39/mo'].map(plan => (
                    <OptionButton 
                        key={plan} 
                        text={plan} 
                        isSelected={plan.includes('Genius')} // Example: default selection
                        onClick={() => console.log("Selected plan:", plan)} // Mock: update state for selected plan
                        className="py-4 text-md"
                    />
                ))}
            </div>
            <div className="w-full max-w-sm mt-6 space-y-3">
                <p className="text-sm text-muted-foreground text-center">Have a referral code?</p>
                <div className="flex space-x-2">
                    <Input 
                        type="text" 
                        placeholder="Enter referral code" 
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        className="h-auto py-3 text-md bg-card border-input focus:border-primary"
                    />
                    <Button 
                        variant="outline" 
                        onClick={handleApplyReferral} 
                        disabled={!referralCode.trim()}
                        className="h-auto py-3 text-md border-primary text-primary hover:bg-primary/5"
                    >
                        Apply
                    </Button>
                </div>
            </div>
            <div className="w-full max-w-sm mt-8">
             <PrimaryButton onClick={onComplete}>Continue to Profile Setup</PrimaryButton>
             <Button variant="link" onClick={onComplete} className="mt-2 text-muted-foreground">Skip for now</Button>
            </div>
        </OnboardingStepContainer>
    );
};


const ConfirmationPageComponent = ({ onComplete }: { onComplete: () => void }) => (
    <OnboardingStepContainer>
        <Check className="w-16 h-16 text-green-500 mb-6" strokeWidth={2}/>
        <h2 className="font-headline text-3xl text-primary">Welcome to Podium!</h2>
        <p className="my-4 text-muted-foreground text-lg">Your initial setup is complete. Let's personalize your experience further.</p>
        <PrimaryButton onClick={onComplete}>Continue</PrimaryButton>
    </OnboardingStepContainer>
);

const Part2SurveyIntroComponent = ({ onBeginSurvey, onSkipSurvey }: { onBeginSurvey: () => void, onSkipSurvey: () => void }) => (
    <OnboardingStepContainer className="justify-center">
        <h2 className="font-headline text-2xl text-primary mb-4">Diagnostic Survey</h2>
        <p className="my-4 text-muted-foreground text-lg max-w-md">
            This survey baseline helps us develop a more personalized start for insights and recommendations . It typically takes about 10 minutes to complete. You can also skip this for now and complete it later from your Diagnose page under more in the bottom menu.
        </p>
        <div className="w-full max-w-sm space-y-3 mt-6">
          <PrimaryButton onClick={onBeginSurvey}>Complete Survey Now (est. 10 min)</PrimaryButton>
          <Button variant="outline" onClick={onSkipSurvey} className="w-full h-auto py-3 text-lg border-primary text-primary hover:bg-primary/5">
            Skip for Now & Go to Home
          </Button>
        </div>
    </OnboardingStepContainer>
);


const CategoryQuestionFlowComponent = ({ categoryName, questions, answers, setAnswers, onExitCategory, globalAnswers }: { categoryName: string, questions: any[], answers: Record<string, any>, setAnswers: (newAnswers: Record<string, any>) => void, onExitCategory: () => void, globalAnswers: Record<string, any> }) => {
    const [qIndex, setQIndex] = useState(0);

    const visibleQuestions = useMemo(() => {
        return questions.filter(q => typeof q === 'object' && q !== null && 'condition' in q && typeof (q as any).condition === 'function' ? (q as any).condition(globalAnswers) : true);
    }, [questions, globalAnswers]);

    const currentQuestion = visibleQuestions[qIndex];

    const handleAnswer = (value: any) => {
        setAnswers((prevGlobalAnswers: Record<string, any>) => ({ ...prevGlobalAnswers, [currentQuestion?.id ?? '']: value }));
    };

    const handleNext = () => {
        if (qIndex < visibleQuestions.length - 1) {
            setQIndex(prev => prev + 1);
        } else {
            onExitCategory();
        }
    };

    const renderQuestion = () => {
        if (!currentQuestion) return <p className="text-muted-foreground">No more questions in this category or conditions not met.</p>;
        const commonProps = { question: currentQuestion, answer: (globalAnswers as Record<string, any>)?.[String(currentQuestion?.id) ?? ''], onAnswerChange: handleAnswer };
        switch(currentQuestion.type) {
            case 'multi': return <MultiSelectQuestionComponent {...commonProps} />;
            case 'single': return <SingleSelectQuestionComponent {...commonProps} />;
            case 'number': return <NumberInputQuestionComponent {...commonProps} />;
            case 'text': return <TextInputQuestionComponent {...commonProps} />;
            case 'single-dynamic': {
                const dynamicOptions = (globalAnswers as Record<string, any>)?.[String(currentQuestion?.dependsOn) ?? ''] || [];
                if (!Array.isArray(dynamicOptions) || dynamicOptions.length === 0) {
                    return <p className="text-muted-foreground text-center py-4">Please select your primary reasons first to see this question.</p>;
                }
                return <SingleSelectQuestionComponent
                    {...commonProps}
                    question={{
                        ...currentQuestion,
                        options: dynamicOptions.length > 0 ? dynamicOptions : ['Please select primary reasons first']
                    }}
                />;
            }
            default: return <p className="text-red-500">Unsupported question type: {currentQuestion.type}</p>;
        }
    };

    if (visibleQuestions.length === 0) {
         useEffect(() => {
            onExitCategory();
        }, [onExitCategory]);
        return (
            <div className="p-6 h-full flex flex-col bg-card items-center justify-center">
                <p className="text-muted-foreground text-center">No applicable questions in this category based on your previous answers.</p>
                <Button onClick={onExitCategory} className="mt-4">Back to Categories</Button>
            </div>
        );
    }

    return (
         <div className="p-6 h-full flex flex-col bg-card">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="icon" onClick={onExitCategory} className="p-2 -ml-2 mr-2 text-muted-foreground hover:text-primary"><ArrowLeft className="h-5 w-5"/></Button>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-linear" style={{width: `${((qIndex + 1) / visibleQuestions.length) * 100}%`}}></div>
                </div>
            </div>
            <h2 className="font-headline text-xl text-primary mb-4 text-center">{categoryName}</h2>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">{renderQuestion()}</div>
            <div className="flex-shrink-0 mt-8 space-y-2">
                <PrimaryButton onClick={handleNext} disabled={!currentQuestion || (globalAnswers as Record<string, any>)?.[String(currentQuestion.id)] === undefined || (Array.isArray((globalAnswers as Record<string, any>)?.[String(currentQuestion.id)]) && (globalAnswers as Record<string, any>)?.[String(currentQuestion.id)].length === 0)}>
                    {qIndex < visibleQuestions.length - 1 ? 'Next' : 'Finish Category'}
                </PrimaryButton>
                <Button variant="ghost" onClick={onExitCategory} className="w-full text-sm text-muted-foreground p-2 h-auto">Save & Exit Category</Button>
            </div>
        </div>
    );
};


const Part2SurveyComponent = ({ initialAnswers, onComplete }: { initialAnswers: Record<string, any>, onComplete: (answers: Record<string, any>) => void }) => {
    const router = useRouter();
    const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers || {});
    useEffect(() => {
      setAnswers(initialAnswers || {});
    }, [initialAnswers]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isFinishing, setIsFinishing] = useState(false);

    const allCategories = Object.keys(questionnaireData.part2);

    const completedCategoriesCount = useMemo(() => {
        return allCategories.filter(catName => {
            const categoryQuestions = questionnaireData.part2[catName as keyof typeof questionnaireData.part2];
            const visibleCategoryQuestions = categoryQuestions.filter(q => ('condition' in q && typeof q.condition === 'function') ? q.condition(answers) : true);
            if (visibleCategoryQuestions.length === 0) return true;
            return visibleCategoryQuestions.every(q => {
              const answer = (answers as Record<string, any>)[String(q.id)];
              if (answer === undefined) return false;
              if (Array.isArray(answer) && answer.length === 0 && !(q.options && q.options.some((opt: string) => opt.toLowerCase().includes("none")) && answer.includes(q.options.find((opt: string) => opt.toLowerCase().includes("none"))!))) {
                return false; 
              }
              return true;
            });
        }).length;
    }, [answers, allCategories]);

    if (activeCategory) {
        return <CategoryQuestionFlowComponent
                    categoryName={activeCategory}
                    questions={questionnaireData.part2[activeCategory as keyof typeof questionnaireData.part2]}
                    answers={answers} 
                    setAnswers={setAnswers} 
                    onExitCategory={() => setActiveCategory(null)}
                    globalAnswers={answers} 
                />;
    }

    const allQuestionsConsideredAnswered = completedCategoriesCount === allCategories.length;

    const handleFinishOnboarding = async () => {
        setIsFinishing(true);
        onComplete(answers);
    };

    return (
         <div className="p-6 bg-card h-full flex flex-col">
            <h1 className="font-headline text-2xl text-center mb-2 text-primary">Complete Your Diagnostic Survey</h1>
            <p className="text-center text-muted-foreground mb-6">Tap a category to answer questions. Your progress is saved automatically.</p>

            <div className="flex-grow space-y-3 overflow-y-auto pr-2 -mr-2 mb-4">
                {allCategories.map(categoryName => {
                    const categoryQuestions = questionnaireData.part2[categoryName as keyof typeof questionnaireData.part2];
                    const visibleCategoryQuestions = categoryQuestions.filter(q => ('condition' in q && typeof q.condition === 'function') ? q.condition(answers) : true);
                    
                    const answeredCount = visibleCategoryQuestions.filter(q => {
                        const answer = (answers as Record<string, any>)[String(q.id)];
                        
                        if(Array.isArray(answer) && q.options && q.options.some((opt: string) => opt.toLowerCase().includes("none")) && answer.includes(q.options.find((opt: string) => opt.toLowerCase().includes("none"))!)) {
                            return true;
                        }
                        return answer !== undefined && (!Array.isArray(answer) || answer.length > 0);
                    }).length;
                    
                    const isComplete = visibleCategoryQuestions.length > 0 ? answeredCount === visibleCategoryQuestions.length : true;

                    return (
                        <button
                            key={categoryName}
                            onClick={() => setActiveCategory(categoryName)}
                            className="w-full text-left p-4 border-2 rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors"
                            disabled={visibleCategoryQuestions.length === 0 && !isComplete}
                        >
                            <div>
                                <p className="font-semibold text-primary">{categoryName}</p>
                                {visibleCategoryQuestions.length > 0 ? (
                                  <p className="text-xs text-muted-foreground">{answeredCount} of {visibleCategoryQuestions.length} questions answered</p>
                                ) : (
                                  <p className="text-xs text-muted-foreground">No applicable questions based on prior answers.</p>
                                )}
                            </div>
                            {isComplete && <CheckCircle className="text-green-500 h-5 w-5" />}
                        </button>
                    );
                })}
            </div>

            <div className="mt-auto flex-shrink-0 pt-4 border-t border-border">
                <PrimaryButton onClick={handleFinishOnboarding}>
                    {allQuestionsConsideredAnswered ? 'View Insights' : 'Finish For Now & Go to Home'}
                </PrimaryButton>
            </div>
         </div>
    );
};

// Replace the placeholder async LLM function for final insights
async function generateFinalInsightAndRecs({ part1Answers, part2Answers }: { part1Answers: any, part2Answers: any }) {
  // Merge answers
  const fullAnswers = { ...part1Answers, ...part2Answers };
  // Call the LLM
  const result = await generateSecondInsight({
    fullAnswers,
    trackingQuestions
  });
  // Convert array to object for compatibility with old prop
  const recommendationsObj: Record<string, string[]> = {};
  (result.categoryRecommendations || []).forEach((rec) => {
    recommendationsObj[rec.category] = rec.recommendation.split('\n').map(s => s.trim()).filter(Boolean);
  });
  return {
    insight: result.healthInsight,
    recommendations: recommendationsObj,
    // Also return the array for new UI
    recommendationsArray: result.categoryRecommendations || []
  };
}

// FinalInsightsComponent now handles loading and fetches the insight itself
const FinalInsightsComponent = ({ part1Answers, part2Answers }: { part1Answers: any, part2Answers: any }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [healthInsight, setHealthInsight] = useState<string | null>(null);
  const [recommendationsArray, setRecommendationsArray] = useState<Array<{ category: string, recommendation: string }>>([]);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const result = await generateFinalInsightAndRecs({ part1Answers, part2Answers });
        setHealthInsight(result.insight);
        setRecommendationsArray(result.recommendationsArray);
      } catch (err) {
        setError('Failed to generate insights. Please try again.');
        console.error('Error generating insights:', err);
      } finally {
        setLoading(false);
    }
    };

    fetchInsights();
  }, [part1Answers, part2Answers]);

  const handleGoToHome = async () => {
    try {
      // Generate priorities for all time periods before going to home
      const mergedAnswers = { ...part1Answers, ...part2Answers };
      
      // Call the priority generation API for all time periods
      const timePeriods = ['morning', 'afternoon', 'evening'];
      const categoryMapping = {
        'Digestive Health': 'digestive-health-&-symptoms',
        'Medication & Supplement Use': 'medication-&-supplement-use',
        'Nutrition & Diet Habits': 'diet-&-nutrition',
        'Personalized Goals & Achievements': 'personalized-goals-&-achievements',
        'Physical Activity & Movement': 'physical-activity-&-movement',
        'Stress, Sleep, and Recovery': 'sleep-&-recovery',
      };

      // Import trackingQuestions dynamically to avoid circular dependencies
    const { trackingQuestions } = await import('@/data/trackingQuestions');
    const { getQuestionTime } = await import('@/utils/taskAllocation');

      for (const timePeriod of timePeriods) {
        const timeTasks: any[] = [];
        
      Object.entries(trackingQuestions).forEach(([category, questions]) => {
          questions.forEach((q: any) => {
          const assignedTime = getQuestionTime(q.id, q.timeOfDay);
            if (assignedTime === timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)) {
              const categoryId = categoryMapping[category as keyof typeof categoryMapping] || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            timeTasks.push({
              id: `${categoryId}__${q.id}`,
              type: q.type,
              text: q.text,
              timeOfDay: q.timeOfDay,
              options: q.options,
                placeholder: q.placeholder,
            });
          }
        });
      });

        if (timeTasks.length > 0) {
      try {
            await fetch('/api/ai-prioritize-tracking-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ onboardingAnswers: mergedAnswers, trackingQuestions: timeTasks }),
        });
          } catch (e) {
            console.warn(`Failed to generate priorities for ${timePeriod}:`, e);
          }
        }
      }

      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Error generating priorities:', error);
      // Still redirect to home even if priority generation fails
      window.location.href = '/';
    }
  };

  return (
    <OnboardingStepContainer className="justify-between">
      <div className="flex-1 overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="font-headline text-3xl text-primary mb-3">Your Personalized Insights</h2>
          <p className="text-muted-foreground">Based on your responses, here's what we've learned about your health journey.</p>
        </div>

        {loading && (
          <div className="flex flex-col items-center space-y-3 text-muted-foreground animate-pulse">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p>Generating your personalized insights...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-destructive/10 rounded-lg text-center max-w-sm mx-auto">
            <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-2" />
            <p className="text-destructive-foreground font-semibold">Oops!</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && healthInsight && (
          <div className="p-4 bg-secondary/20 border border-secondary rounded-lg max-w-sm mx-auto mb-6">
            <Lightbulb className="h-8 w-8 text-accent mb-2" />
            <p className="text-secondary-foreground text-base leading-relaxed text-center">{healthInsight}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <Accordion type="multiple" className="space-y-3">
              {recommendationsArray.map(({ category, recommendation }) => (
                <AccordionItem key={category} value={category} className="bg-white border border-primary/30 rounded-lg shadow-sm">
                  <AccordionTrigger className="px-4 py-3 font-semibold text-primary text-base rounded-lg hover:bg-primary/5 focus:outline-none">
                    {category}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-left">
                    <ul className="list-disc ml-5 text-sm text-foreground text-left">
                      {recommendation.split('\n').map((rec, i) => {
                        // Remove leading bullet and whitespace if present
                        const clean = rec.replace(/^•\s*/, '');
                        return <li key={i}>{clean}</li>;
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
        {!loading && !error && (
          <div className="flex-shrink-0 px-6 pb-6 pt-2">
            <PrimaryButton onClick={handleGoToHome}>Go To Home</PrimaryButton>
          </div>
        )}
      </div>
    </OnboardingStepContainer>
  );
};

// Utility to recursively check for functions in an object
function findFunctionInObject(obj: any, path: string[] = []): string | null {
  if (typeof obj === 'function') return path.join('.') || '<root>';
  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const found = findFunctionInObject(obj[key], [...path, key]);
      if (found) return found;
    }
  }
  return null;
}

// Utility to save onboarding data to Firestore
async function saveOnboardingDataToFirestore(uid: string, onboardingData: any) {
  console.log('Saving to Firestore:', onboardingData);
  const functionPath = findFunctionInObject(onboardingData);
  if (functionPath) {
    console.warn('Not saving to Firestore: function found at', functionPath);
    return;
  }
  const db = getFirestore(app);
  await setDoc(doc(db, 'users', uid, 'onboarding', 'answers'), onboardingData, { merge: true });
}

// Utility to load onboarding data from Firestore
async function loadOnboardingDataFromFirestore(uid: string) {
  console.log('Loading onboarding data for user:', uid);
  const db = getFirestore(app);
  
  // Try the original path first
  const docRef = doc(db, 'users', uid, 'onboarding', 'answers');
  console.log('Trying path:', 'users', uid, 'onboarding', 'answers');
  
  try {
    const docSnap = await getDoc(docRef);
    console.log('Document exists:', docSnap.exists());
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('Loaded data:', data);
      return data || {};
    }
  } catch (error) {
    console.log('Error with onboarding path:', error);
    
    // Try alternative path structure
    try {
      const altDocRef = doc(db, 'users', uid, 'answers');
      console.log('Trying alternative path:', 'users', uid, 'answers');
      const altDocSnap = await getDoc(altDocRef);
      console.log('Alternative document exists:', altDocSnap.exists());
      if (altDocSnap.exists()) {
        const data = altDocSnap.data();
        console.log('Loaded data from alternative path:', data);
        return data || {};
      }
    } catch (altError) {
      console.log('Error with alternative path:', altError);
    }
  }
  
  console.log('No data found, returning empty object');
  return {};
}

// Main Onboarding Page Component
export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'splash' | 'login' | 'signup' | 'intro' | 'part1' | 'initial_insights' | 'subscription' | 'confirmation' | 'part2_intro' | 'part2_survey' | 'final_insights'>('splash');
  const [onboardingData, setOnboardingData] = useState<any>({});
  const [isFinishing, setIsFinishing] = useState(false);
  const [loadingAnswers, setLoadingAnswers] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [finalPart1Answers, setFinalPart1Answers] = useState<any>(null);
  const [finalPart2Answers, setFinalPart2Answers] = useState<any>(null);

  // Listen for authentication state changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed, user:', user?.uid);
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load onboarding data from Firestore when user is authenticated
  useEffect(() => {
    const fetchData = async () => {
      console.log('User state changed:', user?.uid);
      if (user) {
        setLoadingAnswers(true);
        try {
          const firestoreData = await loadOnboardingDataFromFirestore(user.uid);
          console.log('Final onboardingData loaded:', firestoreData);
          console.log('part1Answers:', firestoreData.part1Answers);
          setOnboardingData(firestoreData);
          setCurrentStep('part1'); // Always start at part 1, regardless of progress
      } catch (e) {
          console.error('Error loading onboarding data:', e);
          setOnboardingData({});
          setCurrentStep('part1');
        } finally {
          setLoadingAnswers(false);
        }
      } else {
        console.log('No user logged in');
        setLoadingAnswers(false);
      }
    };
    fetchData();
  }, [user]); // Now depends on user state

  // Save onboarding data to Firestore whenever it changes (except splash/login)
  useEffect(() => {
    if (currentStep !== 'splash' && currentStep !== 'login' && user) {
      saveOnboardingDataToFirestore(user.uid, onboardingData);
    }
  }, [onboardingData, currentStep, user]);

  // Handlers for each onboarding part
  const handlePart1Complete = (part1Answers: any) => {
    setOnboardingData((prev: any) => ({ ...prev, part1Answers }));
    setCurrentStep('initial_insights');
  };

  const handleInitialInsight = (insightData: any) => {
    setOnboardingData((prev: any) => ({ ...prev, initialInsight: insightData.healthInsight, initialRecommendations: insightData.categoryRecommendations }));
    setCurrentStep('subscription');
  };

  const handlePart2Complete = async (part2Answers: any) => {
    setOnboardingData((prev: any) => ({ ...prev, part2Answers }));
    setFinalPart1Answers(onboardingData.part1Answers || {});
    setFinalPart2Answers(part2Answers);
    setCurrentStep('final_insights');
  };

  // Pass onboardingData.part1Answers, onboardingData.part2Answers, etc. to components as needed
  const renderCurrentStep = () => {
    if (loadingAnswers) {
      return <OnboardingStepContainer><p>Loading your onboarding data...</p></OnboardingStepContainer>;
    }
    switch (currentStep) {
      case 'splash': return <SplashScreenComponent onComplete={() => setCurrentStep('login')} />;
      case 'login': return <LoginPageComponent onComplete={() => setCurrentStep('intro')} onSwitchToSignUp={() => setCurrentStep('signup')} />;
      case 'signup': return <SignUpPageComponent onComplete={() => setCurrentStep('intro')} onSwitchToLogin={() => setCurrentStep('login')} />;
      case 'intro': return <IntroCarouselComponent onComplete={() => setCurrentStep('part1')} />;
      case 'part1':
        return <Part1QuestionnaireComponent
          initialAnswers={onboardingData.part1Answers || {}}
          onComplete={handlePart1Complete}
        />;
      case 'initial_insights': return <InitialInsightsComponent answers={onboardingData.part1Answers || {}} onComplete={handleInitialInsight} />;
      case 'subscription': return <SubscriptionPageComponent onComplete={() => setCurrentStep('confirmation')} />;
      case 'confirmation': return <ConfirmationPageComponent onComplete={() => setCurrentStep('part2_intro')} />;
      case 'part2_intro':
        return <Part2SurveyIntroComponent
                    onBeginSurvey={() => setCurrentStep('part2_survey')}
                    onSkipSurvey={() => setCurrentStep('part2_survey')}
               />;
      case 'part2_survey':
        return <Part2SurveyComponent
          initialAnswers={onboardingData.part2Answers || {}}
          onComplete={handlePart2Complete}
        />;
      case 'final_insights':
        return <FinalInsightsComponent part1Answers={finalPart1Answers || onboardingData.part1Answers || {}} part2Answers={finalPart2Answers || onboardingData.part2Answers || {}} />;
      default: return <OnboardingStepContainer><p>Loading...</p></OnboardingStepContainer>;
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md h-screen max-h-[875px] sm:h-[calc(100vh-4rem)] sm:max-h-[875px] bg-background shadow-2xl sm:rounded-2xl flex flex-col overflow-hidden">
        {renderCurrentStep()}
      </div>
    </main>
  );
}
