import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Option {
  value: string
  label: string
}

interface PreferenceCheckboxGroupProps {
  title: string
  options: Option[]
  selected: string[]
  onToggle: (value: string) => void
}

export function PreferenceCheckboxGroup({ title, options, selected, onToggle }: PreferenceCheckboxGroupProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs font-medium text-muted-foreground">{title}</span>
      <div className="flex flex-col gap-2.5">
        {options.map(opt => {
          const isChecked = selected.includes(opt.value)
          return (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => onToggle(opt.value)}
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border-[1.5px] transition-colors",
                  isChecked ? "border-primary bg-primary" : "border-input bg-card"
                )}
              >
                {isChecked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
              </button>
              <span className="text-[13px] text-muted-foreground">{opt.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
