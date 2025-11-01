import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { NavLink } from "@/components/ui/nav-link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, Heart, Plus } from "lucide-react"
import { useState } from "react"

interface NavbarProps {
  user?: {
    id: number
    name: string
    email: string
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
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Heart className="w-4 h-4 mr-2" />
                  Favoritos
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Publicar
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <User className="w-4 h-4 mr-2" />
                  {user.name}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm">
                  Iniciar sesión
                </Button>
                <Button size="sm">
                  Registrarse
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
                      <Button variant="ghost" className="w-full justify-start">
                        <Heart className="w-4 h-4 mr-2" />
                        Favoritos
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        Publicar propiedad
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Mi perfil
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full">
                        Iniciar sesión
                      </Button>
                      <Button className="w-full">
                        Registrarse
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