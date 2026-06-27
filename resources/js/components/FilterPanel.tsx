import { useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { router } from "@inertiajs/react"
import { cn } from "@/lib/utils"

interface Neighborhood {
  neighborhood_id: string
  name: string
}

interface Filters {
  operation_type?: string
  property_type?: string
  neighborhood_id?: string
  min_price?: string
  max_price?: string
  bedrooms?: string
  q?: string
}

interface FilterPanelProps {
  neighborhoods: Neighborhood[]
  filters: Filters
}

const OPERATION_TYPES = [
  { value: "sale", label: "Venta" },
  { value: "rent", label: "Alquiler" },
]

const PROPERTY_TYPES = [
  { value: "house", label: "Casa" },
  { value: "apartment", label: "Departamento" },
  { value: "commercial", label: "Oficina / Local" },
]

const BEDROOM_OPTIONS = ["1", "2", "3", "4"] as const

function FilterCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <span
        onClick={() => onChange(!checked)}
        className={cn(
          "flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded border-[1.5px] transition-colors",
          checked
            ? "border-primary bg-primary"
            : "border-input bg-card"
        )}
      >
        {checked && (
          <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 10 10">
            <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-[13px] text-muted-foreground">{label}</span>
    </label>
  )
}

export function FilterPanel({ neighborhoods, filters }: FilterPanelProps) {
  const [local, setLocal] = useState<Filters>(filters)

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setLocal(prev => ({ ...prev, [key]: value }))

  const toggle = (key: "operation_type" | "property_type", value: string) => {
    setLocal(prev => ({ ...prev, [key]: prev[key] === value ? undefined : value }))
  }

  const handleApply = () => {
    const params = Object.fromEntries(
      Object.entries(local).filter(([, v]) => v !== undefined && v !== "")
    )
    router.get("/", params, { preserveState: true, preserveScroll: true })
  }

  const handleClear = () => {
    setLocal({})
    router.get("/", {}, { preserveState: true, preserveScroll: true })
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-foreground" />
          <span className="text-[15px] font-semibold text-foreground">Filtros</span>
        </div>
        <button
          onClick={handleClear}
          className="rounded-sm px-2 py-1 text-xs text-primary hover:underline"
        >
          Limpiar
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col divide-y divide-border">
        {/* Tipo de operación */}
        <div className="flex flex-col gap-3 px-5 py-4">
          <span className="text-[13px] font-semibold text-foreground">Tipo de operación</span>
          {OPERATION_TYPES.map(op => (
            <FilterCheckbox
              key={op.value}
              label={op.label}
              checked={local.operation_type === op.value}
              onChange={() => toggle("operation_type", op.value)}
            />
          ))}
        </div>

        {/* Tipo de propiedad */}
        <div className="flex flex-col gap-3 px-5 py-4">
          <span className="text-[13px] font-semibold text-foreground">Tipo de propiedad</span>
          {PROPERTY_TYPES.map(pt => (
            <FilterCheckbox
              key={pt.value}
              label={pt.label}
              checked={local.property_type === pt.value}
              onChange={() => toggle("property_type", pt.value)}
            />
          ))}
        </div>

        {/* Rango de precio */}
        <div className="flex flex-col gap-3 px-5 py-4">
          <span className="text-[13px] font-semibold text-foreground">Rango de precio</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Mín"
              value={local.min_price ?? ""}
              onChange={e => set("min_price", e.target.value || undefined)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
            <span className="text-muted-foreground">—</span>
            <input
              type="number"
              placeholder="Máx"
              value={local.max_price ?? ""}
              onChange={e => set("max_price", e.target.value || undefined)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Dormitorios */}
        <div className="flex flex-col gap-3 px-5 py-4">
          <span className="text-[13px] font-semibold text-foreground">Dormitorios</span>
          <div className="flex items-center gap-2">
            {BEDROOM_OPTIONS.map(n => (
              <button
                key={n}
                onClick={() => set("bedrooms", local.bedrooms === n ? undefined : n)}
                className={cn(
                  "flex-1 rounded-full border py-1.5 text-xs transition-colors",
                  local.bedrooms === n
                    ? "border-primary bg-primary text-white"
                    : "border-input bg-card text-muted-foreground hover:border-foreground/30"
                )}
              >
                {n === "4" ? "4+" : n}
              </button>
            ))}
          </div>
        </div>

        {/* Neighborhood (hidden but preserved from URL) */}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 py-4">
        <button
          onClick={handleApply}
          className="w-full rounded-md bg-primary py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  )
}
