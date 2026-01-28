import React from "react";
import { Check, Circle } from "lucide-react";

interface StepTrackerProps {
  currentStatus: string;
}

const STEPS = [
  { id: "pending", label: "Request Sent" },
  { id: "awaiting_payment", label: "Approved" },
  { id: "paid", label: "Paid" },
  { id: "in_possession", label: "Handover" },
  { id: "returned", label: "Returned" },
];

export function StepTracker({ currentStatus }: StepTrackerProps) {
  // Determine current step index
  let currentIndex = STEPS.findIndex((s) => s.id === currentStatus);

  // Handle edge cases
  if (currentStatus === "overdue") currentIndex = 3; // Treat as "In Possession" stage visually, but maybe red?
  if (currentStatus === "cancelled")
    return (
      <div className="w-full bg-destructive/10 text-destructive p-4 rounded-lg text-center font-medium border border-destructive/20">
        This booking has been cancelled.
      </div>
    );

  if (currentIndex === -1) currentIndex = 0; // Default or fallback

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between w-full">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted z-0 rounded-full" />

        {/* Active Line Progress */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 rounded-full transition-all duration-500"
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300
                  ${isCompleted ? "bg-primary border-primary text-primary-foreground" : ""}
                  ${isCurrent ? "bg-background border-primary text-primary ring-4 ring-primary/20" : ""}
                  ${isFuture ? "bg-background border-muted text-muted-foreground" : ""}
                `}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Circle
                    className={`h-3 w-3 ${isCurrent ? "fill-current" : ""}`}
                  />
                )}
              </div>
              <span
                className={`
                  absolute top-10 text-xs font-medium whitespace-nowrap
                  ${isCurrent ? "text-primary font-bold" : "text-muted-foreground"}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-6" /> {/* Spacing for labels */}
    </div>
  );
}
