import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Bed, Bath, Square, Home, Calendar, CircleCheck } from "lucide-react"

interface PropertyInfoProps {
  property: {
    operation_type: string
    price: number
    currency: string
    property_type: string
    address: string
    bedrooms: number
    bathrooms: number
    rooms: number
    covered_m2: number
    total_m2: number
    amenities: string[]
    city_name: string
    neighborhood_name?: string
    available_from: string
    requirements: string
  }
}

const propertyTypeLabels: Record<string, string> = {
  house: 'Casa',
  apartment: 'Departamento',
  commercial: 'Local comercial',
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency === 'ARS' ? 'ARS' : 'USD',
      minimumFractionDigits: 0,
    }).format(price)

  const typeLabel = propertyTypeLabels[property.property_type] ?? property.property_type

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-1.5 text-2xl font-bold text-foreground">
          {typeLabel} en {property.operation_type === 'rent' ? 'alquiler' : 'venta'}
          {property.neighborhood_name
            ? ` — ${property.neighborhood_name}`
            : ` — ${property.city_name}`}
        </h1>

        <div className="mb-3 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-primary">
            {formatPrice(property.price, property.currency)}
          </span>
          {property.operation_type === 'rent' && (
            <span className="text-base font-normal text-muted-foreground">/mes</span>
          )}
        </div>

        <div className="mb-3 flex items-center gap-2">
          <Badge
            variant={property.operation_type === 'rent' ? 'rent' : 'sale'}
            className="rounded-full text-[11px]"
          >
            {property.operation_type === 'rent' ? 'Alquiler' : 'Venta'}
          </Badge>
          <Badge variant="secondary" className="text-[11px]">
            {typeLabel}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>
            {property.address}, {property.city_name}
            {property.neighborhood_name && `, ${property.neighborhood_name}`}
          </span>
        </div>
      </div>

      {/* Spec boxes */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
          <Bed className="h-5 w-5 text-primary" />
          <div>
            <div className="font-semibold">{property.bedrooms}</div>
            <div className="text-sm text-muted-foreground">Dormitorios</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
          <Bath className="h-5 w-5 text-primary" />
          <div>
            <div className="font-semibold">{property.bathrooms}</div>
            <div className="text-sm text-muted-foreground">Baños</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
          <Home className="h-5 w-5 text-primary" />
          <div>
            <div className="font-semibold">{property.rooms}</div>
            <div className="text-sm text-muted-foreground">Ambientes</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
          <Square className="h-5 w-5 text-primary" />
          <div>
            <div className="font-semibold">{property.covered_m2}m²</div>
            <div className="text-sm text-muted-foreground">Cubiertos</div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      {property.amenities && property.amenities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comodidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CircleCheck className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm capitalize">
                    {String(amenity).replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground">Superficie total</div>
              <div className="font-semibold">{property.total_m2}m²</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Superficie cubierta</div>
              <div className="font-semibold">{property.covered_m2}m²</div>
            </div>
          </div>

          {property.available_from && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-sm text-muted-foreground">Disponible desde: </span>
                <span className="font-semibold">
                  {new Date(property.available_from).toLocaleDateString('es-AR')}
                </span>
              </div>
            </div>
          )}

          {property.requirements && (
            <div>
              <div className="mb-2 text-sm text-muted-foreground">Requisitos</div>
              <div className="rounded-lg bg-muted p-3 text-sm">
                {property.requirements}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
