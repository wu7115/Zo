
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

// Questionnaire Data
const questionnaireData = {
  part1: [
    { id: 'primaryReasons', type: 'multi', text: 'What are your primary reasons for coming to Podium?', options: ['Improve general gut health', 'Manage a chronic gut health issue', 'Weight management', 'Improve sleep', 'Increase energy levels', 'Support immune function', 'Reduce bloating or digestive discomfort', 'Improve skin health', 'Improve mental clarity / reduce brain fog', 'Balance mood / manage stress', 'Other'] },
    { id: 'mainFocus', type: 'single-dynamic', text: 'Of the goals you selected, which is your main focus right now?', dependsOn: 'primaryReasons' },
    { id: 'digestiveSymptoms', type: 'multi', text: 'Which of the following digestive symptoms do you regularly experience?', options: ['General gut discomfort', 'Bloating after meals', 'Constipation, diarrhea, or irregular bowel movements', 'None'] },
    { id: 'dietType', type: 'single', text: 'Which of these best describes your usual diet?', options: ['Omnivorous', 'Vegetarian', 'Vegan', 'Pescatarian', 'Other'] },
    { id: 'fruitVegServings', type: 'single', text: 'About how many servings of fruits and vegetables do you usually have per day?', options: ['0–1', '2–3', '4–5', '6+'] },
    { id: 'probiotics', type: 'single', text: "Do you currently take probiotics or prebiotics?", options: ['Yes', 'No', "I'm not sure"] },
    { id: 'stressLevel', type: 'single', text: 'How would you describe your stress level most days?', options: ['Low', 'Moderate', 'High', 'Very High'] },
    { id: 'sleepQuality', type: 'single', text: 'Do you feel well-rested upon waking up?', options: ['Yes', 'No'] },
    { id: 'wearables', type: 'single', text: 'Do you track your health using wearables (like Fitbit, Apple Watch, Oura, etc.)?', options: ['Yes', 'No'] },
  ],
  part2: { // Placeholder for future
    'Symptoms & Flares': [],
  }
};

// UI Sub-Components (Styled to match HTML as much as possible with Tailwind/ShadCN)
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
            <h3 className="text-xl font-semibold text-primary mb-6">{question.text}</h3>
            {question.options.map((option: string) => (
                <OptionButton key={option} text={option} isSelected={answer.includes(option)} onClick={() => toggleOption(option)} />
            ))}
        </div>
    );
};

