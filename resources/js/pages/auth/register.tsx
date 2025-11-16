import { Head, Link, useForm, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RoleSelector } from '@/components/RoleSelector'
import { Logo } from '@/components/ui/logo'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Enviando datos:', data)
    post('/register')
  }

  return (
    <>
      <Head title="Registro - Mi Alquiler" />
      
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Link href="/" className="inline-block">
              <Logo size="lg" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Crear cuenta</h1>
              <p className="text-muted-foreground">
                Únete a la comunidad de Mi Alquiler
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Registro</CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selector de rol */}
                <RoleSelector
                  selectedRole={data.role}
                  onRoleSelect={(role) => setData('role', role)}
                />
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role}</p>
                )}

                {/* Datos personales */}
                {data.role && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Tu nombre completo"
                        required
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="tu@email.com"
                        required
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="+54 362 123-4567"
                        required
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={data.password}
                          onChange={(e) => setData('password', e.target.value)}
                          placeholder="Mínimo 8 caracteres"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                      <div className="relative">
                        <Input
                          id="password_confirmation"
                          type={showConfirmPassword ? "text" : "password"}
                          value={data.password_confirmation}
                          onChange={(e) => setData('password_confirmation', e.target.value)}
                          placeholder="Repite tu contraseña"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={processing}
                    >
                      {processing ? 'Creando cuenta...' : 'Crear cuenta'}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Iniciar sesión
              </Link>
            </p>
            
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}