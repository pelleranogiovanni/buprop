import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyImageGalleryProps {
  listingId: string
  propertyType: string
  cityName: string
}

export function PropertyImageGallery({ listingId, propertyType, cityName }: PropertyImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  
  // Generar 5 imágenes usando Picsum con diferentes seeds
  const images = Array.from({ length: 5 }, (_, index) => 
    `https://picsum.photos/800/600?random=${listingId}-${index}`
  )

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
        <img
          src={images[currentImage]}
          alt={`${propertyType} en ${cityName} - Imagen ${currentImage + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Controles de navegación */}
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={prevImage}
            className="bg-white/90 hover:bg-white shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={nextImage}
            className="bg-white/90 hover:bg-white shadow-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Indicador de imagen */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImage + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Miniaturas */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
              currentImage === index 
                ? 'border-primary shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={image}
              alt={`Miniatura ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}