import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import { MapPin, Bed, Bath, Square, BarChart3 } from "lucide-react"
import { useCompare } from "@/contexts/CompareContext"

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
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare()
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
    <Link href={`/propiedad/${property.listing_id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-md p-0">
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] w-full">
          <img 
            src={property.cover_image || `https://picsum.photos/400/300?random=${property.listing_id}`}
            alt={`${getPropertyTypeLabel(property.property_type)} en ${property.city_name}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/95 backdrop-blur-sm text-gray-900 font-medium shadow-sm border-0">
            {getOperationTypeLabel(property.operation_type)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground font-medium shadow-sm border-0">
            {getPropertyTypeLabel(property.property_type)}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent group-hover:from-black/20 transition-all duration-500" />
      </div>
      
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-start text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
            <span className="line-clamp-2 leading-relaxed">
              {property.address}, {property.city_name}
              {property.neighborhood_name && `, ${property.neighborhood_name}`}
            </span>
          </div>
          
          <div className="text-xl font-bold text-primary">
            {formatPrice(property.price, property.currency)}
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Bed className="w-4 h-4 mr-1 text-gray-400" />
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Bath className="w-4 h-4 mr-1 text-gray-400" />
              <span className="font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Square className="w-4 h-4 mr-1 text-gray-400" />
              <span className="font-medium">{property.covered_m2}m²</span>
            </div>
          </div>
          
          {(() => {
            try {
              let amenities = []
              if (typeof property.amenities === 'string') {
                amenities = JSON.parse(property.amenities)
              } else if (Array.isArray(property.amenities)) {
                amenities = property.amenities
              }
              
              if (!Array.isArray(amenities) || amenities.length === 0) {
                return null
              }
              
              return (
                <div className="flex flex-wrap gap-1.5">
                  {amenities.slice(0, 2).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs font-normal">
                      {String(amenity).replace('_', ' ')}
                    </Badge>
                  ))}
                  {amenities.length > 2 && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      +{amenities.length - 2}
                    </Badge>
                  )}
                </div>
              )
            } catch (e) {
              return null
            }
          })()}
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              <span className="font-medium text-gray-600">{property.publisher_name}</span>
            </div>
            <Button
              variant={isInCompare(property.listing_id) ? "default" : "outline"}
              size="sm"
              disabled={!isInCompare(property.listing_id) && compareList.length >= 3}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (isInCompare(property.listing_id)) {
                  removeFromCompare(property.listing_id)
                } else {
                  addToCompare(property)
                }
              }}
              className="h-7 px-2 text-xs"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              {isInCompare(property.listing_id) ? 'Quitar' : 'Comparar'}
            </Button>
          </div>
        </div>
      </CardContent>
      </Card>
    </Link>
  )
}