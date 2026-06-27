import { cn } from "@/lib/utils"

interface ChipRowProps {
  label: string
  options: string[]
  value: string
  onSelect: (v: string) => void
}

function ChipRow({ label, options, value, onSelect }: ChipRowProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => {
          const isSelected = value === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(isSelected ? "" : opt)}
              className={cn(
                "rounded-full border px-4 py-[7px] text-[13px] transition-colors",
                isSelected
                  ? "border-primary bg-primary font-semibold text-white"
                  : "border-border bg-card font-normal text-muted-foreground hover:border-foreground/30"
              )}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface PreferencesFormSectionProps {
  bedrooms: string
  bathrooms: string
  rooms: string
  onChange: (key: "bedrooms" | "bathrooms" | "rooms", value: string) => void
}

export function PreferencesFormSection({ bedrooms, bathrooms, rooms, onChange }: PreferencesFormSectionProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
      <h3 className="text-sm font-semibold text-foreground">Características principales</h3>
      <div className="flex flex-col gap-6">
        <ChipRow
          label="Dormitorios"
          options={["1", "2", "3", "4+"]}
          value={bedrooms}
          onSelect={v => onChange("bedrooms", v)}
        />
        <ChipRow
          label="Baños"
          options={["1", "2", "3+"]}
          value={bathrooms}
          onSelect={v => onChange("bathrooms", v)}
        />
        <ChipRow
          label="Ambientes"
          options={["1", "2", "3", "4+"]}
          value={rooms}
          onSelect={v => onChange("rooms", v)}
        />
      </div>
    </div>
  )
}
