import { Fragment } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StepConfig {
  label: string
  state: "completed" | "active" | "pending"
}

interface OnboardingStepperProps {
  steps: StepConfig[]
}

export function OnboardingStepper({ steps }: OnboardingStepperProps) {
  return (
    <div className="flex items-start">
      {steps.map((step, index) => (
        <Fragment key={step.label}>
          {/* Step */}
          <div className="flex flex-col items-center gap-1.5">
            {/* Circle */}
            {step.state === "completed" ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-primary">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
            ) : step.state === "active" ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-card">
                <span className="text-[13px] font-semibold text-primary">{index + 1}</span>
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background">
                <span className="text-[13px] font-semibold text-muted-foreground">{index + 1}</span>
              </div>
            )}

            {/* Label */}
            <span
              className={cn(
                "text-[11px]",
                step.state === "active"
                  ? "font-semibold text-primary"
                  : "font-normal text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "mt-4 h-0.5 w-14 shrink-0",
                step.state === "completed" ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </Fragment>
      ))}
    </div>
  )
}
