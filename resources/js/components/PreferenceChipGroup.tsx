import { cn } from "@/lib/utils"

interface Chip {
  value: string
  label: string
}

interface PreferenceChipGroupProps {
  title: string
  chips: Chip[]
  selected: string[]
  onToggle: (value: string) => void
}

export function PreferenceChipGroup({ title, chips, selected, onToggle }: PreferenceChipGroupProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs font-medium text-muted-foreground">{title}</span>
      <div className="flex flex-wrap gap-2">
        {chips.map(chip => {
          const isSelected = selected.includes(chip.value)
          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => onToggle(chip.value)}
              className={cn(
                "rounded-full border px-4 py-[7px] text-[13px] transition-colors",
                isSelected
                  ? "border-primary bg-primary font-semibold text-white"
                  : "border-border bg-card font-normal text-muted-foreground hover:border-foreground/30"
              )}
            >
              {chip.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
