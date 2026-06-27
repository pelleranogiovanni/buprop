import { useRef } from 'react'
import { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import { Sparkles, Search, SlidersHorizontal, ListFilter } from 'lucide-react'
import { PublicHeader } from '@/components/PublicHeader'
import { AuthenticatedHeader } from '@/components/AuthenticatedHeader'
import { PublicFooter } from '@/components/PublicFooter'
import { PropertyGrid } from '@/components/PropertyGrid'
import { SearchCriteriaChips } from '@/components/SearchCriteriaChips'
import { ComparisonBar } from '@/components/ComparisonBar'
import { FilterPanel } from '@/components/FilterPanel'
import { cn } from '@/lib/utils'

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
  links: Array<{ url: string | null; label: string; active: boolean }>
}

interface Filters {
  operation_type?: string
  property_type?: string
  neighborhood_id?: string
  min_price?: string
  max_price?: string
  bedrooms?: string
  q?: string
  sort?: string
}

interface PropertiesIndexProps {
  listings: PaginatedListings
  neighborhoods: Neighborhood[]
  filters: Filters
  auth: {
    user?: {
      id: number
      name: string
      email: string
      avatar_url?: string
      roles?: Array<{ name: string }>
    } | null
  }
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Menor precio' },
  { value: 'relevance', label: 'Mayor coincidencia' },
]

export default function PropertiesIndex({
  listings,
  neighborhoods,
  filters,
  auth,
}: PropertiesIndexProps) {
  const [searchQuery, setSearchQuery] = useState(filters.q ?? '')
  const activeSort = filters.sort ?? 'newest'
  const hasActiveFilters = Object.values(filters).some(Boolean)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const handleSearch = () => {
    router.get('/properties', { ...filters, q: searchQuery.trim() || undefined })
  }

  const handleSort = (value: string) => {
    router.get('/properties', { ...filters, sort: value }, { preserveScroll: true })
  }

  return (
    <>
      <Head title="Propiedades — BuProp" />

      <div className="flex min-h-screen flex-col bg-[#F8FAFC] pb-20">
        {auth?.user
          ? <AuthenticatedHeader user={auth.user} />
          : <PublicHeader />
        }

        {/* ── Search Section ── */}
        <div
          className="w-full border-b border-border bg-white py-8"
        >
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 px-6">

            {/* Title Row */}
            <div className="flex items-center gap-3">
              <h1 className="text-[26px] font-extrabold text-foreground">
                Resultados de búsqueda
              </h1>
              {listings?.total != null && (
                <span className="rounded-full bg-primary-light px-3 py-1 text-[13px] font-semibold text-primary">
                  {listings.total.toLocaleString('es-AR')} propiedades
                </span>
              )}
            </div>

            {/* Subtitle */}
            <p className="text-sm text-[#475569]">
              Encontramos propiedades según los criterios interpretados de tu consulta.
            </p>

            {/* NaturalSearchBar */}
            <div
              className="flex w-full overflow-hidden rounded-xl border-2 border-primary bg-white"
              style={{ boxShadow: '0 2px 8px #3B5BDB18' }}
            >
              <div className="flex flex-1 items-center gap-2.5 px-4 py-[14px]">
                <Sparkles className="h-[18px] w-[18px] shrink-0 text-primary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Casa en Villa Ángela · Alquiler · 2 dormitorios"
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="flex items-center gap-2 bg-primary px-6 py-[14px] text-sm font-bold text-white transition-colors hover:bg-primary-hover"
                style={{ borderRadius: '0 10px 10px 0' }}
              >
                <Search className="h-[15px] w-[15px]" />
                Buscar
              </button>
            </div>

            {/* Filter link */}
            <button
              type="button"
              onClick={() => sidebarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="flex w-fit items-center gap-1.5 text-[13px] text-[#475569] transition-colors hover:text-foreground"
            >
              <SlidersHorizontal className="h-3 w-3 text-muted-foreground" />
              Usar filtros tradicionales
            </button>

            {/* Active criteria chips */}
            {hasActiveFilters && (
              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-muted-foreground">
                  Criterios detectados en tu búsqueda
                </span>
                <SearchCriteriaChips
                  filters={filters}
                  neighborhoods={neighborhoods}
                  basePath="/properties"
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Results Section ── */}
        <section className="flex w-full flex-1 justify-center py-8 pb-12">
          <div
            ref={sidebarRef}
            className="flex w-full max-w-[1200px] items-start gap-6 px-6"
          >
            {/* FilterPanel sidebar */}
            <FilterPanel initialFilters={filters} basePath="/properties" />

            {/* Results content */}
            <div className="flex min-w-0 flex-1 flex-col gap-5">

              {/* Results bar: count + sort */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <ListFilter className="h-[15px] w-[15px] text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    {(listings?.total ?? 0).toLocaleString('es-AR')} propiedades encontradas
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#475569]">Ordenar por:</span>
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSort(opt.value)}
                      className={cn(
                        'rounded-full border px-3.5 py-[7px] text-[13px] transition-colors',
                        activeSort === opt.value
                          ? 'border-primary bg-primary font-medium text-white'
                          : 'border-border bg-card text-foreground hover:border-primary/40',
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property grid */}
              <PropertyGrid listings={listings} />
            </div>
          </div>
        </section>

        <PublicFooter />
      </div>

      <ComparisonBar />
    </>
  )
}
