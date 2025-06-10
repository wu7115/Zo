
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, ArrowLeft, CheckCircle } from 'lucide-react';

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
  part2: {
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
        { id: 'probioticBrands', type: 'multi', text: 'Which probiotic/prebiotic supplements are you taking?', options: ['Culturelle', 'Align', 'Garden of Life', 'Seed Daily Synbiotic', 'Other'], condition: (answers: any) => answers.probiotics === 'Yes' }, // Assuming 'probiotics' is an ID from Part 1
        { id: 'otherSupplements', type: 'multi', text: 'Are you taking any other herbal or nutritional supplements?', options: ['None', 'Multivitamin', 'Vitamin D', 'Magnesium', 'Omega-3 / fish oil', 'Collagen'] }
    ],
    'Lifestyle & Habits': [
        { id: 'sleepHours', type: 'number', text: 'On average, how many hours of sleep do you get per night?', placeholder: 'e.g., 7' },
        { id: 'sleepIssues', type: 'multi', text: 'Which of the following sleep issues do you experience?', options: ['Trouble falling asleep', 'Waking up during the night', 'Not feeling rested upon waking'] },
        { id: 'sleepAids', type: 'single', text: 'Do you use sleep aids?', options: ['Yes', 'No'], condition: (answers: any) => answers.sleepIssues && answers.sleepIssues.length > 0 },
        { id: 'sittingHours', type: 'number', text: 'About how many hours per day do you usually spend sitting?', placeholder: 'e.g., 8' },
        { id: 'weeklyExercise', type: 'single', text: 'How would you describe your typical weekly exercise?', options: ['Mostly sedentary / Little to no formal exercise', 'Light activity (e.g., walking) on some days', 'Moderate exercise (e.g., brisk walking, cycling) 2-3 days a week', 'Moderate exercise 4 or more days a week', 'Vigorous exercise (e.g., running, HIIT) 1-3 days a week', 'A mix of moderate and vigorous exercise on most days'] },
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
         { id: 'remediesTried', type: 'multi', text: 'What remedies have you tried for GI symptoms?', options: ['None', 'OTC medications', 'Probiotics', 'Dietary changes', 'Exercise', 'Stress reduction'], condition: (answers: any) => answers.digestiveSymptoms && !answers.digestiveSymptoms.includes('None') && answers.digestiveSymptoms.length > 0 } // Assuming 'digestiveSymptoms' is an ID from Part 1
    ],
    'A Few Final Details': [
         { id: 'age', type: 'number', text: 'What is your age?', placeholder: 'e.g., 35' },
         { id: 'sex', type: 'single', text: 'What is your biological sex?', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
         { id: 'weight', type: 'number', text: 'What is your weight (in lbs)?', placeholder: 'e.g., 150' },
         { id: 'height', type: 'text', text: 'What is your height (in ft and inches)?', placeholder: 'e.g., 5\' 10"' },
         { id: 'livingEnvironment', type: 'single', text: 'Which of these best describes your living environment?', options: ['Urban', 'Suburban', 'Rural'] },
         { id: 'occupation', type: 'text', text: 'What is your current occupation?', placeholder: 'e.g., Software Engineer' },
         { id: 'location', type: 'text', text: 'Where do you live?', placeholder: 'State/Province, Country' }
    ],
  }
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

const TextInputQuestionComponent = ({ question, answer, onAnswerChange }: { question: any, answer: string, onAnswerChange: (value: string) => void }) => (
    <div>
        <h3 className="text-xl font-semibold text-primary mb-6">{question.text}</h3>
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
        <h3 className="text-xl font-semibold text-primary mb-6">{question.text}</h3>
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
                if (dynamicOptions.length === 0 && qIndex > 0 && !questions.find(q => q.id === currentQuestion.dependsOn)?.options.includes(answers[currentQuestion.dependsOn])) {
                   return <p className="text-muted-foreground text-center py-4">Please select your primary reasons first to see this question.</p>;
                }
                return <SingleSelectQuestionComponent {...commonProps} question={{...currentQuestion, options: dynamicOptions.length > 0 ? dynamicOptions : ['Please select primary reasons first']}} />;
            default: return <SingleSelectQuestionComponent {...commonProps} />;
        }
    };
    
    const isNextDisabled = currentQuestion.type === 'single-dynamic' && (!answers[currentQuestion.dependsOn] || answers[currentQuestion.dependsOn].length === 0);

    return (
         <div className="p-6 sm:p-8 h-full flex flex-col">
            <h2 className="font-headline text-2xl mb-6 text-center text-primary">Set Your Goals</h2>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">{renderQuestion()}</div>
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
        <PrimaryButton onClick={onComplete}>Continue</PrimaryButton>
    </OnboardingStepContainer>
);

const Part2SurveyIntroComponent = ({ onBeginSurvey, onSkipSurvey }: { onBeginSurvey: () => void, onSkipSurvey: () => void }) => (
    <OnboardingStepContainer className="justify-center">
        <h2 className="font-headline text-2xl text-primary mb-4">Diagnostic Survey</h2>
        <p className="my-4 text-muted-foreground text-lg max-w-md">
            This optional survey helps us fine-tune your recommendations. It typically takes about 10 minutes to complete.
            You can also skip this for now and complete it later from your profile.
        </p>
        <div className="w-full max-w-sm space-y-3 mt-6">
          <PrimaryButton onClick={onBeginSurvey}>Complete Survey Now (est. 10 min)</PrimaryButton>
          <Button variant="outline" onClick={onSkipSurvey} className="w-full h-auto py-3 text-lg border-primary text-primary hover:bg-primary/5">
            Skip for Now & Go to Home
          </Button>
        </div>
    </OnboardingStepContainer>
);


