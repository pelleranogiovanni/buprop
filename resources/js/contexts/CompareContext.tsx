import { createContext, useContext, useState, ReactNode } from 'react'

interface Property {
  listing_id: string
  operation_type: string
  price: number
  currency: string
  property_type: string
  address: string
  bedrooms: number
  bathrooms: number
  covered_m2: number
  city_name: string
  neighborhood_name?: string
  publisher_name: string
  cover_image?: string
}

interface CompareContextType {
  compareList: Property[]
  addToCompare: (property: Property) => void
  removeFromCompare: (listingId: string) => void
  clearCompare: () => void
  isInCompare: (listingId: string) => boolean
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Property[]>([])

  const addToCompare = (property: Property) => {
    setCompareList(prev => {
      if (prev.length >= 3 || prev.some(p => p.listing_id === property.listing_id)) {
        return prev
      }
      return [...prev, property]
    })
  }

  const removeFromCompare = (listingId: string) => {
    setCompareList(prev => prev.filter(p => p.listing_id !== listingId))
  }

  const clearCompare = () => {
    setCompareList([])
  }

  const isInCompare = (listingId: string) => {
    return compareList.some(p => p.listing_id === listingId)
  }

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare
    }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider')
  }
  return context
}