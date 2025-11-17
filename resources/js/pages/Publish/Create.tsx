import { Head, Link, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Upload, X, Star } from 'lucide-react'

interface Neighborhood {
  neighborhood_id: string
  name: string
}

interface CreateProps {
  neighborhoods: Neighborhood[]
}

export default function Create({ neighborhoods }: CreateProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [images, setImages] = useState<File[]>([])
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0)
  
  const { data, setData, post, processing, errors } = useForm({
    property_type: '',
    address: '',
    neighborhood_id: '',
    bedrooms: '',
    bathrooms: '',
    rooms: '',
    covered_m2: '',
    total_m2: '',
    amenities: [] as string[],
    operation_type: '',
    price: '',
    currency: 'ARS',
    requirements: '',
    images: [] as File[],
    cover_image_index: 0
  })

  const amenitiesList = [
    { id: 'aire_acondicionado', label: 'Aire acondicionado' },
    { id: 'garage', label: 'Garage' },
    { id: 'patio', label: 'Patio' },
    { id: 'balcon', label: 'Balcón' },
    { id: 'parrilla', label: 'Parrilla' },
    { id: 'piscina', label: 'Piscina' },
    { id: 'quincho', label: 'Quincho' },
    { id: 'cocina_equipada', label: 'Cocina equipada' },
    { id: 'amoblado', label: 'Amoblado' },
    { id: 'sum', label: 'SUM' },
    { id: 'ascensor', label: 'Ascensor' },
    { id: 'portero', label: 'Portero' }
  ]

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    let newAmenities
    if (checked) {
      newAmenities = [...selectedAmenities, amenityId]
    } else {
      newAmenities = selectedAmenities.filter(id => id !== amenityId)
    }
    setSelectedAmenities(newAmenities)
    setData('amenities', newAmenities)
  }

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        const maxWidth = 1200
        const maxHeight = 800
        let { width, height } = img
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob!], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          })
          resolve(compressedFile)
        }, 'image/jpeg', 0.7)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const compressedFiles = await Promise.all(files.map(compressImage))
    const newImages = [...images, ...compressedFiles].slice(0, 5)
    setImages(newImages)
    setData('images', newImages)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    setData('images', newImages)
    
    // Ajustar índice de portada si es necesario
    if (coverImageIndex === index) {
      setCoverImageIndex(0)
      setData('cover_image_index', 0)
    } else if (coverImageIndex > index) {
      const newCoverIndex = coverImageIndex - 1
      setCoverImageIndex(newCoverIndex)
      setData('cover_image_index', newCoverIndex)
    }
  }

  const setCoverImage = (index: number) => {
    setCoverImageIndex(index)
    setData('cover_image_index', index)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Enviando formulario...', data)
    console.log('Processing:', processing)
    console.log('Errors:', errors)
    post('/publicar', {
      onStart: () => console.log('Iniciando envío...'),
      onSuccess: () => console.log('Éxito!'),
      onError: (errors) => console.log('Errores:', errors),
      onFinish: () => console.log('Finalizado')
    })
  }

  return (
    <>
      <Head title="Publicar Propiedad - Mi Alquiler" />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-6 py-8 flex-1">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al dashboard
                </Link>
              </Button>
              
              <h1 className="text-3xl font-bold mb-2">Publicar Propiedad</h1>
              <p className="text-muted-foreground">
                Completa la información de tu propiedad para publicarla
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Información básica */}
              <Card>
                <CardHeader>
                  <CardTitle>Información básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="property_type">Tipo de propiedad</Label>
                      <Select value={data.property_type} onValueChange={(value) => setData('property_type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="house">Casa</SelectItem>
                          <SelectItem value="apartment">Departamento</SelectItem>
                          <SelectItem value="commercial">Local comercial</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.property_type && <p className="text-sm text-destructive">{errors.property_type}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="neighborhood_id">Zona</Label>
                      <Select value={data.neighborhood_id} onValueChange={(value) => setData('neighborhood_id', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar zona" />
                        </SelectTrigger>
                        <SelectContent>
                          {neighborhoods.map((neighborhood) => (
                            <SelectItem key={neighborhood.neighborhood_id} value={neighborhood.neighborhood_id}>
                              {neighborhood.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.neighborhood_id && <p className="text-sm text-destructive">{errors.neighborhood_id}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      placeholder="Ej: Av. San Martín 1234"
                    />
                    {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Características */}
              <Card>
                <CardHeader>
                  <CardTitle>Características</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Dormitorios</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        min="0"
                        value={data.bedrooms}
                        onChange={(e) => setData('bedrooms', e.target.value)}
                      />
                      {errors.bedrooms && <p className="text-sm text-destructive">{errors.bedrooms}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Baños</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min="1"
                        value={data.bathrooms}
                        onChange={(e) => setData('bathrooms', e.target.value)}
                      />
                      {errors.bathrooms && <p className="text-sm text-destructive">{errors.bathrooms}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rooms">Ambientes</Label>
                      <Input
                        id="rooms"
                        type="number"
                        min="1"
                        value={data.rooms}
                        onChange={(e) => setData('rooms', e.target.value)}
                      />
                      {errors.rooms && <p className="text-sm text-destructive">{errors.rooms}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="covered_m2">M² cubiertos</Label>
                      <Input
                        id="covered_m2"
                        type="number"
                        min="1"
                        step="0.01"
                        value={data.covered_m2}
                        onChange={(e) => setData('covered_m2', e.target.value)}
                      />
                      {errors.covered_m2 && <p className="text-sm text-destructive">{errors.covered_m2}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="total_m2">M² totales</Label>
                    <Input
                      id="total_m2"
                      type="number"
                      min="1"
                      step="0.01"
                      value={data.total_m2}
                      onChange={(e) => setData('total_m2', e.target.value)}
                      className="max-w-xs"
                    />
                    {errors.total_m2 && <p className="text-sm text-destructive">{errors.total_m2}</p>}
                  </div>

                  {/* Amenities */}
                  <div className="space-y-2">
                    <Label>Comodidades</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenitiesList.map((amenity) => (
                        <div key={amenity.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity.id}
                            checked={selectedAmenities.includes(amenity.id)}
                            onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
                          />
                          <Label htmlFor={amenity.id} className="text-sm font-normal">
                            {amenity.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Imágenes */}
              <Card>
                <CardHeader>
                  <CardTitle>Imágenes de la propiedad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Subir imágenes (máximo 5)</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                        <div className="space-y-2">
                          <Label htmlFor="images" className="cursor-pointer">
                            <span className="text-primary hover:text-primary/80">Seleccionar imágenes</span>
                            <Input
                              id="images"
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Formatos: JPG, PNG, WebP. Se comprimen automáticamente
                          </p>
                        </div>
                      </div>
                    </div>
                    {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}
                  </div>

                  {/* Preview de imágenes */}
                  {images.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Imágenes seleccionadas ({images.length}/5)</Label>
                        <p className="text-sm text-muted-foreground">
                          Haz clic en la estrella para marcar como portada
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Imagen ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Botones de acción */}
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                type="button"
                                size="sm"
                                variant={coverImageIndex === index ? "default" : "secondary"}
                                className="h-8 w-8 p-0"
                                onClick={() => setCoverImage(index)}
                              >
                                <Star className={`h-4 w-4 ${coverImageIndex === index ? 'fill-current' : ''}`} />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="h-8 w-8 p-0"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {/* Indicador de portada */}
                            {coverImageIndex === index && (
                              <div className="absolute bottom-2 left-2">
                                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                  Portada
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Precio y operación */}
              <Card>
                <CardHeader>
                  <CardTitle>Precio y operación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="operation_type">Operación</Label>
                      <Select value={data.operation_type} onValueChange={(value) => setData('operation_type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar operación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rent">Alquiler</SelectItem>
                          <SelectItem value="sale">Venta</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.operation_type && <p className="text-sm text-destructive">{errors.operation_type}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Precio</Label>
                      <Input
                        id="price"
                        type="number"
                        min="1"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                      />
                      {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Moneda</Label>
                      <Select value={data.currency} onValueChange={(value) => setData('currency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ARS">Pesos (ARS)</SelectItem>
                          <SelectItem value="USD">Dólares (USD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requisitos (opcional)</Label>
                    <Textarea
                      id="requirements"
                      value={data.requirements}
                      onChange={(e) => setData('requirements', e.target.value)}
                      placeholder="Ej: Recibo de sueldo, garantía propietaria..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Botones */}
              <div className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Cancelar</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Publicando...' : 'Publicar propiedad'}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  )
}