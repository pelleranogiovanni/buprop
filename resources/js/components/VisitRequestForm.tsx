import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { CalendarDays, Clock } from "lucide-react"
import { useState } from "react"

interface VisitRequestFormProps {
  listingId: string
  publisherName: string
}

export function VisitRequestForm({ listingId, publisherName }: VisitRequestFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState('')
  const [showCalendar, setShowCalendar] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona fecha y horario')
      return
    }
    
    const visitData = {
      ...formData,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      listingId
    }
    
    console.log('Solicitud de visita:', visitData)
    // TODO: Enviar solicitud al backend
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Solicitar visita
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Agenda una visita con {publisherName}
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selección de fecha */}
          <div className="space-y-2">
            <Label>Fecha de visita</Label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              {selectedDate ? formatDate(selectedDate) : 'Seleccionar fecha'}
            </Button>
            
            {showCalendar && (
              <div className="border rounded-lg">
                <Calendar
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date)
                    setShowCalendar(false)
                  }}
                />
              </div>
            )}
          </div>

          {/* Selección de horario */}
          {selectedDate && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Horario preferido
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    type="button"
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Datos del solicitante */}
          {selectedDate && selectedTime && (
            <>
              <div className="space-y-2">
                <Label htmlFor="visit-name">Nombre completo</Label>
                <Input
                  id="visit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visit-email">Email</Label>
                <Input
                  id="visit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visit-phone">Teléfono</Label>
                <Input
                  id="visit-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+54 9 11 1234-5678"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visit-message">Mensaje (opcional)</Label>
                <Textarea
                  id="visit-message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Comentarios adicionales..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Solicitar visita
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  )
}