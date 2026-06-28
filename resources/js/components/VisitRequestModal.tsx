import { useState } from "react"
import { useForm } from "@inertiajs/react"
import {
  Dialog, DialogClose, DialogContent, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Calendar, AlarmClock, Sun, Send, X } from "lucide-react"

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

interface VisitRequestModalProps {
  property: ModalProperty
  user: { name: string; email: string; phone?: string }
  publisherName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TIME_SLOTS = [
  { value: "morning", label: "Mañana" },
  { value: "afternoon", label: "Tarde" },
  { value: "evening", label: "Noche" },
]

const slotLabel = (value: string) => TIME_SLOTS.find(s => s.value === value)?.label ?? "—"

function formatPrice(price: number, currency: string, operationType: string) {
  const n = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 0 }).format(price)
  const prefix = currency === "USD" ? "USD " : "AR$ "
  const suffix = operationType === "rent" ? "/mes" : ""
  return `${prefix}${n}${suffix}`
}

function formatDate(value?: string) {
  if (!value) return "—"
  return new Date(`${value}T00:00:00`).toLocaleDateString("es-AR")
}

export function VisitRequestModal({
  property, user, publisherName, open, onOpenChange,
}: VisitRequestModalProps) {
  const [view, setView] = useState<"form" | "success">("form")

  const { data, setData, post, processing, errors, reset } = useForm({
    listing_id: property.listing_id,
    preferred_date: "",
    preferred_time_slot: "",
    preferred_time: "",
    alternative_date: "",
    comment: "",
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
    post("/visit-requests", {
      preserveScroll: true,
      onSuccess: () => setView("success"),
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`gap-0 overflow-hidden rounded-[16px] p-0 [&>button]:hidden ${
          view === "form" ? "max-w-[800px]" : "max-w-[600px]"
        }`}
      >
        {view === "form" ? (
          <form onSubmit={handleSubmit} className="flex max-h-[88vh] flex-col">
            {/* Head */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="flex flex-col gap-[3px]">
                <DialogTitle className="text-[18px] font-bold text-[#0F172A]">Solicitar visita</DialogTitle>
                <DialogDescription className="text-[13px] text-[#475569]">
                  Indicá cuándo te gustaría visitar esta propiedad.
                </DialogDescription>
              </div>
              <DialogClose className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[#475569] transition-colors hover:bg-border">
                <X className="h-[15px] w-[15px]" />
              </DialogClose>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-3.5 overflow-y-auto px-6 pb-5 pt-[18px]">
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

              {/* Form fields */}
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold tracking-[1.5px] text-[#475569]">DATOS DEL INTERESADO</span>
                  <span className="text-[12px] leading-[18px] text-[#94A3B8]">
                    Completamos estos datos con la información de tu cuenta. El teléfono es importante
                    para que puedan contactarte y coordinar la visita.
                  </span>
                </div>

                <Field label="Nombre y apellido">
                  <ReadonlyInput value={user.name} />
                </Field>
                <Field label="Email">
                  <ReadonlyInput value={user.email} />
                </Field>
                <Field label="Teléfono" error={errors.contact_phone}>
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

                <Field label="Fecha preferida" error={errors.preferred_date}>
                  <input
                    type="date"
                    value={data.preferred_date}
                    onChange={e => setData("preferred_date", e.target.value)}
                    className="h-10 w-full rounded-[8px] border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 text-[13px] text-[#0F172A] outline-none focus:border-primary"
                  />
                </Field>

                <div className="flex flex-col gap-2">
                  <span className="text-[13px] font-medium text-[#0F172A]">Franja horaria preferida</span>
                  <div className="flex flex-wrap gap-2">
                    {TIME_SLOTS.map(slot => {
                      const active = data.preferred_time_slot === slot.value
                      return (
                        <button
                          key={slot.value}
                          type="button"
                          onClick={() => setData("preferred_time_slot", slot.value)}
                          className={`rounded-[20px] border px-[18px] py-[7px] text-[13px] transition-colors ${
                            active
                              ? "border-primary bg-primary font-semibold text-white"
                              : "border-border bg-card text-[#475569] hover:border-primary/40"
                          }`}
                        >
                          {slot.label}
                        </button>
                      )
                    })}
                  </div>
                  {errors.preferred_time_slot && (
                    <span className="text-[12px] text-destructive">{errors.preferred_time_slot}</span>
                  )}
                </div>

                <Field label="Horario aproximado" error={errors.preferred_time}>
                  <input
                    type="text"
                    value={data.preferred_time}
                    onChange={e => setData("preferred_time", e.target.value)}
                    placeholder="Ej. 18:00"
                    className="h-10 w-full rounded-[8px] border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 text-[13px] text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-primary"
                  />
                </Field>

                <Field
                  label="Fecha alternativa"
                  optional
                  error={errors.alternative_date}
                >
                  <input
                    type="date"
                    value={data.alternative_date}
                    onChange={e => setData("alternative_date", e.target.value)}
                    className="h-10 w-full rounded-[8px] border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 text-[13px] text-[#0F172A] outline-none focus:border-primary"
                  />
                </Field>

                <Field label="Comentario adicional" error={errors.comment}>
                  <textarea
                    value={data.comment}
                    onChange={e => setData("comment", e.target.value)}
                    rows={3}
                    placeholder="Hola, quisiera coordinar una visita para conocer la propiedad. Tengo disponibilidad en los horarios indicados."
                    className="min-h-[80px] w-full rounded-[8px] border border-[#CBD5E1] bg-[#F8FAFC] p-3.5 text-[13px] text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-primary"
                  />
                </Field>
              </div>

              <p className="text-[12px] leading-[18px] text-[#94A3B8]">
                La visita no queda confirmada automáticamente. El propietario o inmobiliaria deberá
                responder y coordinar el horario final.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 border-t border-border px-6 py-3.5">
              <span className="min-w-0 flex-1 text-[11px] text-[#94A3B8]">
                Tus datos serán utilizados únicamente para gestionar esta solicitud de visita.
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
                  Enviar solicitud
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex flex-col">
            {/* Head */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <DialogTitle className="text-[15px] font-semibold text-[#0F172A]">
                Confirmación de solicitud de visita
              </DialogTitle>
              <DialogClose className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-muted text-[#475569] transition-colors hover:bg-border">
                <X className="h-[13px] w-[13px]" />
              </DialogClose>
            </div>

            {/* Body */}
            <div className="flex flex-col items-center gap-4 px-7 pb-6 pt-7">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D1FAE5]">
                <Calendar className="h-7 w-7 text-[#059669]" />
              </div>
              <h2 className="text-center text-[22px] font-bold text-[#0F172A]">¡Solicitud enviada!</h2>
              <DialogDescription className="text-center text-[14px] leading-[22px] text-[#475569]">
                Tu solicitud de visita fue enviada correctamente a {publisherName}. El responsable
                revisará la fecha propuesta y podrá contactarte para confirmar o coordinar otro horario.
              </DialogDescription>

              <div className="flex w-full items-center gap-2.5 rounded-[8px] border border-border bg-[#F8FAFC] p-2.5">
                <div
                  className="h-10 w-[52px] shrink-0 rounded-[4px] bg-muted bg-cover bg-center"
                  style={property.cover_image ? { backgroundImage: `url('${property.cover_image}')` } : undefined}
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-[13px] font-semibold text-[#0F172A]">{property.title}</span>
                  <span className="truncate text-[12px] text-[#94A3B8]">{priceLabel} · {locationLabel}</span>
                </div>
              </div>

              {/* Visit Summary */}
              <div className="flex w-full flex-col gap-2.5 rounded-[8px] border border-border bg-[#F8FAFC] p-4">
                <span className="text-[12px] font-semibold tracking-[0.8px] text-[#94A3B8]">Resumen de la solicitud</span>
                <SummaryRow icon={Calendar} label="Fecha preferida:" value={formatDate(data.preferred_date)} />
                <SummaryRow icon={Sun} label="Franja horaria:" value={slotLabel(data.preferred_time_slot)} />
                {data.preferred_time && (
                  <SummaryRow icon={AlarmClock} label="Horario aproximado:" value={data.preferred_time} />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-2.5 border-t border-border px-6 py-3.5">
              <button
                type="button"
                onClick={() => { reset(); setView("form") }}
                className="rounded-[8px] border border-border bg-card px-5 py-[9px] text-[14px] font-medium text-[#0F172A] transition-colors hover:bg-muted"
              >
                Enviar otra solicitud
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

function Field({ label, optional, error, children }: { label: string; optional?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-[13px] font-medium text-[#0F172A]">{label}</span>
        {optional && (
          <span className="rounded-[20px] bg-muted px-2 py-0.5 text-[11px] text-[#94A3B8]">Opcional</span>
        )}
      </div>
      {children}
      {error && <span className="text-[12px] text-destructive">{error}</span>}
    </div>
  )
}

function ReadonlyInput({ value }: { value: string }) {
  return (
    <input
      value={value}
      readOnly
      className="h-10 w-full rounded-[8px] border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 text-[13px] text-[#0F172A] outline-none"
    />
  )
}

function SummaryRow({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" />
      <span className="text-[13px] text-[#475569]">{label}</span>
      <span className="text-[13px] font-semibold text-[#0F172A]">{value}</span>
    </div>
  )
}
