import { Link } from "@inertiajs/react"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface Property {
  listing_id: string
  operation_type: string
  price: number
  currency: string
  property_type: string
  address: string
  city_name: string
  neighborhood_name?: string
  cover_image?: string
}

interface ComparisonPropertyCardProps {
  property: Property
  onRemove: (id: string) => void
}

const propertyTypeLabels: Record<string, string> = {
  house: "Casa",
  apartment: "Departamento",
  commercial: "Local comercial",
}

export function ComparisonPropertyCard({ property, onRemove }: ComparisonPropertyCardProps) {
  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency === "ARS" ? "ARS" : "USD",
      minimumFractionDigits: 0,
    }).format(price)

  const typeLabel = propertyTypeLabels[property.property_type] ?? property.property_type

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border-2 border-primary bg-card">
      {/* Image */}
      <div className="relative h-40 overflow-hidden rounded-t-[6px]">
        <img
          src={property.cover_image || `https://picsum.photos/400/300?random=${property.listing_id}`}
          alt={`${typeLabel} en ${property.city_name}`}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-3.5">
        {/* Top row: badge + quitar */}
        <div className="flex items-center justify-between">
          <Badge
            variant={property.operation_type === "rent" ? "rent" : "sale"}
            className="rounded-full text-[11px]"
          >
            {property.operation_type === "rent" ? "Alquiler" : "Venta"}
          </Badge>
          <button
            onClick={() => onRemove(property.listing_id)}
            className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-2.5 w-2.5" />
            Quitar
          </button>
        </div>

        {/* Title */}
        <Link href={`/propiedad/${property.listing_id}`}>
          <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground hover:text-primary transition-colors">
            {typeLabel} — {property.neighborhood_name ?? property.city_name}
          </h4>
        </Link>

        {/* Price */}
        <span className="text-base font-bold text-primary">
          {formatPrice(property.price, property.currency)}
        </span>
      </div>
    </div>
  )
}