const SingleSelectQuestionComponent = ({ question, answer, onAnswerChange }: { question: any, answer: string, onAnswerChange: (value: string) => void }) => (
    <div>
        <h3 className="text-xl font-semibold text-primary mb-6">{question.text}</h3>
        {question.options.map((option: string) => (
            <OptionButton key={option} text={option} isSelected={answer === option} onClick={() => onAnswerChange(option)} />
        ))}
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

const LoginPageComponent = ({ onComplete }: { onComplete: () => void }) => (
    <OnboardingStepContainer>
        <h1 className="font-headline text-3xl text-center mb-2 text-primary">Welcome Back</h1>
        <p className="text-center text-muted-foreground mb-8">Sign in to continue your journey.</p>
        <div className="w-full max-w-sm space-y-4">
            <Input type="email" placeholder="Email" className="w-full p-3 bg-card border-2 border-input rounded-lg text-base h-auto"/>
            <Input type="password" placeholder="Password" className="w-full p-3 bg-card border-2 border-input rounded-lg text-base h-auto"/>
        </div>
        <div className="w-full max-w-sm mt-6">
            <PrimaryButton onClick={onComplete}>Continue</PrimaryButton>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account? <a href="#" className="font-semibold text-primary hover:underline">Sign Up</a>
        </p>
    </OnboardingStepContainer>
);

const IntroCarouselComponent = ({ onComplete }: { onComplete: () => void }) => {
    const [page, setPage] = useState(0);
    const intros = [
        { line1: "Great health starts in the gut", line2: "Understand, optimize and take control of your health" },
        { line1: "What’s Inside Podium", line2: "Set Your Health Goals, Track Your Progress, AI Companion, Gut Health Score" },
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

const Part1QuestionnaireComponent = ({ onComplete, answers, setAnswers }: { onComplete: () => void, answers: any, setAnswers: React.Dispatch<React.SetStateAction<any>> }) => {
    const [qIndex, setQIndex] = useState(0);
    const questions = questionnaireData.part1;
    const currentQuestion = questions[qIndex];

    const handleAnswer = (value: any) => {
        setAnswers((prev: any) => ({ ...prev, [currentQuestion.id]: value }));
    };

    const handleNext = () => {
        if (qIndex < questions.length - 1) {
            setQIndex(q => q + 1);
        } else {
            onComplete();
        }
    };
    
    const renderQuestion = () => {
        const commonProps = { question: currentQuestion, answer: answers[currentQuestion.id], onAnswerChange: handleAnswer };
        switch (currentQuestion.type) {
            case 'multi': return <MultiSelectQuestionComponent {...commonProps} />;
            case 'single-dynamic': 
                const dynamicOptions = answers[currentQuestion.dependsOn] || [];
                if (dynamicOptions.length === 0 && qIndex > 0) { // Check qIndex to avoid error on first dynamic question if dependency not yet met
                   return <p className="text-muted-foreground text-center py-4">Please select your primary reasons first to see this question.</p>;
                }
                return <SingleSelectQuestionComponent {...commonProps} question={{...currentQuestion, options: dynamicOptions.length > 0 ? dynamicOptions : ['Please select primary reasons first']}} />;
            default: return <SingleSelectQuestionComponent {...commonProps} />;
        }
    };
    
    // Disable Next if dynamic question has no options (and it's not the initial state of such question)
    const isNextDisabled = currentQuestion.type === 'single-dynamic' && (!answers[currentQuestion.dependsOn] || answers[currentQuestion.dependsOn].length === 0);

    return (
         <div className="p-6 sm:p-8 h-full flex flex-col">
            <h2 className="font-headline text-2xl mb-6 text-center text-primary">Set Your Goals</h2>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">{renderQuestion()}</div> {/* Added scroll for question area */}
            <div className="flex-shrink-0 mt-8 space-y-2">
                <PrimaryButton onClick={handleNext} disabled={isNextDisabled}>Next</PrimaryButton>
                <Button variant="ghost" className="w-full text-sm text-muted-foreground p-2 h-auto">Save for Later</Button>
            </div>
        </div>
    );
};

const TeaserPageComponent = ({ onComplete }: { onComplete: () => void }) => (
    <OnboardingStepContainer>
        <h2 className="font-headline text-2xl text-primary">Teaser Results</h2>
        <p className="my-4 text-muted-foreground">Based on your initial answers, your diet might be playing a key role in how you feel.</p>
        <PrimaryButton onClick={onComplete}>See Full Plan Options</PrimaryButton>
    </OnboardingStepContainer>
);

const SubscriptionPageComponent = ({ onComplete }: { onComplete: () => void }) => (
     <OnboardingStepContainer className="justify-between">
        <div>
            <h2 className="font-headline text-2xl text-primary mb-4">Choose Your Podium Plan</h2>
            <p className="text-muted-foreground mb-6">Unlock personalized insights and premium features.</p>
        </div>
        <div className="space-y-3 w-full max-w-sm">
            {['Gut Basics - Free', 'Gut Signal - $19/mo', 'Gut Genius - $39/mo'].map(plan => (
                <OptionButton key={plan} text={plan} isSelected={plan.includes('Genius')} onClick={() => {}} />
            ))}
        </div>
        <div className="w-full max-w-sm mt-8">
         <PrimaryButton onClick={onComplete}>Continue to Profile Setup</PrimaryButton>
        </div>
    </OnboardingStepContainer>
);

const ConfirmationPageComponent = ({ onComplete }: { onComplete: () => void }) => (
    <OnboardingStepContainer>
        <Check className="w-16 h-16 text-green-500 mb-6" strokeWidth={2}/>
        <h2 className="font-headline text-3xl text-primary">Welcome to Podium!</h2>
        <p className="my-4 text-muted-foreground text-lg">Your initial setup is complete. Let's personalize your experience further.</p>
        <PrimaryButton onClick={onComplete}>Create Your Profile</PrimaryButton>
    </OnboardingStepContainer>
);

const Part2HubPageComponent = ({ onComplete }: { onComplete: () => void }) => (
    <OnboardingStepContainer>
        <h2 className="font-headline text-2xl text-primary">Diagnostic Survey</h2>
        <p className="my-4 text-muted-foreground">This optional survey helps us fine-tune your recommendations. You can complete it now or later from your profile.</p>
        <div className="w-full max-w-sm space-y-3 mt-4">
          <PrimaryButton onClick={onComplete}>Complete Survey Now (est. 10 min)</PrimaryButton>
          <Button variant="outline" onClick={onComplete} className="w-full h-auto py-3 text-lg">Skip for Now & Go to Home</Button>
        </div>
    </OnboardingStepContainer>
);


export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState('splash'); // 'splash', 'login', 'intro', 'part1', 'teaser', 'subscription', 'confirmation', 'part2_hub'
  const [answers, setAnswers] = useState<any>({});

  const handleFinishOnboarding = () => {
    console.log('Onboarding data collected:', answers);
    localStorage.setItem('isOnboarded', 'true');
    router.push('/');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'splash': return <SplashScreenComponent onComplete={() => setCurrentStep('login')} />;
      case 'login': return <LoginPageComponent onComplete={() => setCurrentStep('intro')} />;
      case 'intro': return <IntroCarouselComponent onComplete={() => setCurrentStep('part1')} />;
      case 'part1': return <Part1QuestionnaireComponent answers={answers} setAnswers={setAnswers} onComplete={() => setCurrentStep('teaser')} />;
      case 'teaser': return <TeaserPageComponent onComplete={() => setCurrentStep('subscription')} />;
      case 'subscription': return <SubscriptionPageComponent onComplete={() => setCurrentStep('confirmation')} />;
      case 'confirmation': return <ConfirmationPageComponent onComplete={() => setCurrentStep('part2_hub')} />;
      case 'part2_hub': return <Part2HubPageComponent onComplete={handleFinishOnboarding} />;
      default: return <OnboardingStepContainer><p>Loading...</p></OnboardingStepContainer>;
    }
  };

  // Ensure this page takes up the full screen and provides a constrained, scrollable content area
  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen bg-gradient-to-br from-accent to-secondary">
      <div className="w-full max-w-md h-screen max-h-[875px] sm:h-[calc(100vh-4rem)] sm:max-h-[875px] bg-background shadow-2xl sm:rounded-2xl flex flex-col overflow-hidden">
        {/* The direct child of this div should handle its own scrolling if content exceeds viewport */}
        {renderCurrentStep()}
      </div>
    </main>
  );
}
