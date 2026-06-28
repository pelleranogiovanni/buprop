import {
  MapPin, Map, Bed, Bath, Ruler, Maximize, Layers, TreePine, Car,
  CircleCheck, FileText,
} from "lucide-react"

interface PropertyInfoProps {
  property: {
    operation_type: string
    price: number
    currency: string
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
    available_from: string
    availability_status?: string
    requirements?: string
    conditions?: string
    allows_pets?: boolean
    allows_children?: boolean
    updated_at?: string
  }
}

const propertyTypeLabels: Record<string, string> = {
  house: "Casa",
  apartment: "Departamento",
  commercial: "Local comercial",
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

function relativeTime(value?: string) {
  if (!value) return "—"
  const diffMs = Date.now() - new Date(value).getTime()
  const days = Math.floor(diffMs / 86_400_000)
  if (days <= 0) return "hoy"
  if (days === 1) return "hace 1 día"
  if (days < 30) return `hace ${days} días`
  const months = Math.floor(days / 30)
  return months === 1 ? "hace 1 mes" : `hace ${months} meses`
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  const typeLabel = propertyTypeLabels[property.property_type] ?? property.property_type
  const operationLabel = property.operation_type === "rent" ? "alquiler" : "venta"
  const availabilityLabel = availabilityLabels[property.availability_status ?? "available"] ?? "Disponible"

  const specs = [
    { icon: Layers, label: `${property.rooms} ambientes` },
    { icon: Bed, label: `${property.bedrooms} ${property.bedrooms === 1 ? "dormitorio" : "dormitorios"}` },
    { icon: Bath, label: `${property.bathrooms} ${property.bathrooms === 1 ? "baño" : "baños"}` },
    { icon: Maximize, label: `${property.total_m2} m² totales` },
    { icon: Ruler, label: `${property.covered_m2} m² cubiertos` },
    ...(property.has_patio ? [{ icon: TreePine, label: "Patio" }] : []),
    ...(property.has_garage ? [{ icon: Car, label: "Garaje" }] : []),
  ]

  const requirementsList = property.requirements
    ? property.requirements.split(/[,.]/).map(r => r.trim()).filter(Boolean)
    : []

  return (
    <div className="flex flex-col gap-8">
      {/* Prop Head */}
      <div className="flex flex-col gap-3">
        <h1 className="text-[28px] font-bold leading-tight text-[#0F172A]">
          {property.title ?? `${typeLabel} en ${operationLabel}`}
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[22px] font-bold text-primary">
            {formatPrice(property.price, property.currency, property.operation_type)}
          </span>
          <span className="rounded-[20px] bg-[#DBEAFE] px-3 py-1 text-[12px] font-semibold text-[#1D4ED8]">
            {property.operation_type === "rent" ? "Alquiler" : "Venta"}
          </span>
          <span className="rounded-[20px] bg-[#F1F5F9] px-3 py-1 text-[12px] font-semibold text-[#475569]">
            {typeLabel}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-[15px] w-[15px] shrink-0 text-[#94A3B8]" />
            <span className="text-[14px] text-[#475569]">
              {property.neighborhood_name && `${property.neighborhood_name}, `}
              {property.city_name}, Chaco
            </span>
          </div>
          <a
            href="#ubicacion"
            className="flex items-center gap-1.5 rounded-[8px] border border-primary px-3 py-1.5 text-[12px] font-medium text-primary transition-colors hover:bg-primary-light"
          >
            <Map className="h-[13px] w-[13px]" />
            Ver ubicación en mapa
          </a>
        </div>
      </div>

      {/* Features Card */}
      <Card>
        <CardTitle>Características principales</CardTitle>
        <div className="flex flex-wrap gap-4">
          {specs.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-[8px] border border-border bg-[#F8FAFC] px-3.5 py-2.5"
            >
              <Icon className="h-[15px] w-[15px] shrink-0 text-primary" />
              <span className="text-[13px] font-medium text-[#0F172A]">{label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Descripción */}
      {property.description && (
        <Card gap="gap-3.5">
          <CardTitle>Descripción</CardTitle>
          <p className="text-[14px] leading-[22px] text-[#475569]">{property.description}</p>
        </Card>
      )}

      {/* Comodidades */}
      {property.amenities && property.amenities.length > 0 && (
        <Card>
          <CardTitle>Comodidades</CardTitle>
          <div className="flex flex-wrap gap-x-6 gap-y-2.5">
            {property.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-[13px] capitalize text-[#475569]">
                  {String(amenity).replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Requisitos para avanzar */}
      {requirementsList.length > 0 && (
        <Card gap="gap-4">
          <CardTitle>Requisitos para avanzar</CardTitle>
          <div className="flex flex-wrap gap-2">
            {requirementsList.map((req, index) => (
              <span
                key={index}
                className="flex items-center gap-1.5 rounded-[20px] border border-[#BFDBFE] bg-[#EFF6FF] px-3.5 py-1.5 text-[12px] font-medium text-[#1D4ED8]"
              >
                <FileText className="h-3 w-3" />
                {req}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Condiciones de la publicación */}
      <Card gap="gap-4">
        <CardTitle>Condiciones de la publicación</CardTitle>
        <ConditionRow label="Acepta mascotas" value={!!property.allows_pets} />
        <ConditionRow label="Acepta grupo familiar" value={!!property.allows_children} />
        {property.conditions && (
          <div className="rounded-[8px] bg-muted p-3 text-[13px] text-[#475569]">
            {property.conditions}
          </div>
        )}
      </Card>

      {/* Disponibilidad */}
      <Card gap="gap-4">
        <CardTitle>Disponibilidad</CardTitle>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#475569]">Estado</span>
          <span className="rounded-[20px] bg-[#DCFCE7] px-3 py-1 text-[12px] font-semibold text-[#065F46]">
            {availabilityLabel}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#475569]">Disponible desde</span>
          <span className="text-[13px] font-medium text-[#0F172A]">{formatDate(property.available_from)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#475569]">Última actualización</span>
          <span className="text-[13px] font-medium text-[#0F172A]">{relativeTime(property.updated_at)}</span>
        </div>
      </Card>
    </div>
  )
}

function Card({ children, gap = "gap-5" }: { children: React.ReactNode; gap?: string }) {
  return (
    <div className={`flex flex-col ${gap} rounded-[12px] border border-border bg-card p-6`}>
      {children}
    </div>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[15px] font-semibold text-[#0F172A]">{children}</h2>
}

function ConditionRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CircleCheck className={`h-3.5 w-3.5 ${value ? "text-[#065F46]" : "text-[#94A3B8]"}`} />
        <span className="text-[13px] text-[#475569]">{label}</span>
      </div>
      {value ? (
        <span className="rounded-[20px] bg-[#DCFCE7] px-3 py-1 text-[12px] font-semibold text-[#065F46]">Sí</span>
      ) : (
        <span className="rounded-[20px] bg-[#F1F5F9] px-3 py-1 text-[12px] font-semibold text-[#94A3B8]">No</span>
      )}
    </div>
  )
}
