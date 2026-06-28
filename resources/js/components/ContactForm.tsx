import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail } from "lucide-react"
import { useState } from "react"

interface ContactFormProps {
  listingId: string
  publisherName: string
  /** Render sin la Card contenedora, para usar dentro de un modal. */
  embedded?: boolean
}

export function ContactForm({ listingId, publisherName, embedded = false }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Conectar con backend (ContactRequestController) cuando esté disponible.
    console.log("Consulta de contacto:", { ...formData, listingId })
  }

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contact-name">Nombre completo</Label>
        <Input
          id="contact-name"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Tu nombre"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          type="email"
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="tu@email.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-phone">Teléfono</Label>
        <Input
          id="contact-phone"
          type="tel"
          value={formData.phone}
          onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="+54 9 11 1234-5678"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Mensaje</Label>
        <Textarea
          id="contact-message"
          value={formData.message}
          onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Hola, me interesa esta propiedad..."
          rows={4}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        <Mail className="mr-2 h-4 w-4" />
        Enviar consulta
      </Button>
    </form>
  )

  if (embedded) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Publicado por <span className="font-semibold text-foreground">{publisherName}</span>
        </p>
        {form}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Contactar</CardTitle>
        <p className="text-sm text-muted-foreground">
          Publicado por <span className="font-semibold">{publisherName}</span>
        </p>
      </CardHeader>
      <CardContent>{form}</CardContent>
    </Card>
  )
}
