'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Check, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { questionnaireData } from '@/data/questionnaireData';
import { AiPencilPanel } from '../../components/AiPencilPanel';

// --- UI Components (Adapted from onboarding/page.tsx) ---
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
            <h3 className="text-lg font-semibold text-primary mb-4">{question.text}</h3>
            {question.options.map((option: string) => (
                <OptionButton key={option} text={option} isSelected={answer.includes(option)} onClick={() => toggleOption(option)} />
            ))}
        </div>
    );
};

const SingleSelectQuestionComponent = ({ question, answer, onAnswerChange }: { question: any, answer: string, onAnswerChange: (value: string) => void }) => (
    <div>
        <h3 className="text-lg font-semibold text-primary mb-4">{question.text}</h3>
        {question.options.map((option: string) => (
            <OptionButton key={option} text={option} isSelected={answer === option} onClick={() => onAnswerChange(option)} />
        ))}
    </div>
);

const TextInputQuestionComponent = ({ question, answer, onAnswerChange }: { question: any, answer: string, onAnswerChange: (value: string) => void }) => (
    <div>
        <h3 className="text-lg font-semibold text-primary mb-4">{question.text}</h3>
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
        <h3 className="text-lg font-semibold text-primary mb-4">{question.text}</h3>
        <Input
            type="number"
            value={answer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder={question.placeholder}
            className="w-full p-3 bg-card border-2 border-input rounded-lg text-base h-auto focus:ring-ring focus:border-ring"
        />
    </div>
);

// --- Survey Flow Components (Adapted from onboarding/page.tsx) ---
const CategoryQuestionFlowComponent = ({ categoryName, questions, answers, setAnswers, onExitCategory, globalAnswers }: { categoryName: string, questions: any[], answers: any, setAnswers: (newAnswers: any) => void, onExitCategory: () => void, globalAnswers: any }) => {
    const [qIndex, setQIndex] = useState(0);

    const visibleQuestions = useMemo(() => {
        // Use globalAnswers for conditional logic
        return questions.filter(q => ('condition' in q && typeof q.condition === 'function') ? q.condition(globalAnswers) : true);
    }, [questions, globalAnswers]);

    const currentQuestion = visibleQuestions[qIndex];

    const handleAnswer = (value: any) => {
        // Update globalAnswers directly for immediate reflection in conditions
        setAnswers((prevGlobalAnswers: any) => ({ ...prevGlobalAnswers, [currentQuestion.id]: value }));
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
        // Pass globalAnswers[currentQuestion.id] as the current answer for this question
        const commonProps = { question: currentQuestion, answer: globalAnswers[currentQuestion.id], onAnswerChange: handleAnswer };
        switch(currentQuestion.type) {
            case 'multi': return <MultiSelectQuestionComponent {...commonProps} />;
            case 'single': return <SingleSelectQuestionComponent {...commonProps} />;
            case 'number': return <NumberInputQuestionComponent {...commonProps} />;
            case 'text': return <TextInputQuestionComponent {...commonProps} />;
            default: return <p className="text-red-500">Unsupported question type: {currentQuestion.type}</p>;
        }
    };

    if (visibleQuestions.length === 0) {
         useEffect(() => {
            onExitCategory(); // Automatically exit if no questions are visible
        }, [onExitCategory]);
        return (
            <div className="p-6 h-full flex flex-col bg-card items-center justify-center">
                <p className="text-muted-foreground text-center">No applicable questions in this category based on your answers.</p>
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
                <PrimaryButton onClick={handleNext} disabled={!currentQuestion || globalAnswers[currentQuestion.id] === undefined || (Array.isArray(globalAnswers[currentQuestion.id]) && globalAnswers[currentQuestion.id].length === 0 && !(currentQuestion.options && currentQuestion.options.some((opt: string) => opt.toLowerCase().includes("none")) && globalAnswers[currentQuestion.id].includes(currentQuestion.options.find((opt: string) => opt.toLowerCase().includes("none"))!)) ) }>
                    {qIndex < visibleQuestions.length - 1 ? 'Next' : 'Finish Category'}
                </PrimaryButton>
            </div>
        </div>
    );
};

const DiagnosticSurveyContent = ({ onSurveyComplete, initialAnswers = {} }: { onSurveyComplete: (surveyAnswers: any) => void, initialAnswers: any }) => {
    const [answers, setAnswers] = useState<any>({});
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Load answers from localStorage (sync with onboarding)
    useEffect(() => {
        const stored = localStorage.getItem('onboardingAnswers');
        if (stored) {
            setAnswers(JSON.parse(stored));
        } else {
            setAnswers(initialAnswers);
        }
    }, [initialAnswers]);

    // Save answers to localStorage whenever they change
    useEffect(() => {
        // Merge current answers with existing onboardingAnswers
        const existing = localStorage.getItem('onboardingAnswers');
        let merged = { ...answers };
        if (existing) {
            try {
                const parsed = JSON.parse(existing);
                merged = { ...parsed, ...answers };
            } catch {}
        }
        localStorage.setItem('onboardingAnswers', JSON.stringify(merged));
    }, [answers]);

    const allCategories = Object.keys(questionnaireData.part2);

    const completedCategoriesCount = useMemo(() => {
        return allCategories.filter(catName => {
            const categoryQuestions = questionnaireData.part2[catName as keyof typeof questionnaireData.part2];
            const visibleCategoryQuestions = categoryQuestions.filter(q => ('condition' in q && typeof q.condition === 'function') ? q.condition(answers) : true);
            if (visibleCategoryQuestions.length === 0) return true; 
            return visibleCategoryQuestions.every(q => {
              const answer = answers[q.id];
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

    return (
         <div className="p-6 bg-card h-full flex flex-col">
            <div className="flex-grow space-y-3 overflow-y-auto pr-2 -mr-2 mb-4">
                {allCategories.map(categoryName => {
                    const categoryQuestions = questionnaireData.part2[categoryName as keyof typeof questionnaireData.part2];
                    const visibleCategoryQuestions = categoryQuestions.filter(q => ('condition' in q && typeof q.condition === 'function') ? q.condition(answers) : true);
                    
                    const answeredCount = visibleCategoryQuestions.filter(q => {
                        const answer = answers[q.id];
                        
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
                                  <p className="text-xs text-muted-foreground">No applicable questions.</p>
                                )}
                            </div>
                            {isComplete && <CheckCircle className="text-green-500 h-5 w-5" />}
                        </button>
                    );
                })}
            </div>

            <div className="mt-auto flex-shrink-0 pt-4 border-t border-border">
                <PrimaryButton onClick={() => onSurveyComplete(answers)}>
                    {allQuestionsConsideredAnswered ? 'Submit Survey & Exit' : 'Save Progress & Exit'}
                </PrimaryButton>
            </div>
         </div>
    );
};


export default function StandaloneDiagnosticSurveyPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [initialSurveyAnswers, setInitialSurveyAnswers] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let loadedAnswers: any = {};
        try {
            const onboardingSaved = localStorage.getItem('onboardingAnswers');
            if (onboardingSaved) {
                loadedAnswers = JSON.parse(onboardingSaved);
            }
        } catch (error) {
            console.error("Error loading onboarding answers from localStorage:", error);
        }
        setInitialSurveyAnswers(loadedAnswers);
        setIsLoading(false);
    }, []);

    const handleSurveySubmission = (currentSurveyAnswers: any) => {
        try {
            localStorage.setItem('standaloneSurveyAnswers', JSON.stringify(currentSurveyAnswers));
            toast({
                title: "Progress Saved!",
                description: "Your diagnostic survey answers have been saved.",
            });
        } catch (error) {
            console.error("Error saving survey answers to localStorage:", error);
            toast({
                title: "Error",
                description: "Could not save your survey answers. Please try again.",
                variant: "destructive",
            });
        }
        router.push('/diagnose');
    };

    if (isLoading) {
        return (
            <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-6 bg-app-content">
                <p className="text-muted-foreground">Loading survey...</p>
            </main>
        );
    }

    return (
        <main className="flex flex-1 flex-col p-4 md:p-6 bg-app-content overflow-y-auto">
            <div className="w-full max-w-md mx-auto">
                <Card className="shadow-xl">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                             <div className="flex items-center">
                                <Button variant="ghost" size="icon" className="mr-2" asChild>
                                  <Link href="/diagnose">
                                    <ArrowLeft className="h-5 w-5 text-primary" />
                                  </Link>
                                </Button>
                                <CardTitle className="text-2xl font-headline text-primary">
                                    ZoHealth Survey
                                </CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                       <div className="h-[calc(100vh-10rem-72px)] min-h-[500px]">
                            <DiagnosticSurveyContent 
                                onSurveyComplete={handleSurveySubmission} 
                                initialAnswers={initialSurveyAnswers}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <AiPencilPanel page="diagnose" />
        </main>
    );
}
