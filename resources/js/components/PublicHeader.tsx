import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Link } from "@inertiajs/react"
import { Menu } from "lucide-react"
import { useState } from "react"

const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/propiedades", label: "Propiedades" },
    { href: "/publicar", label: "Publicar propiedad" },
]

export function PublicHeader() {
    const [open, setOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full bg-card border-b border-border">
            <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-6 px-6">

                {/* Logo */}
                <Link href="/" className="shrink-0 text-[22px] font-bold text-primary leading-none">
                    BuProp
                </Link>

                {/* Nav links — desktop */}
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm text-[#475569] hover:text-foreground transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions — desktop */}
                <div className="ml-auto hidden md:flex items-center gap-3 shrink-0">
                    <Button variant="secondary" size="sm" className="px-4 text-sm font-medium shadow-none" asChild>
                        <Link href="/login">Iniciar sesión</Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="/register">Registrarse</Link>
                    </Button>
                </div>

                {/* Mobile menu */}
                <div className="ml-auto md:hidden">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Abrir menú">
                                <Menu className="size-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72 pt-10">
                            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                            <div className="flex flex-col gap-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="px-3 py-2 rounded-md text-sm text-[#475569] hover:text-foreground hover:bg-accent transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="border-t border-border mt-3 pt-3 flex flex-col gap-2">
                                    <Button variant="ghost" className="w-full justify-start" asChild>
                                        <Link href="/login" onClick={() => setOpen(false)}>
                                            Iniciar sesión
                                        </Link>
                                    </Button>
                                    <Button className="w-full" asChild>
                                        <Link href="/register" onClick={() => setOpen(false)}>
                                            Registrarse
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </header>
    )
}
