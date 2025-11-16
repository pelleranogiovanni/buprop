import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MessageCircle } from "lucide-react"
import { useState } from "react"

interface ContactFormProps {
  publisherName: string
  publisherPhone?: string
}

export function ContactForm({ publisherName, publisherPhone }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar envío de formulario
    console.log('Formulario enviado:', formData)
  }

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Contactar</CardTitle>
        <p className="text-sm text-muted-foreground">
          Publicado por <span className="font-semibold">{publisherName}</span>
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Botones de contacto rápido */}
        <div className="space-y-2">
          {publisherPhone && (
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open(`tel:${publisherPhone}`)}
            >
              <Phone className="w-4 h-4 mr-2" />
              Llamar ahora
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => window.open(`https://wa.me/${publisherPhone?.replace(/\D/g, '')}`)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
        </div>

        <div className="border-t pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Tu nombre"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+54 9 11 1234-5678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Hola, me interesa esta propiedad..."
                rows={4}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Enviar consulta
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}