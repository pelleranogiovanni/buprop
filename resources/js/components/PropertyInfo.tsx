import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Bed, Bath, Square, Home, Calendar } from "lucide-react"

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

export function PropertyInfo({ property }: PropertyInfoProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency === 'ARS' ? 'ARS' : 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getPropertyTypeLabel = (type: string) => {
    const types = {
      house: 'Casa',
      apartment: 'Departamento',
      commercial: 'Local comercial'
    }
    return types[type as keyof typeof types] || type
  }

  const getOperationTypeLabel = (type: string) => {
    return type === 'rent' ? 'Alquiler' : 'Venta'
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="secondary" className="text-sm">
            {getOperationTypeLabel(property.operation_type)}
          </Badge>
          <Badge className="text-sm">
            {getPropertyTypeLabel(property.property_type)}
          </Badge>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {formatPrice(property.price, property.currency)}
        </h1>
        
        <div className="flex items-center text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2" />
          <span>
            {property.address}, {property.city_name}
            {property.neighborhood_name && `, ${property.neighborhood_name}`}
          </span>
        </div>
      </div>

      {/* Características principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
          <Bed className="w-5 h-5 text-primary" />
          <div>
            <div className="font-semibold">{property.bedrooms}</div>
            <div className="text-sm text-muted-foreground">Dormitorios</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
          <Bath className="w-5 h-5 text-primary" />
          <div>
            <div className="font-semibold">{property.bathrooms}</div>
            <div className="text-sm text-muted-foreground">Baños</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
          <Home className="w-5 h-5 text-primary" />
          <div>
            <div className="font-semibold">{property.rooms}</div>
            <div className="text-sm text-muted-foreground">Ambientes</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
          <Square className="w-5 h-5 text-primary" />
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
            <CardTitle className="text-lg">Comodidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm capitalize">
                    {String(amenity).replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Calendar className="w-4 h-4 text-muted-foreground" />
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
              <div className="text-sm text-muted-foreground mb-2">Requisitos</div>
              <div className="text-sm bg-secondary/30 p-3 rounded-lg">
                {property.requirements}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}