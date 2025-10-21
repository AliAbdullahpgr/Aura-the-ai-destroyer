'use client';

import * as React from 'react';
import { Card } from "@/components/ui/card";
import { Progress as ShadcnProgress } from "@/components/ui/progress";
import { ShieldCheck, Heart, BrainCircuit } from "lucide-react";

// Customizing Progress to allow indicator class
const CustomProgress = React.forwardRef<
  React.ElementRef<typeof ShadcnProgress>,
  React.ComponentPropsWithoutRef<typeof ShadcnProgress> & { indicatorClassName?: string }
>(({ indicatorClassName, ...props }, ref) => (
  <ShadcnProgress
    ref={ref}
    {...props}
    // @ts-ignore
    indicatorCustomClassName={indicatorClassName}
  />
))
CustomProgress.displayName = 'Progress'


type StatusBarProps = {
  certainty: number;
  empathy: number;
  logic: number;
};

export function StatusBar({ certainty, empathy, logic }: StatusBarProps) {
  return (
    <Card className="w-full max-w-4xl p-4 bg-black/20 backdrop-blur-sm border-primary/20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-accent" />
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-foreground/80">Certainty</span>
              <span className="font-mono text-accent">{certainty}%</span>
            </div>
            <CustomProgress value={certainty} className="h-2" indicatorClassName="bg-accent" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-accent" />
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-foreground/80">Empathy</span>
              <span className="font-mono text-accent">{empathy}%</span>
            </div>
            <CustomProgress value={empathy} className="h-2" indicatorClassName="bg-accent" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <BrainCircuit className="w-6 h-6 text-accent" />
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-foreground/80">Logic</span>
              <span className="font-mono text-accent">{logic}%</span>
            </div>
            <CustomProgress value={logic} className="h-2" indicatorClassName="bg-accent" />
          </div>
        </div>
      </div>
    </Card>
  );
}
