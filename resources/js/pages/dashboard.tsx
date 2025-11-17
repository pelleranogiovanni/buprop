import { Head, Link, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'

interface Listing {
  listing_id: string
  operation_type: string
  price: number
  currency: string
  availability_status: string
  moderation_status: string
  created_at: string
  property_type: string
  address: string
  bedrooms: number
  bathrooms: number
  covered_m2: number
  city_name: string
  neighborhood_name?: string
  publisher_name?: string
  cover_image?: string
}

interface User {
  id: number
  name: string
  email: string
  roles?: Array<{ name: string }>
}

interface DashboardProps {
  listings: Listing[]
  auth: {
    user: User
  }
}

export default function Dashboard({ listings = [], auth }: DashboardProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', variant: 'secondary' as const },
      approved: { label: 'Aprobada', variant: 'default' as const },
      rejected: { label: 'Rechazada', variant: 'destructive' as const },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getAvailabilityBadge = (status: string) => {
    const statusConfig = {
      available: { label: 'Disponible', variant: 'default' as const },
      rented: { label: 'Alquilada', variant: 'secondary' as const },
      sold: { label: 'Vendida', variant: 'secondary' as const },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency === 'ARS' ? 'ARS' : 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getPropertyTypeLabel = (type: string) => {
    const types = {
      house: 'Casa',
      apartment: 'Departamento',
      commercial: 'Local comercial'
    }
    return types[type as keyof typeof types] || type
  }

  const getOperationTypeLabel = (type: string) => {
    return type === 'rent' ? 'Alquiler' : 'Venta'
  }

  return (
    <>
      <Head title="Dashboard - Mi Alquiler" />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar user={auth.user} />
        
        <div className="container mx-auto px-6 py-8 flex-1">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                  Gestiona tus publicaciones y propiedades
                </p>
              </div>
              
              {auth.user.roles?.some(role => ['owner', 'agency'].includes(role.name)) && (
                <Button asChild>
                  <Link href="/publicar">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva publicación
                  </Link>
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{listings?.length || 0}</div>
                  <p className="text-sm text-muted-foreground">Total publicaciones</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-green-600">
                    {listings?.filter(l => l.moderation_status === 'approved').length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Aprobadas</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-yellow-600">
                    {listings?.filter(l => l.moderation_status === 'pending').length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600">
                    {listings?.filter(l => l.availability_status === 'available').length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Disponibles</p>
                </CardContent>
              </Card>
            </div>



            {/* Listings Table */}
            <Card>
              <CardHeader>
                <CardTitle>Mis publicaciones ({listings?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {listings && listings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-medium">Propiedad</th>
                          {auth.user.roles?.some(role => role.name === 'admin') && (
                            <th className="text-left p-4 font-medium">Publicador</th>
                          )}
                          <th className="text-left p-4 font-medium">Precio</th>
                          <th className="text-left p-4 font-medium">Estado</th>
                          <th className="text-left p-4 font-medium">Disponibilidad</th>
                          <th className="text-left p-4 font-medium">Fecha</th>
                          <th className="text-left p-4 font-medium">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listings.map((listing) => (
                          <tr key={listing.listing_id} className="border-b hover:bg-accent/50">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {listing.cover_image && (
                                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    <img
                                      src={listing.cover_image}
                                      alt="Portada"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <div className="font-semibold">
                                    {getPropertyTypeLabel(listing.property_type)} - {getOperationTypeLabel(listing.operation_type)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {listing.address}, {listing.city_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {listing.bedrooms} dorm • {listing.bathrooms} baños • {listing.covered_m2}m²
                                  </div>
                                </div>
                              </div>
                            </td>
                            {auth.user.roles?.some(role => role.name === 'admin') && (
                              <td className="p-4">
                                <div className="text-sm">{listing.publisher_name}</div>
                              </td>
                            )}
                            <td className="p-4">
                              <div className="font-semibold text-primary">
                                {formatPrice(listing.price, listing.currency)}
                              </div>
                            </td>
                            <td className="p-4">
                              {getStatusBadge(listing.moderation_status)}
                            </td>
                            <td className="p-4">
                              {getAvailabilityBadge(listing.availability_status)}
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                {new Date(listing.created_at).toLocaleDateString('es-AR')}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/propiedad/${listing.listing_id}`}>
                                    <Eye className="w-4 h-4" />
                                  </Link>
                                </Button>
                                {auth.user.roles?.some(role => role.name === 'admin') ? (
                                  <>
                                    {listing.moderation_status !== 'approved' && (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="text-green-600"
                                        onClick={() => {
                                          router.patch(`/listings/${listing.listing_id}/moderation`, {
                                            status: 'approved'
                                          });
                                        }}
                                      >
                                        Aprobar
                                      </Button>
                                    )}
                                    {listing.moderation_status !== 'rejected' && (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="text-red-600"
                                        onClick={() => {
                                          router.patch(`/listings/${listing.listing_id}/moderation`, {
                                            status: 'rejected'
                                          });
                                        }}
                                      >
                                        Rechazar
                                      </Button>
                                    )}
                                  </>
                                ) : (
                                  <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground mb-4">
                      No tienes publicaciones aún
                    </div>
                    {auth.user.roles?.some(role => ['owner', 'agency'].includes(role.name)) && (
                      <Button asChild>
                        <Link href="/publicar">
                          <Plus className="w-4 h-4 mr-2" />
                          Crear primera publicación
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  )
}