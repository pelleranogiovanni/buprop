import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { router } from "@inertiajs/react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { useState } from "react"

interface Neighborhood {
  neighborhood_id: string
  name: string
}

interface PropertyFiltersProps {
  neighborhoods: Neighborhood[]
  filters: {
    operation_type?: string
    property_type?: string
    neighborhood_id?: string
    min_price?: string
    max_price?: string
    bedrooms?: string
  }
}

export function PropertyFilters({ neighborhoods, filters }: PropertyFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [showAdvanced, setShowAdvanced] = useState(false)
  


  const handleSearch = () => {
    router.get('/', localFilters, { preserveState: true })
  }

  const handleClear = () => {
    setLocalFilters({})
    router.get('/', {}, { preserveState: true })
  }

  const activeFiltersCount = Object.values(localFilters).filter(Boolean).length

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        {/* Main Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select
              value={localFilters.operation_type || ""}
              onValueChange={(value) => setLocalFilters(prev => ({ ...prev, operation_type: value }))}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Comprar o Alquilar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Comprar</SelectItem>
                <SelectItem value="rent">Alquilar</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={localFilters.property_type || ""}
              onValueChange={(value) => setLocalFilters(prev => ({ ...prev, property_type: value }))}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Tipo de propiedad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">Casa</SelectItem>
                <SelectItem value="apartment">Departamento</SelectItem>
                <SelectItem value="commercial">Local comercial</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={localFilters.neighborhood_id || ""}
              onValueChange={(value) => setLocalFilters(prev => ({ ...prev, neighborhood_id: value }))}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Zona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las zonas</SelectItem>
                {Array.isArray(neighborhoods) && neighborhoods.length > 0 ? (
                  neighborhoods.map((neighborhood) => (
                    <SelectItem key={neighborhood.neighborhood_id} value={neighborhood.neighborhood_id}>
                      {neighborhood.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-data" disabled>No hay zonas disponibles</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-12 px-4"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            
            <Button onClick={handleSearch} size="lg" className="h-12 px-8">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Precio mínimo</label>
                <Input
                  type="number"
                  placeholder="$ 0"
                  value={localFilters.min_price || ""}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, min_price: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Precio máximo</label>
                <Input
                  type="number"
                  placeholder="$ Sin límite"
                  value={localFilters.max_price || ""}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, max_price: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Dormitorios</label>
                <Select
                  value={localFilters.bedrooms || ""}
                  onValueChange={(value) => setLocalFilters(prev => ({ ...prev, bedrooms: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquier cantidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Cualquier cantidad</SelectItem>
                    <SelectItem value="1">1 dormitorio</SelectItem>
                    <SelectItem value="2">2 dormitorios</SelectItem>
                    <SelectItem value="3">3 dormitorios</SelectItem>
                    <SelectItem value="4">4 dormitorios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="ghost" onClick={handleClear} className="text-gray-600">
                <X className="w-4 h-4 mr-2" />
                Limpiar filtros
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}