import { useState } from "react"
import { Camera } from "lucide-react"

interface PropertyImageGalleryProps {
  listingId: string
  propertyType: string
  cityName: string
  operationType: string
  availabilityStatus?: string
  images?: Array<{
    url: string
    is_cover: boolean
    sort_order: number
  }>
}

const availabilityLabels: Record<string, string> = {
  available: "Disponible",
  reserved: "Reservada",
  rented: "Alquilada",
  sold: "Vendida",
}

const THUMB_COUNT = 3

export function PropertyImageGallery({
  listingId,
  propertyType,
  cityName,
  operationType,
  availabilityStatus = "available",
  images: dbImages,
}: PropertyImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)

  const images = dbImages && dbImages.length > 0
    ? dbImages.map(img => img.url)
    : Array.from({ length: 5 }, (_, i) => `https://picsum.photos/800/600?random=${listingId}-${i}`)

  const availabilityLabel = availabilityLabels[availabilityStatus] ?? availabilityLabels.available
  const thumbs = images.slice(0, THUMB_COUNT)
  const remaining = images.length - THUMB_COUNT

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      {/* Main image */}
      <div className="relative aspect-[4/3] flex-1 overflow-hidden rounded-[12px] bg-muted md:aspect-auto md:h-[460px]">
        <img
          src={images[currentImage]}
          alt={`${propertyType} en ${cityName} — imagen ${currentImage + 1}`}
          className="h-full w-full object-cover"
        />

        {/* Badges */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span
            className={`rounded-[20px] px-3 py-[5px] text-[12px] font-semibold text-white ${
              operationType === "rent" ? "bg-[#1E40AF]" : "bg-[#5B21B6]"
            }`}
          >
            {operationType === "rent" ? "Alquiler" : "Venta"}
          </span>
          <span className="rounded-[20px] bg-[#065F46CC] px-3 py-[5px] text-[12px] font-semibold text-white">
            {availabilityLabel}
          </span>
        </div>

        {/* Ver todas las fotos */}
        <button
          type="button"
          onClick={() => setCurrentImage(0)}
          className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-[8px] bg-[#000000AA] px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-black/80"
        >
          <Camera className="h-3.5 w-3.5" />
          Ver todas las fotos
        </button>
      </div>

      {/* Thumbnails — vertical strip */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-2 md:flex md:w-[220px] md:flex-col">
          {thumbs.map((image, index) => {
            const isLastThumb = index === THUMB_COUNT - 1 && remaining > 0
            return (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`relative aspect-[3/2] overflow-hidden rounded-[10px] transition-all md:h-[147px] md:aspect-auto ${
                  currentImage === index ? "ring-2 ring-primary" : ""
                }`}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <img src={image} alt={`Miniatura ${index + 1}`} className="h-full w-full object-cover" />
                {isLastThumb && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#000000AA] text-[14px] font-bold text-white">
                    +{remaining} fotos
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
