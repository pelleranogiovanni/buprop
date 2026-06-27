import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import { MapPin, Bed, Bath, Maximize2, GitCompare, Check } from "lucide-react"
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
  showCompare?: boolean
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

export function PropertyCard({ property, status = 'active', showCompare = false }: PropertyCardProps) {
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare()

  const formatPrice = (price: number, currency: string, operationType: string) => {
    const n = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0 }).format(price)
    const prefix = currency === 'USD' ? 'USD ' : 'AR$ '
    const suffix = operationType === 'rent' ? '/mes' : ''
    return `${prefix}${n}${suffix}`
  }

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
      <Link href={`/properties/${property.listing_id}`} className="relative block h-48 overflow-hidden">
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
          <span className="rounded-lg bg-black/80 px-3 py-1.5 text-base font-bold text-white">
            {formatPrice(property.price, property.currency, property.operation_type)}
          </span>
        </div>
      </Link>

      {/* Card content */}
      <div className="flex flex-col gap-3 p-4">
        {/* Title */}
        <Link href={`/properties/${property.listing_id}`}>
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
            <Bed className="h-3.5 w-3.5 text-[#475569]" />
            <span className="text-xs text-[#475569]">{property.bedrooms} dorm.</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5 text-[#475569]" />
            <span className="text-xs text-[#475569]">{property.bathrooms} baños</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize2 className="h-3.5 w-3.5 text-[#475569]" />
            <span className="text-xs text-[#475569]">{property.covered_m2} m²</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Badge variant={status} className="rounded-full text-[11px]">
            {statusLabels[status]}
          </Badge>
          <Button size="sm" className="h-8 px-3.5 text-xs font-semibold" asChild>
            <Link href={`/properties/${property.listing_id}`}>Ver detalle</Link>
          </Button>
        </div>

        {/* Compare action — only on results page */}
        {showCompare && (
          <button
            type="button"
            onClick={() => inCompare ? removeFromCompare(property.listing_id) : addToCompare(property)}
            disabled={!inCompare && !canAdd}
            className={cn(
              'flex w-full items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-colors',
              inCompare
                ? 'border-primary bg-primary-light text-primary hover:bg-primary-light/70'
                : canAdd
                  ? 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                  : 'cursor-not-allowed border-border text-muted-foreground/40',
            )}
          >
            {inCompare ? (
              <>
                <Check className="h-3 w-3" />
                En comparación
              </>
            ) : (
              <>
                <GitCompare className="h-3 w-3" />
                Agregar a comparación
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
