import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PropertyImageGalleryProps {
  listingId: string
  propertyType: string
  cityName: string
  images?: Array<{
    url: string
    is_cover: boolean
    sort_order: number
  }>
}

export function PropertyImageGallery({ listingId, propertyType, cityName, images: dbImages }: PropertyImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)

  const images = dbImages && dbImages.length > 0
    ? dbImages.map(img => img.url)
    : Array.from({ length: 5 }, (_, i) => `https://picsum.photos/800/600?random=${listingId}-${i}`)

  const prev = () => setCurrentImage(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrentImage(i => (i + 1) % images.length)

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        <img
          src={images[currentImage]}
          alt={`${propertyType} en ${cityName} — imagen ${currentImage + 1}`}
          className="h-full w-full object-cover"
        />

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-3 right-3">
          <span className="rounded-full bg-black/50 px-3 py-1 text-xs text-white">
            {currentImage + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${
                currentImage === index
                  ? 'border-primary shadow-sm'
                  : 'border-border hover:border-muted-foreground'
              }`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <img
                src={image}
                alt={`Miniatura ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
