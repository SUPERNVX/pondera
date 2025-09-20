import React from 'react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepChange?: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, onStepChange }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-secondary-foreground/30 dark:bg-secondary/30 -z-10 transform -translate-y-1/2">
          <div 
            className="h-full bg-primary dark:bg-primary-dark transition-all duration-300" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
        
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div 
              key={stepNumber}
              className={cn(
                "flex flex-col items-center relative z-10",
                onStepChange && "cursor-pointer"
              )}
              onClick={() => onStepChange && onStepChange(stepNumber)}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                isCompleted 
                  ? "bg-primary border-primary text-primary-foreground dark:bg-primary-dark dark:border-primary-dark dark:text-primary-foreground" 
                  : isCurrent
                  ? "border-primary text-primary bg-white dark:bg-secondary-dark dark:text-primary-dark dark:border-primary-dark"
                  : "border-secondary-foreground/50 text-secondary-foreground dark:border-secondary/50 dark:text-secondary-foreground bg-white dark:bg-secondary-dark"
              )}>
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="font-medium">{stepNumber}</span>
                )}
              </div>
              <span className={cn(
                "mt-2 text-sm font-medium text-center w-24",
                isCompleted || isCurrent 
                  ? "text-primary dark:text-primary-dark" 
                  : "text-secondary-foreground dark:text-secondary-foreground"
              )}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;