const CategoryQuestionFlowComponent = ({ categoryName, questions, answers, setAnswers, onExitCategory, globalAnswers }: { categoryName: string, questions: any[], answers: any, setAnswers: (newAnswers: any) => void, onExitCategory: () => void, globalAnswers: any }) => {
    const [qIndex, setQIndex] = useState(0);

    const visibleQuestions = useMemo(() => {
        return questions.filter(q => q.condition ? q.condition(globalAnswers) : true);
    }, [questions, globalAnswers]);
    
    const currentQuestion = visibleQuestions[qIndex];

    const handleAnswer = (value: any) => {
        setAnswers((prev: any) => ({ ...prev, [currentQuestion.id]: value }));
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
        const commonProps = { question: currentQuestion, answer: answers[currentQuestion.id], onAnswerChange: handleAnswer };
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
            onExitCategory(); // Exit if no visible questions from the start
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
                <PrimaryButton onClick={handleNext} disabled={!currentQuestion || answers[currentQuestion.id] === undefined || (Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].length === 0)}>
                    {qIndex < visibleQuestions.length - 1 ? 'Next' : 'Finish Category'}
                </PrimaryButton>
                <Button variant="ghost" onClick={onExitCategory} className="w-full text-sm text-muted-foreground p-2 h-auto">Save & Exit Category</Button>
            </div>
        </div>
    );
};


const Part2SurveyComponent = ({ answers, setAnswers, onComplete }: { answers: any, setAnswers: React.Dispatch<React.SetStateAction<any>>, onComplete: () => void }) => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const allCategories = Object.keys(questionnaireData.part2);

    const completedCategoriesCount = useMemo(() => {
        return allCategories.filter(catName => {
            const categoryQuestions = questionnaireData.part2[catName];
            const visibleCategoryQuestions = categoryQuestions.filter(q => q.condition ? q.condition(answers) : true);
            if (visibleCategoryQuestions.length === 0) return true; // Category considered complete if no questions are visible
            return visibleCategoryQuestions.every(q => answers[q.id] !== undefined && (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 || q.options.includes("None") || q.options.includes("No specific diet or plan") : true) );
        }).length;
    }, [answers, allCategories]);


    if (activeCategory) {
        return <CategoryQuestionFlowComponent 
                    categoryName={activeCategory}
                    questions={questionnaireData.part2[activeCategory]}
                    answers={answers} // Pass all answers for conditions
                    setAnswers={setAnswers} // Allow CategoryQuestionFlow to update the main answers state
                    onExitCategory={() => setActiveCategory(null)}
                    globalAnswers={answers} // Pass all answers for conditions
                />;
    }

    const allQuestionsAnswered = completedCategoriesCount === allCategories.length;

    return (
         <div className="p-6 bg-card h-full flex flex-col">
            <h1 className="font-headline text-2xl text-center mb-2 text-primary">Complete Your Diagnostic Survey</h1>
            <p className="text-center text-muted-foreground mb-6">Tap a category to answer questions. Your progress is saved automatically.</p>
            
            <div className="flex-grow space-y-3 overflow-y-auto pr-2 -mr-2 mb-4">
                {/* Placeholder for "View My Current Insights" button */}
                {/* <div className="p-3 bg-secondary rounded-lg text-center cursor-pointer hover:bg-secondary/80 mb-3">
                    <h2 className="font-semibold text-secondary-foreground">View My Current Insights</h2>
                    <p className="text-xs text-muted-foreground">Get AI recommendations based on your answers so far.</p>
                </div> */}

                {allCategories.map(categoryName => {
                    const categoryQuestions = questionnaireData.part2[categoryName];
                    const visibleCategoryQuestions = categoryQuestions.filter(q => q.condition ? q.condition(answers) : true);
                    
                    const answeredCount = visibleCategoryQuestions.filter(q => answers[q.id] !== undefined && (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 || q.options.includes("None") || q.options.includes("No specific diet or plan"): true)).length;
                    const isComplete = visibleCategoryQuestions.length > 0 ? answeredCount === visibleCategoryQuestions.length : true;

                    return (
                        <button 
                            key={categoryName} 
                            onClick={() => setActiveCategory(categoryName)} 
                            className="w-full text-left p-4 border-2 rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors"
                            disabled={visibleCategoryQuestions.length === 0 && !isComplete} // Disable if no questions and not marked complete (e.g. by prior logic)
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
                <PrimaryButton onClick={onComplete}>
                    {allQuestionsAnswered ? 'View My Full Plan & Go to Home' : 'Finish For Now & Go to Home'}
                </PrimaryButton>
            </div>
         </div>
    );
};


export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState('splash'); 
  const [answers, setAnswers] = useState<any>({});

  const handleFinishOnboarding = () => {
    console.log('Onboarding data collected:', answers);
    // Here you would typically send `answers` to your backend/AI
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
      case 'confirmation': return <ConfirmationPageComponent onComplete={() => setCurrentStep('part2_intro')} />;
      case 'part2_intro': 
        return <Part2SurveyIntroComponent 
                    onBeginSurvey={() => setCurrentStep('part2_categories')} 
                    onSkipSurvey={handleFinishOnboarding} 
               />;
      case 'part2_categories': 
        return <Part2SurveyComponent answers={answers} setAnswers={setAnswers} onComplete={handleFinishOnboarding} />;
      default: return <OnboardingStepContainer><p>Loading...</p></OnboardingStepContainer>;
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen bg-gradient-to-br from-accent to-secondary">
      <div className="w-full max-w-md h-screen max-h-[875px] sm:h-[calc(100vh-4rem)] sm:max-h-[875px] bg-background shadow-2xl sm:rounded-2xl flex flex-col overflow-hidden">
        {renderCurrentStep()}
      </div>
    </main>
  );
}
