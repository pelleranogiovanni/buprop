import { Star, MapPin, House, Map, Banknote, Bed } from "lucide-react"

interface PreferencesSummaryCardProps {
  operation_type?: string
  property_type?: string
  location?: string
  max_price?: string
  bedrooms?: string
}

const OPERATION_LABELS: Record<string, string> = { rent: "Alquiler", sale: "Venta" }
const PROPERTY_LABELS: Record<string, string> = {
  house: "Casa",
  apartment: "Departamento",
  land: "Terreno",
  commercial: "Local comercial",
}

function SummaryRow({
  icon: Icon,
  label,
  value,
  alt,
}: {
  icon: React.ElementType
  label: string
  value?: string
  alt?: boolean
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${alt ? "bg-background" : "bg-card"}`}>
      <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
        <span className="text-[13px] font-medium text-foreground">
          {value || <span className="text-muted-foreground/50 italic">Sin especificar</span>}
        </span>
      </div>
    </div>
  )
}

export function PreferencesSummaryCard({
  operation_type,
  property_type,
  location,
  max_price,
  bedrooms,
}: PreferencesSummaryCardProps) {
  const priceLabel = max_price
    ? `Hasta $${Number(max_price).toLocaleString("es-AR")}`
    : undefined

  const bedsLabel = bedrooms ? `${bedrooms} dormitorio${bedrooms === "1" ? "" : "s"}` : undefined

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 rounded-t-[7px] bg-primary px-5 py-3.5">
        <Star className="h-4 w-4 text-white" />
        <span className="text-sm font-semibold text-white">Resumen de tus preferencias</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        <SummaryRow icon={MapPin} label="Operación" value={operation_type ? OPERATION_LABELS[operation_type] : undefined} alt={false} />
        <SummaryRow icon={House} label="Tipo" value={property_type ? PROPERTY_LABELS[property_type] : undefined} alt={true} />
        <SummaryRow icon={Map} label="Ubicación" value={location || undefined} alt={false} />
        <SummaryRow icon={Banknote} label="Presupuesto" value={priceLabel} alt={true} />
        <SummaryRow icon={Bed} label="Dormitorios" value={bedsLabel} alt={false} />
      </div>

      {/* Footer note */}
      <div className="border-t border-border px-4 py-2.5 text-center">
        <p className="text-[12px] text-muted-foreground">
          Este resumen se actualiza según las preferencias seleccionadas.
        </p>
      </div>
    </div>
  )
}
