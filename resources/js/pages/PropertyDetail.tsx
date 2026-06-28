import { Head, Link, usePage } from "@inertiajs/react"
import { PublicHeader } from "@/components/PublicHeader"
import { AuthenticatedHeader } from "@/components/AuthenticatedHeader"
import { PublicFooter } from "@/components/PublicFooter"
import { PropertyImageGallery } from "@/components/PropertyImageGallery"
import { PropertyInfo } from "@/components/PropertyInfo"
import { PropertyContactPanel } from "@/components/PropertyContactPanel"
import { PropertyMap } from "@/components/PropertyMap"
import { PropertyCard } from "@/components/PropertyCard"
import { ArrowLeft } from "lucide-react"

interface SimilarProperty {
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

interface Property {
  listing_id: string
  operation_type: string
  price: number
  currency: string
  availability_status?: string
  allow_messages?: boolean
  requirements?: string
  conditions?: string
  allows_pets?: boolean
  allows_children?: boolean
  available_from: string
  published_at?: string
  updated_at?: string
  property_type: string
  title?: string
  description?: string
  address: string
  bedrooms: number
  bathrooms: number
  rooms: number
  covered_m2: number
  total_m2: number
  has_patio?: boolean
  has_garage?: boolean
  amenities: string[]
  city_name: string
  neighborhood_name?: string
  owner_name: string
  publisher_name: string
  publisher_type?: string
  publisher_verified?: boolean
  images?: Array<{ url: string; is_cover: boolean; sort_order: number }>
}

interface PropertyDetailProps {
  property: Property
  similarProperties?: SimilarProperty[]
  canRequestVisit?: boolean
}

const propertyTypeLabels: Record<string, string> = {
  house: "Casa",
  apartment: "Departamento",
  commercial: "Local comercial",
}

const CONTAINER = "mx-auto w-full max-w-[1200px] px-6 lg:px-0"

export default function PropertyDetail({ property, similarProperties, canRequestVisit }: PropertyDetailProps) {
  const { auth } = usePage<{
    auth: { user?: { id: number; name: string; email: string; phone?: string; roles?: Array<{ name: string }> } | null }
  }>().props

  const typeLabel = propertyTypeLabels[property.property_type] ?? property.property_type
  const pageTitle = property.title ?? `${typeLabel} en ${property.city_name}`
  const coverImage = property.images?.find(img => img.is_cover)?.url ?? property.images?.[0]?.url

  return (
    <>
      <Head title={`${pageTitle} — BuProp`} />

      <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
        {auth?.user ? <AuthenticatedHeader user={auth.user} /> : <PublicHeader />}

        {/* Nav Bar */}
        <div className="w-full border-b border-border bg-card">
          <div className={`${CONTAINER} flex flex-wrap items-center justify-between gap-3 py-3.5`}>
            <nav className="flex flex-wrap items-center gap-1.5 text-[13px]">
              <Link href="/" className="text-[#94A3B8] hover:text-foreground">Inicio</Link>
              <span className="text-[#94A3B8]">/</span>
              <Link href="/properties" className="text-[#94A3B8] hover:text-foreground">Propiedades</Link>
              <span className="text-[#94A3B8]">/</span>
              <span className="max-w-[280px] truncate font-medium text-[#0F172A]">{pageTitle}</span>
            </nav>

            <Link
              href="/properties"
              className="flex items-center gap-1.5 rounded-[8px] border border-border px-3.5 py-[7px] text-[13px] font-medium text-[#475569] transition-colors hover:bg-muted"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver a resultados
            </Link>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="w-full bg-[#F8FAFC] pt-8">
          <div className={CONTAINER}>
            <PropertyImageGallery
              listingId={property.listing_id}
              propertyType={property.property_type}
              cityName={property.city_name}
              operationType={property.operation_type}
              availabilityStatus={property.availability_status}
              images={property.images}
            />
          </div>
        </div>

        {/* Main Section */}
        <div className="w-full pb-14 pt-10">
          <div className={`${CONTAINER} flex flex-col gap-12 lg:flex-row`}>
            <div className="flex min-w-0 flex-1 flex-col gap-8">
              <PropertyInfo property={property} />
              <div id="ubicacion" className="scroll-mt-24">
                <PropertyMap
                  address={property.address}
                  cityName={property.city_name}
                  neighborhoodName={property.neighborhood_name}
                />
              </div>
            </div>

            <div className="w-full shrink-0 lg:w-[340px]">
              <PropertyContactPanel
                property={{ ...property, title: pageTitle, cover_image: coverImage }}
                authUser={auth?.user ?? null}
                allowMessages={property.allow_messages}
                canRequestVisit={canRequestVisit}
              />
            </div>
          </div>
        </div>

        {/* Similar Section */}
        {similarProperties && similarProperties.length > 0 && (
          <div className="w-full border-t border-border bg-card py-14">
            <div className={`${CONTAINER} flex flex-col gap-8`}>
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-[#0F172A]">Propiedades similares</h2>
                <Link href="/properties" className="text-[13px] font-medium text-primary hover:underline">
                  Ver más propiedades →
                </Link>
              </div>
              <div className="flex flex-col gap-6 sm:flex-row">
                {similarProperties.map(similar => (
                  <div key={similar.listing_id} className="flex-1">
                    <PropertyCard property={similar} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <PublicFooter />
      </div>
    </>
  )
}
