import { X } from "lucide-react"
import { router } from "@inertiajs/react"

interface Filters {
  operation_type?: string
  property_type?: string
  neighborhood_id?: string
  min_price?: string
  max_price?: string
  bedrooms?: string
  q?: string
}

interface Neighborhood {
  neighborhood_id: string
  name: string
}

interface SearchCriteriaChipsProps {
  filters: Filters
  neighborhoods?: Neighborhood[]
}

const OPERATION_LABELS: Record<string, string> = {
  rent: "Alquiler",
  sale: "Venta",
}

const PROPERTY_LABELS: Record<string, string> = {
  house: "Casa",
  apartment: "Departamento",
  commercial: "Local comercial",
}

const BEDROOM_LABEL: Record<string, string> = {
  "1": "1 dorm.",
  "2": "2 dorm.",
  "3": "3 dorm.",
  "4": "4+ dorm.",
}

export function SearchCriteriaChips({ filters, neighborhoods = [] }: SearchCriteriaChipsProps) {
  const chips: { key: keyof Filters; label: string }[] = []

  if (filters.q) chips.push({ key: "q", label: `"${filters.q}"` })
  if (filters.operation_type) chips.push({ key: "operation_type", label: OPERATION_LABELS[filters.operation_type] ?? filters.operation_type })
  if (filters.property_type) chips.push({ key: "property_type", label: PROPERTY_LABELS[filters.property_type] ?? filters.property_type })
  if (filters.neighborhood_id) {
    const n = neighborhoods.find(n => n.neighborhood_id === filters.neighborhood_id)
    chips.push({ key: "neighborhood_id", label: n?.name ?? "Zona seleccionada" })
  }
  if (filters.min_price) chips.push({ key: "min_price", label: `Desde $${Number(filters.min_price).toLocaleString("es-AR")}` })
  if (filters.max_price) chips.push({ key: "max_price", label: `Hasta $${Number(filters.max_price).toLocaleString("es-AR")}` })
  if (filters.bedrooms) chips.push({ key: "bedrooms", label: BEDROOM_LABEL[filters.bedrooms] ?? `${filters.bedrooms} dorm.` })

  if (chips.length === 0) return null

  const removeFilter = (key: keyof Filters) => {
    const next = { ...filters, [key]: undefined }
    Object.keys(next).forEach(k => next[k as keyof Filters] === undefined && delete next[k as keyof Filters])
    router.get("/", next, { preserveState: true, preserveScroll: true })
  }

  const clearAll = () => {
    router.get("/", {}, { preserveState: true, preserveScroll: true })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[13px] text-muted-foreground shrink-0">Filtros activos:</span>

      {chips.map(chip => (
        <button
          key={chip.key}
          onClick={() => removeFilter(chip.key)}
          className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-[5px] transition-opacity hover:opacity-90"
        >
          <span className="text-xs font-medium text-white">{chip.label}</span>
          <X className="h-2.5 w-2.5 text-white" />
        </button>
      ))}

      <button
        onClick={clearAll}
        className="rounded-full border border-border px-3 py-[5px] text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
      >
        Limpiar todo
      </button>
    </div>
  )
}
