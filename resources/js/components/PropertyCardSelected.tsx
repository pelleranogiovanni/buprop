import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import { MapPin, Bed, Bath, Maximize2, X, Check } from "lucide-react"

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
  cover_image?: string
}

interface PropertyCardSelectedProps {
  property: Property
  onRemove: (id: string) => void
}

const propertyTypeLabels: Record<string, string> = {
  house: 'Casa',
  apartment: 'Departamento',
  commercial: 'Local comercial',
}

export function PropertyCardSelected({ property, onRemove }: PropertyCardSelectedProps) {
  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency === 'ARS' ? 'ARS' : 'USD',
      minimumFractionDigits: 0,
    }).format(price)

  const typeLabel = propertyTypeLabels[property.property_type] ?? property.property_type

  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl border-2 border-primary bg-card shadow-sm">
      {/* Selected indicator */}
      <div className="absolute left-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
        <Check className="h-3.5 w-3.5 text-white" />
      </div>

      {/* Remove button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 h-7 w-7 rounded-full bg-white/90 text-foreground shadow-sm hover:bg-white"
        onClick={() => onRemove(property.listing_id)}
        aria-label="Quitar de comparación"
      >
        <X className="h-3.5 w-3.5" />
      </Button>

      {/* Image */}
      <div className="h-36 overflow-hidden">
        <img
          src={property.cover_image || `https://picsum.photos/400/300?random=${property.listing_id}`}
          alt={`${typeLabel} en ${property.city_name}`}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-3">
        <Link href={`/propiedad/${property.listing_id}`}>
          <h4 className="text-sm font-semibold leading-snug text-foreground hover:text-primary transition-colors line-clamp-2">
            {typeLabel} en {property.neighborhood_name || property.city_name}
          </h4>
        </Link>

        <div className="text-sm font-bold text-primary">
          {formatPrice(property.price, property.currency)}
        </div>

        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
          <span className="truncate text-[11px] text-muted-foreground">
            {property.address}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Bed className="h-3 w-3 text-slate-500" />
            <span className="text-[11px] text-slate-500">{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-3 w-3 text-slate-500" />
            <span className="text-[11px] text-slate-500">{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize2 className="h-3 w-3 text-slate-500" />
            <span className="text-[11px] text-slate-500">{property.covered_m2}m²</span>
          </div>
        </div>
      </div>
    </div>
  )
}
