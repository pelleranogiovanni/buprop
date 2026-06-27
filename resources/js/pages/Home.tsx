import { useRef } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import {
  Search, SlidersHorizontal, House, Sparkles, GitCompare,
  ArrowRight, HousePlus, Plus,
} from 'lucide-react'
import { PublicHeader } from '@/components/PublicHeader'
import { AuthenticatedHeader } from '@/components/AuthenticatedHeader'
import { PublicFooter } from '@/components/PublicFooter'
import { ComparisonBar } from '@/components/ComparisonBar'
import { PropertyCard } from '@/components/PropertyCard'
import { QuickFiltersBar } from '@/components/QuickFiltersBar'

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

interface HomeProps {
  featuredListings: Property[]
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

export default function Home({ featuredListings, auth }: HomeProps) {
  const [heroQuery, setHeroQuery] = useState('')
  const filtersBarRef = useRef<HTMLDivElement>(null)

  const handleHeroSearch = () => {
    if (heroQuery.trim()) {
      router.get('/properties', { q: heroQuery })
    }
  }

  return (
    <>
      <Head title="BuProp — Encontrá tu próxima propiedad" />

      <div className="flex min-h-screen flex-col bg-[#F8FAFC] pb-20">
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
              {/* Search input */}
              <div
                className="flex w-full overflow-hidden"
                style={{
                  borderRadius: 12,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              >
                <div className="flex flex-1 items-center gap-2.5 bg-white px-5 py-[18px]">
                  <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    value={heroQuery}
                    onChange={e => setHeroQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleHeroSearch()}
                    placeholder="Ejemplo: Busco casa en alquiler con 2 dormitorios, patio y garaje"
                    className="flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleHeroSearch}
                  className="flex items-center gap-2 bg-primary px-7 py-[18px] text-[15px] font-bold text-white transition-colors hover:bg-primary-hover"
                  style={{ borderRadius: '0 12px 12px 0' }}
                >
                  <Sparkles className="h-4 w-4" />
                  Buscar
                </button>
              </div>

              {/* Filters shortcut */}
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
        <div ref={filtersBarRef}>
          <QuickFiltersBar neighborhoods={[]} targetPath="/properties" />
        </div>

        {/* ── Benefits ── */}
        <section className="flex w-full justify-center bg-white py-[72px]">
          <div className="flex w-full max-w-[1200px] flex-col gap-12 px-6">
            <div className="flex flex-col items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-[2px] text-primary">
                ¿POR QUÉ BUPROP?
              </span>
              <h2
                className="text-center text-[32px] font-extrabold leading-[1.25] text-foreground"
                style={{ maxWidth: 700 }}
              >
                Todo lo que necesitás para encontrar o publicar una propiedad
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {BENEFITS.map(({ Icon, iconBg, iconColor, title, desc }) => (
                <div
                  key={title}
                  className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-7"
                  style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: iconBg }}
                  >
                    <Icon className="h-6 w-6" style={{ color: iconColor }} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-lg font-bold text-foreground">{title}</span>
                    <p className="text-sm leading-relaxed text-[#475569]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Properties ── */}
        <section className="flex w-full justify-center bg-[#F8FAFC] py-[72px]">
          <div className="flex w-full max-w-[1200px] flex-col gap-10 px-6">
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-[2px] text-primary">
                  PROPIEDADES RECIENTES
                </span>
                <h2 className="text-[32px] font-extrabold text-foreground">
                  Las últimas propiedades disponibles
                </h2>
              </div>
              <Link
                href="/properties"
                className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-[#F8FAFC]"
              >
                Ver todas las propiedades
                <ArrowRight className="h-3.5 w-3.5 text-[#475569]" />
              </Link>
            </div>

            {featuredListings.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredListings.map(property => (
                  <PropertyCard key={property.listing_id} property={property} />
                ))}
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-border">
                <p className="text-sm text-muted-foreground">
                  No hay propiedades disponibles en este momento
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA Publisher ── */}
        <section
          className="flex w-full justify-center py-20"
          style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)' }}
        >
          <div className="flex w-full max-w-[1200px] items-center justify-between gap-16 px-6">
            <div className="flex max-w-[600px] flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-sm bg-primary" />
                <span className="text-xs font-bold uppercase tracking-[2px] text-primary">
                  PARA PROPIETARIOS
                </span>
              </div>
              <h2 className="whitespace-pre-line text-[40px] font-extrabold leading-[1.2] text-white">
                {'¿Tenés una propiedad\npara publicar?'}
              </h2>
              <p className="text-base leading-relaxed text-white/60">
                Cargá tu propiedad con fotos, requisitos, condiciones y disponibilidad.
                Llegá a cientos de personas que buscan en Villa Ángela.
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-4">
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <HousePlus className="h-10 w-10 text-primary" />
              </div>
              <div className="flex flex-col items-center gap-3">
                <Link
                  href="/publicar"
                  className="flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
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

        <PublicFooter />
      </div>

      <ComparisonBar />
    </>
  )
}
