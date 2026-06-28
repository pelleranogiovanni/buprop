import { Link } from "@inertiajs/react"
import {
  Dialog, DialogClose, DialogContent, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Lock, MapPin, Info, X } from "lucide-react"

interface AccessRequiredModalProps {
  property: {
    title: string
    price: number
    currency: string
    operation_type: string
    neighborhood_name?: string
    city_name: string
    availability_status?: string
    cover_image?: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatPrice(price: number, currency: string, operationType: string) {
  const n = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 0 }).format(price)
  const prefix = currency === "USD" ? "USD " : "AR$ "
  const suffix = operationType === "rent" ? "/mes" : ""
  return `${prefix}${n}${suffix}`
}

export function AccessRequiredModal({ property, open, onOpenChange }: AccessRequiredModalProps) {
  const priceLabel = formatPrice(property.price, property.currency, property.operation_type)
  const locationLabel = `${property.neighborhood_name ? `${property.neighborhood_name}, ` : ""}${property.city_name}`
  const isAvailable = (property.availability_status ?? "available") === "available"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] gap-0 overflow-hidden rounded-[16px] p-0 [&>button]:hidden">
        {/* Head */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <DialogTitle className="text-[15px] font-semibold text-[#0F172A]">Acceso requerido</DialogTitle>
          <DialogClose className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-muted text-[#475569] transition-colors hover:bg-border">
            <X className="h-[13px] w-[13px]" />
          </DialogClose>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center gap-4 px-7 pb-8 pt-7">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-muted">
            <Lock className="h-[22px] w-[22px] text-[#475569]" />
          </div>
          <h2 className="text-center text-[20px] font-bold text-[#0F172A]">Iniciá sesión para continuar</h2>
          <DialogDescription className="text-center text-[14px] leading-[22px] text-[#475569]">
            Para contactar esta publicación o solicitar una visita necesitás iniciar sesión o crear
            una cuenta como interesado.
          </DialogDescription>

          {/* Prop Card */}
          <div className="flex w-full items-center gap-3 rounded-[8px] border border-border bg-[#F8FAFC] p-3">
            <div
              className="h-12 w-16 shrink-0 rounded-[4px] bg-muted bg-cover bg-center"
              style={property.cover_image ? { backgroundImage: `url('${property.cover_image}')` } : undefined}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate text-[13px] font-semibold text-[#0F172A]">{property.title}</span>
              <span className="text-[12px] font-semibold text-primary">{priceLabel}</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-2.5 w-2.5 shrink-0 text-[#94A3B8]" />
                <span className="truncate text-[11px] text-[#94A3B8]">{locationLabel}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="rounded-[6px] bg-primary-light px-2.5 py-1 text-[12px] font-medium text-primary">
                  {property.operation_type === "rent" ? "Alquiler" : "Venta"}
                </span>
                {isAvailable && (
                  <span className="rounded-[6px] bg-[#D1FAE5] px-2.5 py-1 text-[12px] font-medium text-[#10B981]">
                    Disponible
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="flex w-full items-start gap-2 rounded-[8px] bg-[#EFF6FF] p-3">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="text-[12px] leading-[18px] text-primary">
              Crear una cuenta te permite enviar consultas, solicitar visitas y cargar preferencias
              de búsqueda.
            </span>
          </div>

          {/* Buttons */}
          <div className="flex w-full flex-col gap-2">
            <Link
              href="/register"
              className="flex h-[42px] w-full items-center justify-center rounded-[8px] bg-primary text-[14px] font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Crear cuenta
            </Link>
            <Link
              href="/login"
              className="flex h-[42px] w-full items-center justify-center rounded-[8px] border border-border bg-card text-[14px] font-medium text-[#0F172A] transition-colors hover:bg-muted"
            >
              Iniciar sesión
            </Link>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-[13px] text-primary transition-opacity hover:opacity-80"
          >
            Volver al detalle
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
