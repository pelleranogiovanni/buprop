import { Head } from '@inertiajs/react'
import { PropertyFilters } from '@/components/PropertyFilters'
import { PropertyGrid } from '@/components/PropertyGrid'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

interface Neighborhood {
  neighborhood_id: string
  name: string
}

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
  amenities: string[]
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



interface AuthProps {
  user?: {
    id: number
    name: string
    email: string
    avatar_url?: string
    roles?: Array<{ name: string }>
  } | null
}

interface HomeProps {
  listings: PaginatedListings
  neighborhoods: Neighborhood[]
  filters: {
    operation_type?: string
    property_type?: string
    neighborhood_id?: string
    min_price?: string
    max_price?: string
    bedrooms?: string
  }
  auth: AuthProps
}

export default function Home({ listings, neighborhoods, filters, auth }: HomeProps) {
  return (
    <>
      <Head title="Mi Alquiler - Encuentra tu hogar ideal" />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar user={auth?.user} />
        
        {/* Hero Section */}
        <div className="bg-background border-b">
          <div className="container mx-auto px-6 py-12 lg:py-20">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Encuentra tu
                <span className="text-primary"> hogar ideal</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Descubre las mejores propiedades en Villa Ángela y alrededores con nuestra plataforma moderna y fácil de usar
              </p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <PropertyFilters neighborhoods={neighborhoods} filters={filters} />
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="container mx-auto px-6 py-8 lg:py-12 flex-1">
          <PropertyGrid listings={listings} />
        </div>
        
        <Footer />
      </div>
    </>
  )
}