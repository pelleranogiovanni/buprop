import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { NavLink } from "@/components/ui/nav-link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserMenu } from "@/components/UserMenu"
import { Link } from "@inertiajs/react"
import { Menu, User, Heart, Plus } from "lucide-react"
import { useState } from "react"

interface NavbarProps {
  user?: {
    id: number
    name: string
    email: string
    roles?: Array<{ name: string }>
  } | null
}

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Inicio", active: true },
    { href: "/propiedades", label: "Propiedades" },
    { href: "/sobre-nosotros", label: "Sobre nosotros" },
    { href: "/contacto", label: "Contacto" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                active={item.active}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                  <Link href="/favoritos">
                    <Heart className="w-4 h-4 mr-2" />
                    Favoritos
                  </Link>
                </Button>
                {(user.roles?.some(role => ['owner', 'agency'].includes(role.name))) && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/publicar">
                      <Plus className="w-4 h-4 mr-2" />
                      Publicar
                    </Link>
                  </Button>
                )}
                <UserMenu user={user} />
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    Iniciar sesión
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">
                    Registrarse
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {/* Mobile Navigation */}
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      active={item.active}
                      className="block w-full text-left"
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  {user ? (
                    <>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href="/favoritos">
                          <Heart className="w-4 h-4 mr-2" />
                          Favoritos
                        </Link>
                      </Button>
                      {(user.roles?.some(role => ['owner', 'agency'].includes(role.name))) && (
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link href="/publicar">
                            <Plus className="w-4 h-4 mr-2" />
                            Publicar propiedad
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href="/perfil">
                          <User className="w-4 h-4 mr-2" />
                          Mi perfil
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={() => window.location.href = '/logout'}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Cerrar sesión
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full" asChild>
                        <Link href="/login">
                          Iniciar sesión
                        </Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link href="/register">
                          Registrarse
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}