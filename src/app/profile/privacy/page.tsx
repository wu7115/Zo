
'use client';

import Link from 'next/link';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function ProfilePrivacyPage() {
  const [selectedPrivacyOption, setSelectedPrivacyOption] = React.useState('on-phone-wallet');

  const privacyOptions = [
    {
      id: 'on-phone-wallet',
      label: 'Keep my data encrypted and confidential in my personal on-phone wallet.',
      description: 'Anonymized attribution collected for AI personalization and improving recommendations for the Zo community.',
    },
    {
      id: 'share-connections-only',
      label: 'Share my non-medical data only with those I connect with.',
      description: 'This includes users you follow or those who you allow to follow you.',
    },
  ];

  const handleSaveChanges = () => {
    // In a real app, this would save the selectedPrivacyOption
    console.log('Selected privacy option:', selectedPrivacyOption);
    alert('Privacy settings saved (mock)!');
  };

  const handleDeleteData = () => {
    // In a real app, this would likely trigger a confirmation modal
    console.log('Delete data requested');
    alert('Delete data action triggered (mock)!');
  };

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-app-content overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="mr-2" asChild>
                  <Link href="/profile">
                    <ArrowLeft className="h-5 w-5 text-primary" />
                  </Link>
                </Button>
                <CardTitle className="text-xl font-headline text-primary">
                  Privacy Settings
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={selectedPrivacyOption}
              onValueChange={setSelectedPrivacyOption}
              className="space-y-4"
            >
              {privacyOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                  <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                  <div className="grid gap-1.5 leading-snug">
                    <Label htmlFor={option.id} className="font-semibold text-primary cursor-pointer">
                      {option.label}
                    </Label>
                    <CardDescription className="text-xs text-muted-foreground">
                      {option.description}
                    </CardDescription>
                  </div>
                </div>
              ))}
            </RadioGroup>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-destructive flex items-center mb-2">
                <ShieldAlert className="h-5 w-5 mr-2" /> Data Deletion
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Permanently delete all your personal data from Podium. This action cannot be undone.
              </p>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDeleteData}
              >
                Delete My Data
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button className="w-full" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
