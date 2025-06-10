
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, AlertTriangle, Lightbulb } from 'lucide-react';
import { getItemBenefit, type GetItemBenefitInput } from '@/ai/flows/get-item-benefit-flow';

export interface ModalItemData {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  imageHint: string;
  category: string;
}

interface ItemDetailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  item: ModalItemData | null;
  userContext?: string;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ isOpen, onOpenChange, item, userContext = "general wellness" }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && item) {
      const fetchInsight = async () => {
        setIsLoadingAi(true);
        setAiError(null);
        setAiInsight(null);
        try {
          const input: GetItemBenefitInput = {
            itemName: item.name,
            itemCategory: item.category,
            itemDescription: item.description,
            userContext: userContext,
          };
          const result = await getItemBenefit(input);
          setAiInsight(result.benefitExplanation);
        } catch (e: any) {
          console.error("Error fetching AI insight:", e);
          setAiError("Sorry, I couldn't get personalized advice for this item right now.");
        } finally {
          setIsLoadingAi(false);
        }
      };
      fetchInsight();
    }
  }, [isOpen, item, userContext]);

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[392px] bg-card text-card-foreground"> {/* Adjusted max-width */}
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-headline">{item.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="relative w-full aspect-video rounded-md overflow-hidden border">
            <Image
              src={item.imageUrl.replace('171x130', '343x200').replace('171x150', '343x200')} // Attempt to get a larger image
              alt={item.name}
              layout="fill"
              objectFit="cover"
              data-ai-hint={item.imageHint}
            />
          </div>
          {item.description && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-1">Description</h3>
              <DialogDescription className="text-sm text-foreground/90">
                {item.description}
              </DialogDescription>
            </div>
          )}
          <div className="mt-2">
            <h3 className="text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-1 flex items-center">
              <Lightbulb className="w-3.5 h-3.5 mr-1.5 text-accent" />
              How it helps you (from Zoe):
            </h3>
            {isLoadingAi && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground p-3 bg-muted/30 rounded-md">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating personalized insight...</span>
              </div>
            )}
            {aiError && !isLoadingAi && (
              <div className="flex items-start space-x-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>{aiError}</p>
              </div>
            )}
            {!isLoadingAi && !aiError && aiInsight && (
              <p className="text-sm text-secondary-foreground bg-secondary/80 p-3 rounded-md">{aiInsight}</p>
            )}
            {!isLoadingAi && !aiError && !aiInsight && (
                <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-md">No specific insight available at this moment.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
