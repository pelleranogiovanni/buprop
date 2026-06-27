import { useState, useRef } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import {
  Search, SlidersHorizontal, House, Building2, Banknote, MapPin,
  ChevronDown, ArrowRight, HousePlus, Sparkles, GitCompare, Plus,
} from 'lucide-react'
import { PublicHeader } from '@/components/PublicHeader'
import { AuthenticatedHeader } from '@/components/AuthenticatedHeader'
import { PublicFooter } from '@/components/PublicFooter'
import { PropertyCard } from '@/components/PropertyCard'
import { PropertyGrid } from '@/components/PropertyGrid'
import { SearchCriteriaChips } from '@/components/SearchCriteriaChips'
import { ComparisonBar } from '@/components/ComparisonBar'
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

const BENEFITS = [
  {
    Icon: House,
    iconBg: '#EEF2FF',
    iconColor: '#3B5BDB',
    title: 'Publicaciones organizadas',
    desc: 'Cada propiedad tiene foto, precio, ambientes, estado y condiciones en un solo lugar. Sin información dispersa ni confusa.',
  },
  {
    Icon: Sparkles,
    iconBg: '#F3EEFF',
    iconColor: '#7C3AED',
    title: 'Búsqueda por lenguaje natural',
    desc: 'Escribí en tus propias palabras lo que buscás y nuestro sistema inteligente encuentra las propiedades más compatibles.',
  },
  {
    Icon: GitCompare,
    iconBg: '#ECFDF5',
    iconColor: '#059669',
    title: 'Comparación de propiedades',
    desc: 'Comparás hasta 3 propiedades lado a lado para decidir con información clara sobre precio, características y disponibilidad.',
  },
]

