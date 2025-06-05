
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface ScoreCategoryProps {
  title: string;
  score: number;
  children: React.ReactNode;
  bgColorClass?: string;
}

const ScoreCategoryCard: React.FC<ScoreCategoryProps> = ({ title, score, children, bgColorClass = "bg-muted/30" }) => (
  <Card className={`${bgColorClass} shadow-sm`}>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-baseline">
        <CardTitle className="text-lg font-semibold text-primary">{title}</CardTitle>
        <span className="text-xl font-bold text-primary">{score}</span>
      </div>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

interface SubCategoryBlockProps {
  name: string;
  color: string; // e.g., 'bg-orange-400'
  className?: string;
}

const SubCategoryBlock: React.FC<SubCategoryBlockProps> = ({ name, color, className }) => (
  <div className={`p-3 rounded-lg shadow ${color} ${className}`}>
    <p className="text-xs font-medium text-white text-center">{name}</p>
  </div>
);


export default function GutHealthScoreBreakdownPage() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-app-content overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between mb-1">
              <CardTitle className="text-2xl font-headline text-primary">
                Gut Health Score
              </CardTitle>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/gut-health-score">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            <CardDescription className="text-sm text-muted-foreground pt-0">
              Here's what we looked at to create your score and how you're rated across each category.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScoreCategoryCard title="ZoGut Score" score={28} bgColorClass="bg-orange-100">
              <div className="grid grid-cols-3 gap-3 items-end">
                <SubCategoryBlock name="Microbial Diversity" color="bg-orange-400" className="h-20 flex items-center justify-center" />
              </div>
            </ScoreCategoryCard>

            <ScoreCategoryCard title="Hydration & Diet" score={11} bgColorClass="bg-stone-100">
              <div className="grid grid-cols-3 gap-3 items-end">
                <SubCategoryBlock name="Diet" color="bg-stone-300" className="h-24 flex items-center justify-center" />
                <SubCategoryBlock name="Water Intake" color="bg-stone-300" className="h-16 flex items-center justify-center" />
                <SubCategoryBlock name="Alcohol Consumption" color="bg-stone-300" className="h-20 flex items-center justify-center"/>
              </div>
            </ScoreCategoryCard>

            <ScoreCategoryCard title="Lifestyle & Environment" score={8} bgColorClass="bg-blue-100">
              <div className="grid grid-cols-3 gap-3 items-end">
                <SubCategoryBlock name="Exercise" color="bg-blue-300" className="h-20 flex items-center justify-center" />
                <SubCategoryBlock name="Sleep" color="bg-blue-300" className="h-28 flex items-center justify-center" />
              </div>
            </ScoreCategoryCard>

             <CardDescription className="text-xs text-muted-foreground text-center pt-2">
                Scores and breakdowns are illustrative. Click items for more details (future feature).
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
