import { PropertyCard } from "@/components/PropertyCard"
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

interface PaginatedListings {
  data: Property[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
}

interface PropertyGridProps {
  listings: PaginatedListings
}

export function PropertyGrid({ listings }: PropertyGridProps) {
  if (!listings || !listings.data || listings.data.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 10h10M7 13h10M7 16h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No encontramos propiedades
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            No hay propiedades que coincidan con tus criterios de búsqueda. 
            Intenta ajustar los filtros para ver más resultados.
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Ver todas las propiedades
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {listings?.total?.toLocaleString() || 0} propiedades
          </h2>
          <p className="text-gray-600 mt-1">
            Página {listings?.current_page || 1} de {listings?.last_page || 1}
          </p>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.data.map((property) => (
          <PropertyCard key={property.listing_id} property={property} />
        ))}
      </div>

      {/* Pagination */}
      {listings?.last_page > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          {listings?.links?.map((link, index) => {
            if (link.label.includes('Previous')) {
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  disabled={!link.url}
                  asChild={!!link.url}
                  className="h-10 w-10 p-0"
                >
                  {link.url ? (
                    <Link href={link.url} preserveState>
                      <ChevronLeft className="w-4 h-4" />
                    </Link>
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </Button>
              )
            }
            
            if (link.label.includes('Next')) {
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  disabled={!link.url}
                  asChild={!!link.url}
                  className="h-10 w-10 p-0"
                >
                  {link.url ? (
                    <Link href={link.url} preserveState>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              )
            }
            
            if (link.label === '...') {
              return (
                <span key={index} className="px-3 py-2 text-gray-500">
                  ...
                </span>
              )
            }
            
            return (
              <Button
                key={index}
                variant={link.active ? "default" : "outline"}
                size="sm"
                disabled={!link.url}
                asChild={!!link.url}
                className="h-10 min-w-10"
              >
                {link.url ? (
                  <Link href={link.url} preserveState>
                    {link.label}
                  </Link>
                ) : (
                  link.label
                )}
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}