function FilterCell({
  icon: Icon,
  label,
  value,
  noBorder,
  children,
}: {
  icon: React.ElementType
  label: string
  value: string
  noBorder?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className={cn(
      'relative flex flex-1 flex-col gap-1 px-5 py-4',
      !noBorder && 'border-r border-[#E2E8F0]',
    )}>
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-[#3B5BDB]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#94A3B8]">{label}</span>
      </div>
      <div className="flex items-center justify-between gap-1">
        <span className="truncate text-sm font-medium text-[#0F172A]">{value}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" />
      </div>
      {children}
    </div>
  )
}

export default function Home({ listings, neighborhoods, filters, auth }: HomeProps) {
  const hasActiveFilters = Object.values(filters).some(Boolean)

  const [heroQuery, setHeroQuery] = useState(filters.q ?? '')
  const [op, setOp] = useState(filters.operation_type ?? '')
  const [propType, setPropType] = useState(filters.property_type ?? '')
  const [minPrice, setMinPrice] = useState(filters.min_price ?? '')
  const [maxPrice, setMaxPrice] = useState(filters.max_price ?? '')
  const [zone, setZone] = useState(filters.neighborhood_id ?? '')
  const [showPricePopover, setShowPricePopover] = useState(false)

  const filtersBarRef = useRef<HTMLDivElement>(null)
  const propertiesRef = useRef<HTMLElement>(null)

  const opLabel = op === 'rent' ? 'Alquiler' : op === 'sale' ? 'Venta' : 'Alquiler / Venta'
  const typeLabel =
    propType === 'house' ? 'Casa' :
    propType === 'apartment' ? 'Departamento' :
    propType === 'commercial' ? 'Local comercial' :
    'Casa / Departamento / Local'
  const priceLabel = minPrice || maxPrice
    ? `$${minPrice || '0'} – $${maxPrice || '∞'}`
    : '$0 – sin límite'
  const zoneLabel = zone
    ? (neighborhoods.find(n => n.neighborhood_id === zone)?.name ?? 'Todos los barrios')
    : 'Todos los barrios'

  const handleHeroSearch = () => {
    if (heroQuery.trim()) router.get('/', { q: heroQuery })
  }

  const handleApplyFilters = () => {
    const params: Record<string, string> = {}
    if (op) params.operation_type = op
    if (propType) params.property_type = propType
    if (minPrice) params.min_price = minPrice
    if (maxPrice) params.max_price = maxPrice
    if (zone) params.neighborhood_id = zone
    router.get('/', params)
  }

  return (
    <>
      <Head title="BuProp — Encontrá tu próxima propiedad" />

      <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
        {auth?.user
          ? <AuthenticatedHeader user={auth.user} />
          : <PublicHeader />
        }

        {/* ── Hero ── */}
        <section
          className="flex w-full justify-center pb-24 pt-20"
          style={{ background: 'linear-gradient(200deg, #3B5BDB, #1A2E80)' }}
        >
          <div className="flex w-full max-w-[820px] flex-col items-center gap-7 px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="whitespace-pre-line text-[52px] font-extrabold leading-[1.15] text-white">
                {'Encontrá tu próxima propiedad\nen Villa Ángela'}
              </h1>
              <p className="whitespace-pre-line text-lg leading-relaxed text-white/80">
                {'Buscá alquileres y propiedades en venta con información clara,\nfiltros simples y comparación de alternativas.'}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3.5">
              {/* Search input + button */}
              <div
                className="flex w-full overflow-hidden"
                style={{
                  borderRadius: 12,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              >
                <div className="flex flex-1 items-center gap-2.5 bg-white px-5 py-[18px]">
                  <Search className="h-5 w-5 shrink-0 text-[#94A3B8]" />
                  <input
                    type="text"
                    value={heroQuery}
                    onChange={e => setHeroQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleHeroSearch()}
                    placeholder="Ejemplo: Busco casa en alquiler con 2 dormitorios, patio y garaje"
                    className="flex-1 bg-transparent text-[15px] text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleHeroSearch}
                  className="flex items-center gap-2 bg-[#3B5BDB] px-7 py-[18px] text-[15px] font-bold text-white transition-colors hover:bg-[#2F4BC2]"
                  style={{ borderRadius: '0 12px 12px 0' }}
                >
                  <Sparkles className="h-4 w-4" />
                  Buscar
                </button>
              </div>

              {/* Secondary action */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => filtersBarRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 rounded-lg border-[1.5px] border-white px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Usar filtros tradicionales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Quick Filters Bar ── */}
        <div
          ref={filtersBarRef}
          className="flex w-full justify-center bg-white"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
        >
          <div className="flex w-full" style={{ maxWidth: 1200 }}>
            {/* OPERACIÓN */}
            <FilterCell icon={House} label="OPERACIÓN" value={opLabel}>
              <select
                value={op}
                onChange={e => setOp(e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              >
                <option value="">Alquiler / Venta</option>
                <option value="rent">Alquiler</option>
                <option value="sale">Venta</option>
              </select>
            </FilterCell>

            {/* PROPIEDAD */}
            <FilterCell icon={Building2} label="PROPIEDAD" value={typeLabel}>
              <select
                value={propType}
                onChange={e => setPropType(e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              >
                <option value="">Casa / Departamento / Local</option>
                <option value="house">Casa</option>
                <option value="apartment">Departamento</option>
                <option value="commercial">Local comercial</option>
              </select>
            </FilterCell>

            {/* PRECIO */}
            <FilterCell icon={Banknote} label="PRECIO" value={priceLabel}>
              <button
                type="button"
                onClick={() => setShowPricePopover(v => !v)}
                className="absolute inset-0 h-full w-full"
              />
              {showPricePopover && (
                <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-lg">
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.5px] text-[#94A3B8]">
                        Precio mínimo
                      </label>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={e => setMinPrice(e.target.value)}
                        placeholder="0"
                        className="h-9 w-full rounded-md border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#3B5BDB]"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.5px] text-[#94A3B8]">
                        Precio máximo
                      </label>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        placeholder="Sin límite"
                        className="h-9 w-full rounded-md border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#3B5BDB]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPricePopover(false)}
                      className="h-9 w-full rounded-md bg-[#3B5BDB] text-sm font-semibold text-white transition-colors hover:bg-[#2F4BC2]"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}
            </FilterCell>

            {/* ZONA */}
            <FilterCell icon={MapPin} label="ZONA" value={zoneLabel} noBorder>
              <select
                value={zone}
                onChange={e => setZone(e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              >
                <option value="">Todos los barrios</option>
                {neighborhoods.map(n => (
                  <option key={n.neighborhood_id} value={n.neighborhood_id}>{n.name}</option>
                ))}
              </select>
            </FilterCell>

            {/* Apply */}
            <div className="flex items-center px-5">
              <button
                type="button"
                onClick={handleApplyFilters}
                className="flex items-center gap-1.5 rounded-lg bg-[#3B5BDB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2F4BC2]"
              >
                <Search className="h-3.5 w-3.5" />
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>

        {/* ── Conditional content ── */}
        {!hasActiveFilters && (
          /* Benefits Section */
          <section className="flex w-full justify-center bg-white py-[72px]">
            <div className="flex w-full max-w-[1200px] flex-col gap-12 px-6">
              <div className="flex flex-col items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-[2px] text-[#3B5BDB]">
                  ¿POR QUÉ BUPROP?
                </span>
                <h2
                  className="text-center text-[32px] font-extrabold leading-[1.25] text-[#0F172A]"
                  style={{ maxWidth: 700 }}
                >
                  Todo lo que necesitás para encontrar o publicar una propiedad
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {BENEFITS.map(({ Icon, iconBg, iconColor, title, desc }) => (
                  <div
                    key={title}
                    className="flex flex-col gap-5 rounded-2xl border border-[#E2E8F0] bg-white p-7"
                    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ background: iconBg }}
                    >
                      <Icon className="h-6 w-6" style={{ color: iconColor }} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-lg font-bold text-[#0F172A]">{title}</span>
                      <p className="text-sm leading-relaxed text-[#475569]">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Properties Section ── */}
        <section
          ref={propertiesRef}
          id="properties"
          className="flex w-full justify-center bg-[#F8FAFC] py-[72px]"
        >
          <div className="flex w-full max-w-[1200px] flex-col gap-10 px-6">
            {hasActiveFilters ? (
              /* Results mode header */
              <div className="flex flex-col gap-4">
                <SearchCriteriaChips filters={filters} neighborhoods={neighborhoods} />
                {listings?.total != null && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#0F172A]">
                      {listings.total.toLocaleString()} propiedades encontradas
                    </span>
                    <span className="text-[#94A3B8]">·</span>
                    <span className="text-sm text-[#475569]">Villa Ángela, Chaco</span>
                  </div>
                )}
              </div>
            ) : (
              /* Landing mode header */
              <div className="flex items-end justify-between">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-[2px] text-[#3B5BDB]">
                    PROPIEDADES RECIENTES
                  </span>
                  <h2 className="text-[32px] font-extrabold text-[#0F172A]">
                    Las últimas propiedades disponibles
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => propertiesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
                >
                  Ver todas las propiedades
                  <ArrowRight className="h-3.5 w-3.5 text-[#475569]" />
                </button>
              </div>
            )}

            {/* Cards */}
            {hasActiveFilters ? (
              <PropertyGrid listings={listings} />
            ) : (
              listings?.data && listings.data.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {listings.data.slice(0, 3).map(property => (
                    <PropertyCard key={property.listing_id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-[#E2E8F0]">
                  <p className="text-sm text-[#94A3B8]">No hay propiedades disponibles en este momento</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* ── CTA Publisher Section ── */}
        {!hasActiveFilters && (
          <section
            className="flex w-full justify-center py-20"
            style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)' }}
          >
            <div className="flex w-full max-w-[1200px] items-center justify-between gap-16 px-6">
              {/* Left */}
              <div className="flex max-w-[600px] flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-sm bg-[#3B5BDB]" />
                  <span className="text-xs font-bold uppercase tracking-[2px] text-[#3B5BDB]">
                    PARA PROPIETARIOS
                  </span>
                </div>
                <h2 className="whitespace-pre-line text-[40px] font-extrabold leading-[1.2] text-white">
                  {'¿Tenés una propiedad\npara publicar?'}
                </h2>
                <p className="text-base leading-relaxed text-white/60">
                  Cargá tu propiedad con fotos, requisitos, condiciones y disponibilidad. Llegá a cientos de personas que buscan en Villa Ángela.
                </p>
              </div>

              {/* Right */}
              <div className="flex shrink-0 flex-col items-center gap-4">
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <HousePlus className="h-10 w-10 text-[#3B5BDB]" />
                </div>
                <div className="flex flex-col items-center gap-3">
                  <Link
                    href="/publicar"
                    className="flex items-center gap-2 rounded-lg bg-[#3B5BDB] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2F4BC2]"
                  >
                    <Plus className="h-4 w-4" />
                    Publicar propiedad
                  </Link>
                  <a
                    href="#"
                    className="flex items-center gap-1.5 rounded-lg px-5 py-3.5 text-sm text-white/60 transition-colors hover:text-white"
                    style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    Saber más
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        <PublicFooter />
      </div>

      <ComparisonBar />
    </>
  )
}
