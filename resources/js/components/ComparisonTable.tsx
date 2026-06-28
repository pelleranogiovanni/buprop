import { CircleCheck, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Property {
  listing_id: string
  operation_type: string
  price: number
  currency: string
  property_type: string
  address: string
  bedrooms: number
  bathrooms: number
  covered_m2: number
  city_name: string
  neighborhood_name?: string
  publisher_name: string
}

export interface FitRow {
  listing_id: string
  cells: Record<string, boolean>
}

interface ComparisonTableProps {
  properties: Property[]
  fit?: FitRow[]
}

const FIT_ROWS: { key: string; label: string }[] = [
  { key: "operation_type", label: "Coincide con tipo de operación" },
  { key: "property_type", label: "Coincide con tipo de propiedad" },
  { key: "budget", label: "Dentro del presupuesto" },
  { key: "bedrooms", label: "Coincide con dormitorios buscados" },
  { key: "patio", label: "Tiene patio" },
  { key: "garage", label: "Tiene garaje/cochera" },
  { key: "pets", label: "Cumple preferencia de mascotas" },
]

const propertyTypeLabels: Record<string, string> = {
  house: "Casa",
  apartment: "Departamento",
  commercial: "Local comercial",
}

const operationTypeLabels: Record<string, string> = {
  rent: "Alquiler",
  sale: "Venta",
}

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency === "ARS" ? "ARS" : "USD",
    minimumFractionDigits: 0,
  }).format(price)

type RowDef =
  | { type: "section"; label: string }
  | { type: "row"; label: string; getValue: (p: Property) => string }

const ROWS: RowDef[] = [
  { type: "section", label: "GENERAL" },
  { type: "row", label: "Tipo de operación", getValue: p => operationTypeLabels[p.operation_type] ?? p.operation_type },
  { type: "row", label: "Tipo de propiedad", getValue: p => propertyTypeLabels[p.property_type] ?? p.property_type },
  { type: "row", label: "Precio", getValue: p => formatPrice(p.price, p.currency) },
  { type: "row", label: "Ubicación", getValue: p => [p.neighborhood_name, p.city_name].filter(Boolean).join(", ") },
  { type: "row", label: "Dirección", getValue: p => p.address },
  { type: "section", label: "ESPACIO Y DIMENSIONES" },
  { type: "row", label: "Dormitorios", getValue: p => String(p.bedrooms) },
  { type: "row", label: "Baños", getValue: p => String(p.bathrooms) },
  { type: "row", label: "Superficie cubierta", getValue: p => `${p.covered_m2} m²` },
  { type: "section", label: "PUBLICANTE" },
  { type: "row", label: "Publicado por", getValue: p => p.publisher_name },
]

const LABEL_COL = "w-[200px] shrink-0"

export function ComparisonTable({ properties, fit }: ComparisonTableProps) {
  if (properties.length === 0) return null

  const fitByListing = new Map((fit ?? []).map(f => [f.listing_id, f.cells]))

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <div className="min-w-[640px]">
        {/* Header */}
        <div className="flex rounded-t-xl bg-[#1E3A8A]">
          <div className={cn(LABEL_COL, "px-5 py-3.5")}>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-white/80">
              Criterio
            </span>
          </div>
          {properties.map(p => (
            <div
              key={p.listing_id}
              className="flex-1 border-l border-white/20 px-5 py-3.5"
            >
              <span className="text-[13px] font-semibold text-white">
                {propertyTypeLabels[p.property_type] ?? p.property_type}
              </span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {ROWS.map((row, idx) => {
          if (row.type === "section") {
            return (
              <div key={idx} className="flex border-t border-border bg-muted">
                <div className={cn(LABEL_COL, "px-5 py-2.5")}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {row.label}
                  </span>
                </div>
                {properties.map(p => (
                  <div
                    key={p.listing_id}
                    className="flex-1 border-l border-border py-2.5"
                  />
                ))}
              </div>
            )
          }

          const isEven = ROWS.slice(0, idx).filter(r => r.type === "row").length % 2 === 0

          return (
            <div
              key={idx}
              className={cn(
                "flex border-t border-border",
                isEven ? "bg-card" : "bg-background"
              )}
            >
              <div className={cn(LABEL_COL, "px-5 py-4")}>
                <span className="text-[13px] text-muted-foreground">{row.label}</span>
              </div>
              {properties.map(p => (
                <div
                  key={p.listing_id}
                  className="flex-1 border-l border-border px-5 py-4"
                >
                  <span className="text-[13px] text-foreground">
                    {row.getValue(p)}
                  </span>
                </div>
              ))}
            </div>
          )
        })}

        {/* Ajuste con preferencias */}
        {fitByListing.size > 0 && (
          <>
            <div className="flex border-t border-border bg-primary-light">
              <div className={cn(LABEL_COL, "px-5 py-2.5")}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Ajuste con preferencias
                </span>
              </div>
              {properties.map(p => (
                <div key={p.listing_id} className="flex-1 border-l border-border py-2.5" />
              ))}
            </div>

            {FIT_ROWS.map(row => (
              <div key={row.key} className="flex border-t border-border bg-card">
                <div className={cn(LABEL_COL, "px-5 py-4")}>
                  <span className="text-[13px] text-muted-foreground">{row.label}</span>
                </div>
                {properties.map(p => {
                  const ok = fitByListing.get(p.listing_id)?.[row.key] ?? false
                  return (
                    <div
                      key={p.listing_id}
                      className="flex flex-1 items-center justify-center border-l border-border px-5 py-4"
                    >
                      {ok ? (
                        <CircleCheck className="h-[18px] w-[18px] text-[#059669]" />
                      ) : (
                        <X className="h-[18px] w-[18px] text-[#CBD5E1]" />
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
