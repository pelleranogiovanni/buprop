import { Head } from '@inertiajs/react'
import { FilterPanel } from '@/components/FilterPanel'
import { PropertyGrid } from '@/components/PropertyGrid'
import { NaturalSearchBar } from '@/components/NaturalSearchBar'
import { SearchCriteriaChips } from '@/components/SearchCriteriaChips'
import { ComparisonBar } from '@/components/ComparisonBar'
import { PublicHeader } from '@/components/PublicHeader'
import { AuthenticatedHeader } from '@/components/AuthenticatedHeader'
import { PublicFooter } from '@/components/PublicFooter'

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
    q?: string
  }
  auth: AuthProps
}

export default function Home({ listings, neighborhoods, filters, auth }: HomeProps) {
  const hasActiveFilters = Object.values(filters).some(Boolean)

  return (
    <>
      <Head title="BuProp — Encontrá tu próxima propiedad" />

      <div className="min-h-screen bg-background flex flex-col">
        {auth?.user
          ? <AuthenticatedHeader user={auth.user} />
          : <PublicHeader />
        }

        {/* Hero / Search */}
        <div className="border-b bg-[#0F172A]">
          <div className="mx-auto max-w-screen-xl px-6 py-12 lg:py-20">
            <div className="mb-8 text-center">
              <h1 className="mb-3 text-4xl font-bold leading-tight text-white lg:text-5xl">
                Encontrá tu
                <span className="text-primary"> próxima propiedad</span>
              </h1>
              <p className="text-base text-white/50 lg:text-lg">
                Buscá, compará y contactá propiedades en Villa Ángela
              </p>
            </div>

            <div className="mx-auto max-w-2xl">
              <NaturalSearchBar initialValue={filters.q ?? ""} />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mx-auto max-w-screen-xl w-full flex-1 px-6 py-8">
          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="mb-6">
              <SearchCriteriaChips filters={filters} neighborhoods={neighborhoods} />
            </div>
          )}

          {/* 2-column layout: FilterPanel + Grid */}
          <div className="flex items-start gap-6">
            {/* FilterPanel — desktop sidebar */}
            <aside className="hidden w-[280px] shrink-0 lg:block">
              <FilterPanel neighborhoods={neighborhoods} filters={filters} />
            </aside>

            {/* Results */}
            <div className="min-w-0 flex-1">
              {/* Results count */}
              {listings?.total != null && (
                <div className="mb-5 flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {listings.total.toLocaleString()} propiedades encontradas
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">Villa Ángela, Chaco</span>
                </div>
              )}
              <PropertyGrid listings={listings} />
            </div>
          </div>
        </div>

        <PublicFooter />
      </div>

      {/* Sticky comparison bar */}
      <ComparisonBar />
    </>
  )
}
