import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { CalendarClock, Inbox, Eye } from "lucide-react"

export interface SentVisit {
  visit_id: string
  property_title: string
  property_type: string
  location?: string
  publisher_name: string
  preferred_date?: string
  preferred_time_slot: string
  status: string
}

export interface ReceivedVisit {
  visit_id: string
  property_title: string
  requester_name: string
  preferred_date?: string
  preferred_time_slot: string
  preferred_time?: string
  comment?: string
  contact_phone?: string
  status: string
}

const SLOT_LABELS: Record<string, string> = {
  morning: "Mañana",
  afternoon: "Tarde",
  evening: "Noche",
}

const STATUS_CONFIG: Record<string, { label: string; variant: "secondary" | "default" | "destructive" }> = {
  requested: { label: "Pendiente de confirmación", variant: "secondary" },
  scheduled: { label: "Agendada", variant: "default" },
  done: { label: "Realizada", variant: "default" },
  cancelled: { label: "Cancelada", variant: "destructive" },
}

const slotLabel = (value: string) => SLOT_LABELS[value] ?? value
const formatDate = (value?: string) =>
  value ? new Date(`${value}T00:00:00`).toLocaleDateString("es-AR") : "—"

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.requested
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function SentVisitsCard({ visits }: { visits: SentVisit[] }) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary" />
          Mis solicitudes de visita ({visits.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {visits.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Todavía no enviaste solicitudes de visita.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left font-medium">Propiedad</th>
                  <th className="p-4 text-left font-medium">Publicador</th>
                  <th className="p-4 text-left font-medium">Fecha solicitada</th>
                  <th className="p-4 text-left font-medium">Franja</th>
                  <th className="p-4 text-left font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {visits.map(visit => (
                  <tr key={visit.visit_id} className="border-b hover:bg-accent/50">
                    <td className="p-4">
                      <div className="font-semibold">{visit.property_title}</div>
                      {visit.location && (
                        <div className="text-sm text-muted-foreground">{visit.location}</div>
                      )}
                    </td>
                    <td className="p-4 text-sm">{visit.publisher_name}</td>
                    <td className="p-4 text-sm">{formatDate(visit.preferred_date)}</td>
                    <td className="p-4 text-sm">{slotLabel(visit.preferred_time_slot)}</td>
                    <td className="p-4"><StatusBadge status={visit.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function ReceivedVisitsCard({ visits }: { visits: ReceivedVisit[] }) {
  const [selected, setSelected] = useState<ReceivedVisit | null>(null)

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-primary" />
            Solicitudes de visita recibidas ({visits.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {visits.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Todavía no recibiste solicitudes de visita.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left font-medium">Propiedad</th>
                    <th className="p-4 text-left font-medium">Interesado</th>
                    <th className="p-4 text-left font-medium">Fecha solicitada</th>
                    <th className="p-4 text-left font-medium">Franja</th>
                    <th className="p-4 text-left font-medium">Estado</th>
                    <th className="p-4 text-left font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map(visit => (
                    <tr key={visit.visit_id} className="border-b hover:bg-accent/50">
                      <td className="p-4 font-semibold">{visit.property_title}</td>
                      <td className="p-4 text-sm">{visit.requester_name}</td>
                      <td className="p-4 text-sm">{formatDate(visit.preferred_date)}</td>
                      <td className="p-4 text-sm">{slotLabel(visit.preferred_time_slot)}</td>
                      <td className="p-4"><StatusBadge status={visit.status} /></td>
                      <td className="p-4">
                        <Button variant="outline" size="sm" onClick={() => setSelected(visit)}>
                          <Eye className="mr-1.5 h-4 w-4" />
                          Ver solicitud
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={selected !== null} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitud de visita</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="flex flex-col gap-3 text-sm">
              <DetailRow label="Propiedad" value={selected.property_title} />
              <DetailRow label="Interesado" value={selected.requester_name} />
              <DetailRow label="Teléfono de contacto" value={selected.contact_phone ?? "—"} />
              <DetailRow label="Fecha solicitada" value={formatDate(selected.preferred_date)} />
              <DetailRow label="Franja horaria" value={slotLabel(selected.preferred_time_slot)} />
              <DetailRow label="Horario aproximado" value={selected.preferred_time ?? "—"} />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estado</span>
                <StatusBadge status={selected.status} />
              </div>
              {selected.comment && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Comentario</span>
                  <p className="rounded-lg bg-muted p-3 text-foreground/90">{selected.comment}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  )
}
