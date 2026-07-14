import React from 'react';

interface StepperProps {
  currentStep: number;
  totalSteps?: number;
  labels?: string[];
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  totalSteps = 4,
  labels = []
}) => {
  return (
    <div className="w-full flex flex-col gap-3 py-2 px-1">
      <div className="flex justify-between items-center text-sm font-bold">
        <span className="text-primary font-heading text-lg">Step {currentStep} of {totalSteps}</span>
        {labels[currentStep - 1] && (
          <span className="text-text-secondary">{labels[currentStep - 1]}</span>
        )}
      </div>
      
      {/* Stepper progress bars */}
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum <= currentStep;
          const isCurrent = stepNum === currentStep;
          
          return (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                isCurrent 
                  ? 'bg-primary' 
                  : isActive 
                    ? 'bg-primary/60' 
                    : 'bg-primary-light border border-primary/10'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
