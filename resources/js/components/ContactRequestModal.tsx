import { useState } from "react"
import { useForm } from "@inertiajs/react"
import {
  Dialog, DialogClose, DialogContent, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, CircleCheck, MapPin, Send, X } from "lucide-react"

interface ModalProperty {
  listing_id: string
  title: string
  price: number
  currency: string
  operation_type: string
  neighborhood_name?: string
  city_name: string
  availability_status?: string
  cover_image?: string
}

interface ContactRequestModalProps {
  property: ModalProperty
  publisher: { name: string; type?: string; verified?: boolean }
  user: { name: string; email: string; phone?: string }
  open: boolean
  onOpenChange: (open: boolean) => void
  onRequestVisit: () => void
}

const PREFERENCES = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Teléfono" },
  { value: "whatsapp", label: "WhatsApp" },
]

function formatPrice(price: number, currency: string, operationType: string) {
  const n = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 0 }).format(price)
  const prefix = currency === "USD" ? "USD " : "AR$ "
  const suffix = operationType === "rent" ? "/mes" : ""
  return `${prefix}${n}${suffix}`
}

export function ContactRequestModal({
  property, publisher, user, open, onOpenChange, onRequestVisit,
}: ContactRequestModalProps) {
  const [view, setView] = useState<"form" | "success">("form")

  const { data, setData, post, processing, errors, reset } = useForm({
    listing_id: property.listing_id,
    message: "",
    contact_preference: "email",
    contact_phone: user.phone ?? "",
    update_phone: false as boolean,
  })

  const priceLabel = formatPrice(property.price, property.currency, property.operation_type)
  const locationLabel = `${property.neighborhood_name ? `${property.neighborhood_name}, ` : ""}${property.city_name}`
  const isAvailable = (property.availability_status ?? "available") === "available"

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      reset()
      setView("form")
    }
    onOpenChange(next)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post("/contact-requests", {
      preserveScroll: true,
      onSuccess: () => setView("success"),
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`gap-0 overflow-hidden rounded-[16px] p-0 [&>button]:hidden ${
          view === "form" ? "max-w-[800px]" : "max-w-[560px]"
        }`}
      >
        {view === "form" ? (
          <form onSubmit={handleSubmit} className="flex max-h-[88vh] flex-col">
            {/* Head */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="flex flex-col gap-[3px]">
                <DialogTitle className="text-[18px] font-bold text-[#0F172A]">
                  Contactar publicación
                </DialogTitle>
                <DialogDescription className="text-[13px] text-[#475569]">
                  Enviá una consulta inicial al responsable de esta propiedad.
                </DialogDescription>
              </div>
              <DialogClose className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[#475569] transition-colors hover:bg-border">
                <X className="h-[15px] w-[15px]" />
              </DialogClose>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-4 overflow-y-auto px-6 pb-6 pt-5">
              {/* Prop Summary */}
              <div className="flex items-center gap-3.5 rounded-[8px] border border-border bg-[#F8FAFC] p-3">
                <div
                  className="h-16 w-[88px] shrink-0 rounded-[6px] bg-muted bg-cover bg-center"
                  style={property.cover_image ? { backgroundImage: `url('${property.cover_image}')` } : undefined}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
                  <span className="truncate text-[14px] font-semibold text-[#0F172A]">{property.title}</span>
                  <span className="text-[13px] font-semibold text-primary">{priceLabel}</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-[11px] w-[11px] shrink-0 text-[#94A3B8]" />
                    <span className="truncate text-[12px] text-[#94A3B8]">{locationLabel}</span>
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

              {/* Publisher Block */}
              <div className="flex items-center gap-3 rounded-[8px] border border-border bg-[#F8FAFC] p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-muted">
                  <Building2 className="h-4 w-4 text-[#475569]" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-medium text-[#0F172A]">
                      Publicado por: {publisher.name}
                    </span>
                    {publisher.verified && (
                      <span className="flex items-center gap-1 rounded-[20px] bg-[#D1FAE5] px-2.5 py-[3px] text-[11px] font-medium text-[#065F46]">
                        <CircleCheck className="h-[11px] w-[11px]" />
                        {publisher.type === "agency" ? "Inmobiliaria verificada" : "Propietario verificado"}
                      </span>
                    )}
                  </div>
                  <span className="text-[12px] text-[#94A3B8]">
                    La consulta será enviada al responsable de la publicación.
                  </span>
                </div>
              </div>

              {/* Form fields */}
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold tracking-[1.5px] text-[#475569]">
                    DATOS DEL INTERESADO
                  </span>
                  <span className="text-[12px] leading-[18px] text-[#94A3B8]">
                    Completamos estos datos con la información de tu cuenta. Podés modificar el teléfono
                    si querés que te contacten por otro medio.
                  </span>
                </div>

                <Field label="Nombre y apellido">
                  <input
                    value={user.name}
                    readOnly
                    className="h-10 w-full rounded-[8px] border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 text-[13px] text-[#0F172A] outline-none"
                  />
                </Field>

                <Field label="Email">
                  <input
                    value={user.email}
                    readOnly
                    className="h-10 w-full rounded-[8px] border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 text-[13px] text-[#0F172A] outline-none"
                  />
                </Field>

                <Field label="Teléfono">
                  <input
                    type="tel"
                    value={data.contact_phone}
                    onChange={e => setData("contact_phone", e.target.value)}
                    placeholder="+54 9 3735 000000"
                    className="h-10 w-full rounded-[8px] border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 text-[13px] text-[#0F172A] outline-none focus:border-primary"
                  />
                </Field>

                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={data.update_phone}
                    onCheckedChange={checked => setData("update_phone", checked === true)}
                  />
                  <span className="text-[12px] text-[#475569]">Actualizar este teléfono en mi cuenta</span>
                </label>

                <div className="flex flex-col gap-2">
                  <span className="text-[13px] font-medium text-[#0F172A]">Preferencia de contacto</span>
                  <div className="flex flex-wrap gap-2">
                    {PREFERENCES.map(pref => {
                      const active = data.contact_preference === pref.value
                      return (
                        <button
                          key={pref.value}
                          type="button"
                          onClick={() => setData("contact_preference", pref.value)}
                          className={`rounded-[20px] border px-4 py-[7px] text-[13px] transition-colors ${
                            active
                              ? "border-primary bg-primary font-semibold text-white"
                              : "border-border bg-card text-[#475569] hover:border-primary/40"
                          }`}
                        >
                          {pref.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <Field label="Mensaje" error={errors.message}>
                  <textarea
                    value={data.message}
                    onChange={e => setData("message", e.target.value)}
                    rows={3}
                    placeholder="Hola, me interesa esta propiedad. Quisiera recibir más información sobre disponibilidad, requisitos y condiciones."
                    className="min-h-[88px] w-full rounded-[8px] border border-[#CBD5E1] bg-[#F8FAFC] p-3.5 text-[13px] text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-primary"
                  />
                </Field>
              </div>

              <p className="text-[12px] leading-[18px] text-[#94A3B8]">
                El propietario o inmobiliaria recibirá tu consulta y podrá responderte por el medio de
                contacto indicado.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 border-t border-border px-6 py-3.5">
              <span className="min-w-0 flex-1 text-[11px] text-[#94A3B8]">
                Tus datos serán utilizados únicamente para gestionar esta consulta.
              </span>
              <div className="flex shrink-0 items-center gap-2.5">
                <DialogClose className="shrink-0 whitespace-nowrap rounded-[8px] border border-border bg-card px-4 py-[9px] text-[14px] font-medium text-[#0F172A] transition-colors hover:bg-muted">
                  Cancelar
                </DialogClose>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[8px] bg-primary px-5 py-[9px] text-[14px] font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
                >
                  <Send className="h-3.5 w-3.5 shrink-0" />
                  Enviar consulta
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex flex-col">
            {/* Head */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <DialogTitle className="text-[15px] font-semibold text-[#0F172A]">
                Confirmación de consulta
              </DialogTitle>
              <DialogClose className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-muted text-[#475569] transition-colors hover:bg-border">
                <X className="h-[13px] w-[13px]" />
              </DialogClose>
            </div>

            {/* Body */}
            <div className="flex flex-col items-center gap-4 px-8 pb-7 pt-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D1FAE5]">
                <CircleCheck className="h-7 w-7 text-[#059669]" />
              </div>
              <h2 className="text-center text-[22px] font-bold text-[#0F172A]">¡Consulta enviada!</h2>
              <DialogDescription className="text-center text-[14px] leading-[22px] text-[#475569]">
                Tu consulta fue enviada a {publisher.name}. El responsable de la publicación recibirá
                tu mensaje y podrá responderte por el medio de contacto indicado.
              </DialogDescription>

              <div className="flex w-full items-center gap-2.5 rounded-[8px] border border-border bg-[#F8FAFC] p-3">
                <div
                  className="h-9 w-11 shrink-0 rounded-[4px] bg-muted bg-cover bg-center"
                  style={property.cover_image ? { backgroundImage: `url('${property.cover_image}')` } : undefined}
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-[13px] font-semibold text-[#0F172A]">{property.title}</span>
                  <span className="truncate text-[12px] text-[#94A3B8]">
                    {priceLabel} · {locationLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-2.5 border-t border-border px-6 py-3.5">
              <button
                type="button"
                onClick={() => { handleOpenChange(false); onRequestVisit() }}
                className="rounded-[8px] border border-border bg-card px-5 py-[9px] text-[14px] font-medium text-[#0F172A] transition-colors hover:bg-muted"
              >
                Solicitar visita
              </button>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="rounded-[8px] bg-primary px-6 py-[9px] text-[14px] font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Volver al detalle
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-[#0F172A]">{label}</span>
      {children}
      {error && <span className="text-[12px] text-destructive">{error}</span>}
    </div>
  )
}
