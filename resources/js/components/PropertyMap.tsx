import { MapPin, ExternalLink } from "lucide-react"

interface PropertyMapProps {
  address: string
  cityName: string
  neighborhoodName?: string
}

export function PropertyMap({ address, cityName, neighborhoodName }: PropertyMapProps) {
  // Coordenadas aproximadas para Villa Ángela, Chaco
  const baseLatitude = -27.5667
  const baseLongitude = -60.7167

  const addressHash = address.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  const latVariation = (addressHash % 100) / 10000
  const lngVariation = ((addressHash * 7) % 100) / 10000

  const latitude = baseLatitude + latVariation
  const longitude = baseLongitude + lngVariation

  const fullAddress = `${address}, ${cityName}, Chaco, Argentina`
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`

  return (
    <div className="flex flex-col gap-4 rounded-[12px] border border-border bg-card p-6">
      <h2 className="text-[15px] font-semibold text-[#0F172A]">Ubicación</h2>

      <div className="flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="text-[13px] text-[#475569]">
          {neighborhoodName && `${neighborhoodName}, `}
          {cityName}, Chaco — ubicación aproximada
        </span>
      </div>

      <div className="h-[180px] overflow-hidden rounded-[10px] border border-border">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa de ${address}`}
        />
      </div>

      <a
        href={`https://www.google.com/maps/search/${encodeURIComponent(fullAddress)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-fit items-center gap-1.5 rounded-[8px] border border-border px-4 py-2 text-[13px] font-medium text-primary transition-colors hover:bg-primary-light"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Abrir en mapa
      </a>
    </div>
  )
}
