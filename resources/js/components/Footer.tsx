import { Logo } from "@/components/ui/logo"
import { Link } from "@inertiajs/react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <Logo className="mb-4" />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              La plataforma líder en Villa Ángela para encontrar tu hogar ideal. 
              Conectamos propietarios e inquilinos de manera segura y confiable.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/propiedades" className="text-muted-foreground hover:text-foreground transition-colors">
                  Propiedades
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Villa Ángela, Chaco</li>
              <li>+54 362 123-4567</li>
              <li>info@mialquiler.com</li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Mi Alquiler. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacidad" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-muted-foreground hover:text-foreground transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}