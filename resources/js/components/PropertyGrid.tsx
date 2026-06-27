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
      <div className="py-16 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <svg className="h-10 w-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 10h10M7 13h10M7 16h10" />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-foreground">
            No encontramos propiedades
          </h3>
          <p className="mb-6 leading-relaxed text-muted-foreground">
            No hay propiedades que coincidan con tus criterios de búsqueda.
            Intenta ajustar los filtros para ver más resultados.
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/properties'}>
            Ver todas las propiedades
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page info */}
      <p className="text-sm text-muted-foreground">
        Página {listings?.current_page || 1} de {listings?.last_page || 1}
      </p>

      {/* Property Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {listings.data.map((property) => (
          <PropertyCard key={property.listing_id} property={property} showCompare />
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
                <span key={index} className="px-3 py-2 text-muted-foreground">
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