interface PropertyMapProps {
  address: string
  cityName: string
  neighborhoodName?: string
}

export function PropertyMap({ address, cityName, neighborhoodName }: PropertyMapProps) {
  // Generar coordenadas aproximadas para Villa Ángela, Chaco
  const baseLatitude = -27.5667
  const baseLongitude = -60.7167
  
  // Agregar variación aleatoria pequeña basada en la dirección
  const addressHash = address.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const latVariation = (addressHash % 100) / 10000 // ±0.01 grados
  const lngVariation = ((addressHash * 7) % 100) / 10000
  
  const latitude = baseLatitude + latVariation
  const longitude = baseLongitude + lngVariation
  
  const fullAddress = `${address}, ${cityName}, Chaco, Argentina`
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ubicación</h2>
        <a
          href={`https://www.google.com/maps/search/${encodeURIComponent(fullAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm"
        >
          Ver en Google Maps
        </a>
      </div>
      
      <div className="bg-secondary/30 p-4 rounded-lg">
        <div className="text-sm text-muted-foreground mb-1">Dirección</div>
        <div className="font-semibold">{fullAddress}</div>
      </div>
      
      <div className="aspect-[16/9] rounded-xl overflow-hidden border">
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
    </div>
  )
}