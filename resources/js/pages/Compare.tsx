import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useCompare } from '@/contexts/CompareContext'
import { ArrowLeft, X, MapPin, Bed, Bath, Square } from 'lucide-react'

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useCompare()

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency === 'ARS' ? 'ARS' : 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getPropertyTypeLabel = (type: string) => {
    const types = {
      house: 'Casa',
      apartment: 'Departamento',
      commercial: 'Local comercial'
    }
    return types[type as keyof typeof types] || type
  }

  const getOperationTypeLabel = (type: string) => {
    return type === 'rent' ? 'Alquiler' : 'Venta'
  }

  if (compareList.length === 0) {
    return (
      <>
        <Head title="Comparador - Mi Alquiler" />
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <div className="container mx-auto px-6 py-8 flex-1">
            <div className="max-w-2xl mx-auto text-center py-16">
              <h1 className="text-3xl font-bold mb-4">Comparador de Propiedades</h1>
              <p className="text-muted-foreground mb-8">
                No tienes propiedades para comparar. Agrega hasta 3 propiedades desde las tarjetas de propiedades.
              </p>
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al inicio
                </Link>
              </Button>
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }

  return (
    <>
      <Head title="Comparador - Mi Alquiler" />
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-6 py-8 flex-1">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">Comparador de Propiedades</h1>
                <p className="text-muted-foreground">
                  Comparando {compareList.length} de 3 propiedades
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearCompare}>
                  Limpiar todo
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compareList.map((property) => (
              <Card key={property.listing_id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => removeFromCompare(property.listing_id)}
                >
                  <X className="w-4 h-4" />
                </Button>
                
                <CardHeader className="pb-4">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4">
                    <img
                      src={property.cover_image || `https://picsum.photos/400/300?random=${property.listing_id}`}
                      alt={getPropertyTypeLabel(property.property_type)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-lg">
                    {getPropertyTypeLabel(property.property_type)}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {getOperationTypeLabel(property.operation_type)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(property.price, property.currency)}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">
                      {property.address}, {property.city_name}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Dormitorios</span>
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        <span className="font-medium">{property.bedrooms}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Baños</span>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        <span className="font-medium">{property.bathrooms}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Superficie</span>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        <span className="font-medium">{property.covered_m2}m²</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Zona</span>
                      <span className="font-medium text-sm">
                        {property.neighborhood_name || property.city_name}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Publicado por</span>
                      <span className="font-medium text-sm">{property.publisher_name}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" asChild>
                    <Link href={`/propiedad/${property.listing_id}`}>
                      Ver detalles
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  )
}