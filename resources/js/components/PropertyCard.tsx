import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import { MapPin, Bed, Bath, Maximize2, BarChart3 } from "lucide-react"
import { useCompare } from "@/contexts/CompareContext"
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
  amenities: string[] | string | null
  city_name: string
  neighborhood_name?: string
  publisher_name: string
  cover_image?: string
}

interface PropertyCardProps {
  property: Property
  status?: 'active' | 'reserved' | 'inactive' | 'sold'
}

const statusLabels: Record<string, string> = {
  active: 'Disponible',
  reserved: 'Reservado',
  inactive: 'No disponible',
  sold: 'Vendido',
}

const propertyTypeLabels: Record<string, string> = {
  house: 'Casa',
  apartment: 'Departamento',
  commercial: 'Local comercial',
}

export function PropertyCard({ property, status }: PropertyCardProps) {
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare()

  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency === 'ARS' ? 'ARS' : 'USD',
      minimumFractionDigits: 0,
    }).format(price)

  const typeLabel = propertyTypeLabels[property.property_type] ?? property.property_type
  const inCompare = isInCompare(property.listing_id)
  const canAdd = compareList.length < 3

  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border shadow-sm overflow-hidden transition-shadow hover:shadow-md",
        inCompare && "ring-2 ring-primary ring-offset-1"
      )}
    >
      {/* Image area */}
      <Link href={`/propiedad/${property.listing_id}`} className="relative block h-48 overflow-hidden">
        <img
          src={property.cover_image || `https://picsum.photos/400/300?random=${property.listing_id}`}
          alt={`${typeLabel} en ${property.city_name}`}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />

        {/* Operation badge — pill, top-left */}
        <div className="absolute left-3 top-3">
          <Badge
            variant={property.operation_type === 'rent' ? 'rent' : 'sale'}
            className="rounded-full text-[11px] font-semibold"
          >
            {property.operation_type === 'rent' ? 'Alquiler' : 'Venta'}
          </Badge>
        </div>

        {/* Price overlay — bottom-left */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-lg bg-black/75 px-2.5 py-1 text-base font-bold text-white">
            {formatPrice(property.price, property.currency)}
          </span>
        </div>
      </Link>

      {/* Card content */}
      <div className="flex flex-col gap-3 p-4">
        {/* Title */}
        <Link href={`/propiedad/${property.listing_id}`}>
          <h3 className="text-[15px] font-semibold leading-snug text-foreground transition-colors hover:text-primary">
            {typeLabel} en {property.neighborhood_name || property.city_name}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate text-xs text-muted-foreground">
            {property.address}, {property.city_name}
          </span>
        </div>

        {/* Features row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs text-slate-500">{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs text-slate-500">{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize2 className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs text-slate-500">{property.covered_m2}m²</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          {/* Status badge (optional) */}
          <div>
            {status && (
              <Badge variant={status} className="rounded-full text-[11px]">
                {statusLabels[status]}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-7 w-7", inCompare && "text-primary")}
              disabled={!inCompare && !canAdd}
              onClick={() => (inCompare ? removeFromCompare(property.listing_id) : addToCompare(property))}
              title={inCompare ? 'Quitar del comparador' : 'Agregar al comparador'}
            >
              <BarChart3 className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" className="h-7 px-3 text-xs" asChild>
              <Link href={`/propiedad/${property.listing_id}`}>Contactar</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
