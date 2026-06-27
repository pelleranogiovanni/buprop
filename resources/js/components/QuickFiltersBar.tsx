import { useState } from 'react'
import { House, Building2, Banknote, MapPin, ChevronDown, Search } from 'lucide-react'
import { router } from '@inertiajs/react'
import { cn } from '@/lib/utils'

interface Neighborhood {
  neighborhood_id: string
  name: string
}

interface InitialFilters {
  operation_type?: string
  property_type?: string
  neighborhood_id?: string
  min_price?: string
  max_price?: string
}

interface QuickFiltersBarProps {
  neighborhoods: Neighborhood[]
  initialFilters?: InitialFilters
  targetPath?: string
}

function FilterCell({
  icon: Icon,
  label,
  value,
  noBorder,
  children,
}: {
  icon: React.ElementType
  label: string
  value: string
  noBorder?: boolean
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'relative flex flex-1 flex-col gap-1 px-5 py-4',
        !noBorder && 'border-r border-[#E2E8F0]',
      )}
    >
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-primary" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="flex items-center justify-between gap-1">
        <span className="truncate text-sm font-medium text-foreground">{value}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </div>
      {children}
    </div>
  )
}

export function QuickFiltersBar({
  neighborhoods,
  initialFilters = {},
  targetPath = '/properties',
}: QuickFiltersBarProps) {
  const [op, setOp] = useState(initialFilters.operation_type ?? '')
  const [propType, setPropType] = useState(initialFilters.property_type ?? '')
  const [minPrice, setMinPrice] = useState(initialFilters.min_price ?? '')
  const [maxPrice, setMaxPrice] = useState(initialFilters.max_price ?? '')
  const [zone, setZone] = useState(initialFilters.neighborhood_id ?? '')
  const [showPricePopover, setShowPricePopover] = useState(false)

  const opLabel =
    op === 'rent' ? 'Alquiler' : op === 'sale' ? 'Venta' : 'Alquiler / Venta'

  const typeLabel =
    propType === 'house'
      ? 'Casa'
      : propType === 'apartment'
        ? 'Departamento'
        : propType === 'commercial'
          ? 'Local comercial'
          : 'Casa / Departamento / Local'

  const priceLabel =
    minPrice || maxPrice
      ? `$${minPrice || '0'} – $${maxPrice || '∞'}`
      : '$0 – sin límite'

  const zoneLabel = zone
    ? (neighborhoods.find(n => n.neighborhood_id === zone)?.name ?? 'Todos los barrios')
    : 'Todos los barrios'

  const handleApply = () => {
    const params: Record<string, string> = {}
    if (op) params.operation_type = op
    if (propType) params.property_type = propType
    if (minPrice) params.min_price = minPrice
    if (maxPrice) params.max_price = maxPrice
    if (zone) params.neighborhood_id = zone
    router.get(targetPath, params)
  }

  return (
    <div
      className="flex w-full justify-center bg-white"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
    >
      <div className="flex w-full" style={{ maxWidth: 1200 }}>
        {/* OPERACIÓN */}
        <FilterCell icon={House} label="OPERACIÓN" value={opLabel}>
          <select
            value={op}
            onChange={e => setOp(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          >
            <option value="">Alquiler / Venta</option>
            <option value="rent">Alquiler</option>
            <option value="sale">Venta</option>
          </select>
        </FilterCell>

        {/* PROPIEDAD */}
        <FilterCell icon={Building2} label="PROPIEDAD" value={typeLabel}>
          <select
            value={propType}
            onChange={e => setPropType(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          >
            <option value="">Casa / Departamento / Local</option>
            <option value="house">Casa</option>
            <option value="apartment">Departamento</option>
            <option value="commercial">Local comercial</option>
          </select>
        </FilterCell>

        {/* PRECIO */}
        <FilterCell icon={Banknote} label="PRECIO" value={priceLabel}>
          <button
            type="button"
            onClick={() => setShowPricePopover(v => !v)}
            className="absolute inset-0 h-full w-full"
          />
          {showPricePopover && (
            <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-border bg-white p-4 shadow-lg">
              <div className="flex flex-col gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.5px] text-muted-foreground">
                    Precio mínimo
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="h-9 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.5px] text-muted-foreground">
                    Precio máximo
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    placeholder="Sin límite"
                    className="h-9 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPricePopover(false)}
                  className="h-9 w-full rounded-md bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </FilterCell>

        {/* ZONA */}
        <FilterCell icon={MapPin} label="ZONA" value={zoneLabel} noBorder>
          <select
            value={zone}
            onChange={e => setZone(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          >
            <option value="">Todos los barrios</option>
            {neighborhoods.map(n => (
              <option key={n.neighborhood_id} value={n.neighborhood_id}>
                {n.name}
              </option>
            ))}
          </select>
        </FilterCell>

        {/* Aplicar */}
        <div className="flex items-center px-5">
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Search className="h-3.5 w-3.5" />
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  )
}
