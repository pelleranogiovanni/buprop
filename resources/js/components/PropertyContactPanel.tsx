import { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { VisitRequestForm } from "@/components/VisitRequestForm"
import { ContactRequestModal } from "@/components/ContactRequestModal"
import { AccessRequiredModal } from "@/components/AccessRequiredModal"
import { useCompare } from "@/contexts/CompareContext"
import { ShieldCheck, MessageCircle, CalendarCheck, GitCompare, Check } from "lucide-react"

interface AuthUser {
  id: number
  name: string
  email: string
  phone?: string
}

interface PropertyContactPanelProps {
  property: {
    listing_id: string
    operation_type: string
    price: number
    currency: string
    property_type: string
    title: string
    address: string
    bedrooms: number
    bathrooms: number
    covered_m2: number
    city_name: string
    neighborhood_name?: string
    publisher_name: string
    publisher_type?: string
    publisher_verified?: boolean
    availability_status?: string
    available_from: string
    published_at?: string
    cover_image?: string
  }
  authUser?: AuthUser | null
  allowMessages?: boolean
}

const availabilityLabels: Record<string, string> = {
  available: "Disponible",
  reserved: "Reservada",
  rented: "Alquilada",
  sold: "Vendida",
}

function formatPrice(price: number, currency: string, operationType: string) {
  const n = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 0 }).format(price)
  const prefix = currency === "USD" ? "USD " : "AR$ "
  const suffix = operationType === "rent" ? "/mes" : ""
  return `${prefix}${n}${suffix}`
}

function formatDate(value?: string) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("es-AR")
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? "")
    .join("")
}

export function PropertyContactPanel({ property, authUser = null, allowMessages = true }: PropertyContactPanelProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const [contactOpen, setContactOpen] = useState(false)
  const [visitOpen, setVisitOpen] = useState(false)
  const [accessOpen, setAccessOpen] = useState(false)

  const inCompare = isInCompare(property.listing_id)
  const isAgency = property.publisher_type === "agency"
  const availabilityLabel = availabilityLabels[property.availability_status ?? "available"] ?? "Disponible"

  const typeText = isAgency ? "Inmobiliaria" : "Propietario"
  const verifiedText = property.publisher_verified
    ? `${typeText} ${isAgency ? "verificada" : "verificado"}`
    : typeText

  const handleContact = () => (authUser ? setContactOpen(true) : setAccessOpen(true))
  const handleVisit = () => (authUser ? setVisitOpen(true) : setAccessOpen(true))

  const toggleCompare = () => {
    if (inCompare) {
      removeFromCompare(property.listing_id)
      return
    }
    addToCompare({
      listing_id: property.listing_id,
      operation_type: property.operation_type,
      price: property.price,
      currency: property.currency,
      property_type: property.property_type,
      address: property.address,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      covered_m2: property.covered_m2,
      city_name: property.city_name,
      neighborhood_name: property.neighborhood_name,
      publisher_name: property.publisher_name,
      cover_image: property.cover_image,
    })
  }

  return (
    <div className="sticky top-6 flex flex-col gap-5 rounded-[12px] border border-border bg-card p-6">
      {/* Top: precio + estado */}
      <div className="flex flex-col gap-2">
        <span className="text-[24px] font-bold text-[#0F172A]">
          {formatPrice(property.price, property.currency, property.operation_type)}
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded-[20px] bg-[#DCFCE7] px-3 py-1 text-[12px] font-semibold text-[#065F46]">
            {availabilityLabel}
          </span>
          <span className="text-[12px] text-[#94A3B8]">
            Disponible desde {formatDate(property.available_from)}
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-[#E2E8F0]" />

      {/* Publicador */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E3A8A] text-[14px] font-bold text-white">
            {getInitials(property.publisher_name)}
          </div>
          <div className="flex flex-col gap-[3px]">
            <span className="text-[14px] font-semibold text-[#0F172A]">{property.publisher_name}</span>
            <div className="flex items-center gap-1.5">
              {property.publisher_verified && (
                <ShieldCheck className="h-3 w-3 text-[#1D4ED8]" />
              )}
              <span className={`text-[12px] font-medium ${property.publisher_verified ? "text-[#1D4ED8]" : "text-[#94A3B8]"}`}>
                {verifiedText}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] text-[#94A3B8]">Teléfono visible al enviar consulta</span>
          {property.published_at && (
            <span className="text-[12px] text-[#94A3B8]">Publicado el {formatDate(property.published_at)}</span>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-[#E2E8F0]" />

      {/* Acciones */}
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={handleContact}
          disabled={!allowMessages}
          className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-primary py-[13px] text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MessageCircle className="h-4 w-4" />
          Contactar
        </button>

        <button
          type="button"
          onClick={handleVisit}
          className="flex w-full items-center justify-center gap-2 rounded-[8px] border-[1.5px] border-primary bg-card py-[11px] text-[15px] font-semibold text-primary transition-colors hover:bg-primary-light"
        >
          <CalendarCheck className="h-4 w-4" />
          Solicitar visita
        </button>

        <button
          onClick={toggleCompare}
          aria-pressed={inCompare}
          className="flex w-full items-center justify-center gap-1.5 rounded-[8px] border border-border bg-card py-[9px] text-[13px] font-medium text-[#475569] transition-colors hover:border-primary/40 hover:text-primary"
        >
          {inCompare ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Agregada a comparación
            </>
          ) : (
            <>
              <GitCompare className="h-3.5 w-3.5" />
              Agregar a comparación
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] leading-[17px] text-[#94A3B8]">
        La consulta se enviará al propietario o inmobiliaria responsable de la publicación.
      </p>

      {/* Modales */}
      {authUser && (
        <>
          <ContactRequestModal
            open={contactOpen}
            onOpenChange={setContactOpen}
            onRequestVisit={() => setVisitOpen(true)}
            property={{
              listing_id: property.listing_id,
              title: property.title,
              price: property.price,
              currency: property.currency,
              operation_type: property.operation_type,
              neighborhood_name: property.neighborhood_name,
              city_name: property.city_name,
              availability_status: property.availability_status,
              cover_image: property.cover_image,
            }}
            publisher={{
              name: property.publisher_name,
              type: property.publisher_type,
              verified: property.publisher_verified,
            }}
            user={{ name: authUser.name, email: authUser.email, phone: authUser.phone }}
          />

          <Dialog open={visitOpen} onOpenChange={setVisitOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Solicitar visita</DialogTitle>
              </DialogHeader>
              <VisitRequestForm listingId={property.listing_id} publisherName={property.publisher_name} embedded />
            </DialogContent>
          </Dialog>
        </>
      )}

      <AccessRequiredModal
        open={accessOpen}
        onOpenChange={setAccessOpen}
        property={{
          title: property.title,
          price: property.price,
          currency: property.currency,
          operation_type: property.operation_type,
          neighborhood_name: property.neighborhood_name,
          city_name: property.city_name,
          availability_status: property.availability_status,
          cover_image: property.cover_image,
        }}
      />
    </div>
  )
}
