import { Head, Link } from '@inertiajs/react'
import { Navbar } from '@/components/Navbar'
import { PropertyImageGallery } from '@/components/PropertyImageGallery'
import { PropertyInfo } from '@/components/PropertyInfo'
import { ContactSection } from '@/components/ContactForm'
import { PropertyMap } from '@/components/PropertyMap'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Share2, Heart } from 'lucide-react'

interface Property {
  listing_id: string
  operation_type: string
  price: number
  currency: string
  requirements: string
  available_from: string
  property_type: string
  address: string
  bedrooms: number
  bathrooms: number
  rooms: number
  covered_m2: number
  total_m2: number
  amenities: string[]
  city_name: string
  neighborhood_name?: string
  owner_name: string
  publisher_name: string
  publisher_phone?: string
  images?: Array<{
    url: string
    is_cover: boolean
    sort_order: number
  }>
}

interface PropertyDetailProps {
  property: Property
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const getPropertyTypeLabel = (type: string) => {
    const types = {
      house: 'Casa',
      apartment: 'Departamento', 
      commercial: 'Local comercial'
    }
    return types[type as keyof typeof types] || type
  }

  return (
    <>
      <Head title={`${getPropertyTypeLabel(property.property_type)} en ${property.city_name} - Mi Alquiler`} />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-6 py-8 flex-1">
          {/* Navegación */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a resultados
              </Link>
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda - Imágenes e información */}
            <div className="lg:col-span-2 space-y-8">
              <PropertyImageGallery
                listingId={property.listing_id}
                propertyType={property.property_type}
                cityName={property.city_name}
                images={property.images}
              />
              
              <PropertyInfo property={property} />
            </div>

            {/* Columna derecha - Formulario de contacto */}
            <div className="lg:col-span-1">
              <ContactSection
                listingId={property.listing_id}
                publisherName={property.publisher_name}
                publisherPhone={property.publisher_phone}
              />
            </div>
          </div>

          {/* Mapa */}
          <div className="mt-12">
            <PropertyMap
              address={property.address}
              cityName={property.city_name}
              neighborhoodName={property.neighborhood_name}
            />
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  )
}