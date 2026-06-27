import { Link } from "@inertiajs/react"
import { GitCompare, Trash2, X } from "lucide-react"
import { useCompare } from "@/contexts/CompareContext"

interface ComparisonBarProps {
  mode?: "default" | "compare"
}

const propertyTypeLabels: Record<string, string> = {
  house: "Casa",
  apartment: "Depto.",
  commercial: "Local",
}

export function ComparisonBar({ mode = "default" }: ComparisonBarProps) {
  const { compareList, removeFromCompare, clearCompare } = useCompare()

  if (compareList.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-6 border-t border-white/10 bg-sidebar px-6 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.13)]">
      {/* Left: title + pills + counter */}
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-center gap-2">
          <GitCompare className="h-[18px] w-[18px] shrink-0 text-primary" />
          <span className="text-sm font-bold text-white">Modo comparación</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {compareList.map(p => (
            <div
              key={p.listing_id}
              className="flex items-center gap-2 rounded-md bg-white/[0.08] px-3 py-1.5"
            >
              <span className="h-2 w-2 shrink-0 rounded-sm bg-primary" />
              <span className="text-xs font-medium text-white truncate max-w-[120px]">
                {propertyTypeLabels[p.property_type] ?? p.property_type} — {p.neighborhood_name ?? p.city_name}
              </span>
              <button
                onClick={() => removeFromCompare(p.listing_id)}
                className="shrink-0 text-white/40 hover:text-white/80 transition-colors"
                aria-label="Quitar"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}
          <span className="text-[13px] text-white/40">
            {compareList.length} de 3 propiedades
          </span>
        </div>
      </div>

      {/* Right: clear + compare CTA */}
      <div className="flex shrink-0 items-center gap-2.5">
        <button
          onClick={clearCompare}
          className="flex items-center gap-1.5 rounded-md border border-white/20 px-4 py-2.5 text-[13px] font-medium text-white/40 transition-colors hover:text-white/70"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Limpiar selección</span>
        </button>

        {mode === "default" && (
          <Link
            href="/comparador"
            className="flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
          >
            <GitCompare className="h-3.5 w-3.5" />
            Comparar propiedades
          </Link>
        )}
      </div>
    </div>
  )
}
