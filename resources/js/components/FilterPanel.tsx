import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { router } from '@inertiajs/react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface Neighborhood {
  neighborhood_id: string
  name: string
}

interface FilterPanelProps {
  initialFilters?: {
    operation_type?: string
    property_type?: string
    neighborhood_id?: string
    min_price?: string
    max_price?: string
    bedrooms?: string
    q?: string
    sort?: string
    features?: string[]
  }
  neighborhoods?: Neighborhood[]
  basePath?: string
}

const PROPERTY_TYPES = [
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Departamento' },
  { value: 'commercial', label: 'Oficina / Local' },
]

const BEDROOM_OPTIONS = ['1', '2', '3', '4']

const FEATURE_OPTIONS = [
  { value: 'garage', label: 'Garaje / Cochera' },
  { value: 'pool', label: 'Pileta / Piscina' },
  { value: 'air_conditioning', label: 'Aire acondicionado' },
  { value: 'furnished', label: 'Amueblado' },
  { value: 'pets', label: 'Apto mascotas' },
]

export function FilterPanel({
  initialFilters = {},
  neighborhoods = [],
  basePath = '/properties',
}: FilterPanelProps) {
  const [op, setOp] = useState(initialFilters.operation_type ?? '')
  const [propType, setPropType] = useState(initialFilters.property_type ?? '')
  const [neighborhoodId, setNeighborhoodId] = useState(initialFilters.neighborhood_id ?? '')
  const [minPrice, setMinPrice] = useState(initialFilters.min_price ?? '')
  const [maxPrice, setMaxPrice] = useState(initialFilters.max_price ?? '')
  const [bedrooms, setBedrooms] = useState(initialFilters.bedrooms ?? '')
  const [features, setFeatures] = useState<string[]>(
    Array.isArray(initialFilters.features) ? initialFilters.features : []
  )

  const toggleOp = (value: string) => setOp(prev => (prev === value ? '' : value))
  const toggleType = (value: string) => setPropType(prev => (prev === value ? '' : value))
  const toggleBedrooms = (value: string) => setBedrooms(prev => (prev === value ? '' : value))
  const toggleFeature = (value: string) =>
    setFeatures(prev =>
      prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
    )

  const handleApply = () => {
    const params: Record<string, string | string[]> = {}
    if (initialFilters.q) params.q = initialFilters.q
    if (initialFilters.sort) params.sort = initialFilters.sort
    if (op) params.operation_type = op
    if (propType) params.property_type = propType
    if (neighborhoodId && neighborhoodId !== 'all') params.neighborhood_id = neighborhoodId
    if (minPrice) params.min_price = minPrice
    if (maxPrice) params.max_price = maxPrice
    if (bedrooms) params.bedrooms = bedrooms
    if (features.length > 0) params.features = features
    router.get(basePath, params)
  }

  const handleClear = () => {
    setOp('')
    setPropType('')
    setNeighborhoodId('')
    setMinPrice('')
    setMaxPrice('')
    setBedrooms('')
    setFeatures([])
    const params = initialFilters.q ? { q: initialFilters.q } : {}
    router.get(basePath, params)
  }

  return (
    <div className="w-[280px] shrink-0 overflow-hidden rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-[14px]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-foreground" />
          <span className="text-[15px] font-semibold text-foreground">Filtros</span>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="rounded px-2 py-1 text-xs text-primary transition-colors hover:bg-muted"
        >
          Limpiar
        </button>
      </div>

      {/* Sections */}
      <div className="flex flex-col divide-y divide-border">
        {/* Tipo de operación */}
        <div className="flex flex-col gap-3 px-5 py-4">
          <span className="text-[13px] font-semibold text-foreground">Tipo de operación</span>
          {[
            { value: 'sale', label: 'Venta' },
            { value: 'rent', label: 'Alquiler' },
          ].map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2.5">
              <Checkbox
                id={`op-${value}`}
                checked={op === value}
                onCheckedChange={() => toggleOp(value)}
              />
              <label
                htmlFor={`op-${value}`}
                className="cursor-pointer select-none text-sm text-foreground"
              >
                {label}
              </label>
            </div>
          ))}
        </div>

        {/* Tipo de propiedad */}
        <div className="flex flex-col gap-3 px-5 py-4">
          <span className="text-[13px] font-semibold text-foreground">Tipo de propiedad</span>
          {PROPERTY_TYPES.map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2.5">
              <Checkbox
                id={`type-${value}`}
                checked={propType === value}
                onCheckedChange={() => toggleType(value)}
              />
              <label
                htmlFor={`type-${value}`}
                className="cursor-pointer select-none text-sm text-foreground"
              >
                {label}
              </label>
            </div>
          ))}
        </div>

        {/* Zona / Barrio */}
        {neighborhoods.length > 0 && (
          <div className="flex flex-col gap-3 px-5 py-4">
            <span className="text-[13px] font-semibold text-foreground">Zona / Barrio</span>
            <select
              value={neighborhoodId}
              onChange={e => setNeighborhoodId(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">Todos los barrios</option>
              {neighborhoods.map(n => (
                <option key={n.neighborhood_id} value={n.neighborhood_id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Rango de precio */}
        <div className="flex flex-col gap-3 px-5 py-4">
          <span className="text-[13px] font-semibold text-foreground">Rango de precio</span>
          <div className="flex flex-col gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              placeholder="Precio mínimo"
              className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              placeholder="Precio máximo"
              className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
        </div>

        {/* Dormitorios */}
        <div className="flex flex-col gap-3 px-5 py-4">
          <span className="text-[13px] font-semibold text-foreground">Dormitorios</span>
          <div className="flex gap-2">
            {BEDROOM_OPTIONS.map(n => (
              <button
                key={n}
                type="button"
                onClick={() => toggleBedrooms(n)}
                className={cn(
                  'h-9 min-w-9 rounded-md border px-2 text-sm font-medium transition-colors',
                  bedrooms === n
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-background text-foreground hover:border-primary/50',
                )}
              >
                {n === '4' ? '4+' : n}
              </button>
            ))}
          </div>
        </div>

        {/* Características */}
        <div className="flex flex-col gap-3 px-5 py-4">
          <span className="text-[13px] font-semibold text-foreground">Características</span>
          {FEATURE_OPTIONS.map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2.5">
              <Checkbox
                id={`feat-${value}`}
                checked={features.includes(value)}
                onCheckedChange={() => toggleFeature(value)}
              />
              <label
                htmlFor={`feat-${value}`}
                className="cursor-pointer select-none text-sm text-foreground"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4">
        <button
          type="button"
          onClick={handleApply}
          className="w-full rounded-lg bg-primary py-[10px] text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  )
}
