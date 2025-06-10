
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

// --- Questionnaire Data (Part 2 Only for this standalone page) ---
const questionnaireDataPart2 = {
    'Symptoms & Flares': [
        { id: 'flareFrequency', type: 'single', text: 'How often do you have symptomatic “flares”?', options: ['Never', 'Rarely / Less than once a month', 'Monthly', 'Weekly', 'A few times a week', 'Daily'] },
        { id: 'flareTiming', type: 'multi', text: 'When do your flares typically begin?', options: ['In the morning', 'After meals', 'In the evening / at night', 'During stress or anxiety', 'After exercise', 'No clear pattern'], condition: (answers: any) => answers.flareFrequency !== 'Never' },
        { id: 'flareTriggers', type: 'multi', text: 'What do you suspect triggers your flares?', options: ['Certain foods', 'Alcohol', 'Caffeine', 'Stress', 'Lack of sleep', 'Exercise', 'Medications', 'Hormonal changes'], condition: (answers: any) => answers.flareFrequency !== 'Never' },
        { id: 'systemicSymptoms', type: 'multi', text: 'Which, if any, of these do you regularly experience?', options: ['Brain fog', 'Mood swings / anxiety', 'Fatigue / low energy', 'Frequent headaches'] },
        { id: 'energyLevel', type: 'single', text: 'How would you describe your overall energy level?', options: ['Low', 'Moderate', 'High'] },
        { id: 'externalChanges', type: 'multi', text: 'Have you noticed recent changes in any of the following?', options: ['Skin (e.g., acne, rashes)', 'Hair (e.g., thinning, loss)', 'Nails'] },
        { id: 'libido', type: 'single', text: 'How would you rate your current sex drive / libido?', options: ['Low', 'Moderate', 'High'] }
    ],
    'Diet, Nutrition & Supplements': [
        { id: 'specificDiets', type: 'multi', text: 'Are you currently following any specific diet plan or intermittent fasting protocol?', options: ['Keto / Low Carb', 'Paleo', 'Mediterranean Diet', 'Low FODMAP', 'Time-restricted eating', 'No specific diet or plan', 'Other'] },
        { id: 'calories', type: 'number', text: 'Roughly how many calories do you normally consume on a daily basis?', placeholder: 'e.g., 2000' },
        { id: 'fermentedFoods', type: 'single', text: 'Do you typically eat fermented foods (like yogurt, kimchi, or kombucha)?', options: ['Yes', 'No'] },
        { id: 'processedFoods', type: 'single', text: 'How often do you eat processed foods?', options: ['Rarely', 'Sometimes', 'Often'] },
        { id: 'waterIntake', type: 'number', text: 'About how much water do you drink per day (in ounces)?', placeholder: 'e.g., 64' },
        { id: 'foodAvoidance', type: 'multi', text: 'Are there any foods you actively avoid?', options: ['Gluten', 'Dairy', 'Eggs', 'Red meat', 'Spicy foods', 'Caffeine', 'Alcohol', 'Artificial sweeteners'] },
        { id: 'probioticBrands', type: 'multi', text: 'Which probiotic/prebiotic supplements are you taking?', options: ['Culturelle', 'Align', 'Garden of Life', 'Seed Daily Synbiotic', 'Other'], condition: (answers: any) => answers.probiotics === 'Yes' },
        { id: 'otherSupplements', type: 'multi', text: 'Are you taking any other herbal or nutritional supplements?', options: ['None', 'Multivitamin', 'Vitamin D', 'Magnesium', 'Omega-3 / fish oil', 'Collagen'] }
    ],
    'Lifestyle & Habits': [
        { id: 'sleepHours', type: 'number', text: 'On average, how many hours of sleep do you get per night?', placeholder: 'e.g., 7', condition: (answers: any) => !answers.healthDataSynced?.includes('sleep') },
        { id: 'sleepIssues', type: 'multi', text: 'Which of the following sleep issues do you experience?', options: ['Trouble falling asleep', 'Waking up during the night', 'Not feeling rested upon waking'] },
        { id: 'sleepAids', type: 'single', text: 'Do you use sleep aids?', options: ['Yes', 'No'], condition: (answers: any) => answers.sleepIssues && answers.sleepIssues.length > 0 },
        { id: 'sittingHours', type: 'number', text: 'About how many hours per day do you usually spend sitting?', placeholder: 'e.g., 8' },
        { id: 'weeklyExercise', type: 'single', text: 'How would you describe your typical weekly exercise?', options: ['Mostly sedentary / Little to no formal exercise', 'Light activity (e.g., walking) on some days', 'Moderate exercise (e.g., brisk walking, cycling) 2-3 days a week', 'Moderate exercise 4 or more days a week', 'Vigorous exercise (e.g., running, HIIT) 1-3 days a week', 'A mix of moderate and vigorous exercise on most days'], condition: (answers: any) => !answers.healthDataSynced?.includes('exercise') },
        { id: 'mood', type: 'single', text: 'How would you describe your mood most of the time?', options: ['Positive', 'Neutral', 'Negative'] },
        { id: 'mindfulness', type: 'single', text: 'Do you meditate or practice mindfulness?', options: ['Yes', 'No'] },
        { id: 'relaxation', type: 'single', text: 'How often do you engage in relaxation activities?', options: ['Rarely / never', '1–2 times per week', 'Most days'] },
        { id: 'smoking', type: 'single', text: 'Do you smoke or use tobacco products?', options: ['Yes', 'No'] },
        { id: 'alcohol', type: 'single', text: 'How often do you drink alcohol?', options: ['Never', 'Occasionally / socially', '1–3 times per week', '4+ times per week'] },
        { id: 'recreationalDrugs', type: 'single', text: 'Do you use recreational drugs?', options: ['Never', 'Rarely', 'Occasionally', 'Prefer not to say'] }
    ],
    'Your Health History': [
         { id: 'diagnosedConditions', type: 'multi', text: 'Have you been diagnosed with a gut health condition?', options: ['No diagnosed gut condition', 'IBS', 'IBD', "Crohn’s Disease", 'Ulcerative Colitis', 'GERD / Acid Reflux', 'SIBO', 'Celiac Disease', 'Other'] },
         { id: 'diagnosisYear', type: 'number', text: 'In what year were you first diagnosed?', placeholder: 'YYYY', condition: (answers: any) => answers.diagnosedConditions && !answers.diagnosedConditions.includes('No diagnosed gut condition') && answers.diagnosedConditions.length > 0 },
         { id: 'otherHealthConditions', type: 'multi', text: 'Do you have any other diagnosed health conditions?', options: ['None', 'Pre-diabetes / Insulin resistance', 'Type 2 diabetes', 'Hypertension', 'High cholesterol', 'Autoimmune disorder', 'Other'] },
         { id: 'medications', type: 'multi', text: 'Are you currently taking any medications?', options: ['None', 'Acid reducers', 'Anti-inflammatory drugs', 'Antidepressants', 'Hormonal medications'] },
         { id: 'antibioticsLast6Months', type: 'single', text: 'Have you taken antibiotics in the past 6 months?', options: ['Yes', 'No'] },
         { id: 'remediesTried', type: 'multi', text: 'What remedies have you tried for GI symptoms?', options: ['None', 'OTC medications', 'Probiotics', 'Dietary changes', 'Exercise', 'Stress reduction'], condition: (answers: any) => answers.digestiveSymptomFrequency !== 'Never' && answers.digestiveSymptomFrequency !== undefined }
    ],
    'A Few Final Details': [
         { id: 'age', type: 'number', text: 'What is your age?', placeholder: 'e.g., 35' },
         { id: 'sex', type: 'single', text: 'What is your biological sex?', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
         { id: 'weight', type: 'number', text: 'What is your weight (in lbs)?', placeholder: 'e.g., 150', condition: (answers: any) => !answers.healthDataSynced?.includes('weight') },
         { id: 'height', type: 'text', text: 'What is your height (in ft and inches)?', placeholder: 'e.g., 5\' 10"', condition: (answers: any) => !answers.healthDataSynced?.includes('height') },
         { id: 'livingEnvironment', type: 'single', text: 'Which of these best describes your living environment?', options: ['Urban', 'Suburban', 'Rural'] },
         { id: 'occupation', type: 'text', text: 'What is your current occupation?', placeholder: 'e.g., Software Engineer' },
         { id: 'location', type: 'text', text: 'Where do you live?', placeholder: 'State/Province, Country' }
    ],
};

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
        return questions.filter(q => q.condition ? q.condition(globalAnswers) : true);
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
    const [answers, setAnswers] = useState<any>(initialAnswers);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Update local state if initialAnswers prop changes (e.g., loaded from localStorage)
    useEffect(() => {
        setAnswers(initialAnswers);
    }, [initialAnswers]);

    const allCategories = Object.keys(questionnaireDataPart2);

    const completedCategoriesCount = useMemo(() => {
        return allCategories.filter(catName => {
            const categoryQuestions = questionnaireDataPart2[catName as keyof typeof questionnaireDataPart2];
            const visibleCategoryQuestions = categoryQuestions.filter(q => q.condition ? q.condition(answers) : true);
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
                    questions={questionnaireDataPart2[activeCategory as keyof typeof questionnaireDataPart2]}
                    answers={answers} // Current answers for the active category (though flow uses globalAnswers for conditions)
                    setAnswers={setAnswers} // This updates the global 'answers' state for this page
                    onExitCategory={() => setActiveCategory(null)}
                    globalAnswers={answers} // Pass current survey answers for conditional logic within the flow
                />;
    }

    const allQuestionsConsideredAnswered = completedCategoriesCount === allCategories.length;

    return (
         <div className="p-6 bg-card h-full flex flex-col">
            <p className="text-center text-muted-foreground mb-6">Tap a category to answer questions. Your progress is saved as you go.</p>

            <div className="flex-grow space-y-3 overflow-y-auto pr-2 -mr-2 mb-4">
                {allCategories.map(categoryName => {
                    const categoryQuestions = questionnaireDataPart2[categoryName as keyof typeof questionnaireDataPart2];
                    const visibleCategoryQuestions = categoryQuestions.filter(q => q.condition ? q.condition(answers) : true);
                    
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
        let loadedAnswers = {};
        try {
            const standaloneSaved = localStorage.getItem('standaloneSurveyAnswers');
            if (standaloneSaved) {
                loadedAnswers = JSON.parse(standaloneSaved);
            } else {
                const onboardingSaved = localStorage.getItem('onboardingAnswers');
                if (onboardingSaved) {
                    const allOnboardingAnswers = JSON.parse(onboardingSaved);
                    const part2AnswerKeys = Object.values(questionnaireDataPart2).flat().map(q => q.id);
                    const relevantOnboardingAnswers: any = {};
                    for (const key of part2AnswerKeys) {
                        if (allOnboardingAnswers.hasOwnProperty(key)) {
                            relevantOnboardingAnswers[key] = allOnboardingAnswers[key];
                        }
                    }
                    loadedAnswers = relevantOnboardingAnswers;
                }
            }
        } catch (error) {
            console.error("Error loading survey answers from localStorage:", error);
            // Keep loadedAnswers as {}
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
                                    Diagnostic Survey
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
        </main>
    );
}

