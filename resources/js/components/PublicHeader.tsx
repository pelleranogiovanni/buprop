import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Link, router } from "@inertiajs/react"
import { Menu, Search, BarChart3 } from "lucide-react"
import { useState } from "react"
import { useCompare } from "@/contexts/CompareContext"

const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/propiedades", label: "Propiedades" },
    { href: "/contacto", label: "Contacto" },
]

function HeaderSearchBar() {
    const [query, setQuery] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.get("/", { q: query.trim() }, { preserveState: false })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="hidden md:flex flex-1 max-w-xl">
            <div className="flex items-center gap-2 w-full h-10 rounded-md border border-input bg-background px-4 text-sm text-muted-foreground focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 transition-all">
                <Search className="size-4 shrink-0" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar propiedades en Villa Ángela..."
                    className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                />
            </div>
        </form>
    )
}

export function PublicHeader() {
    const [open, setOpen] = useState(false)
    const { compareList } = useCompare()

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
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Search bar — desktop */}
                <HeaderSearchBar />

                {/* Actions — desktop */}
                <div className="hidden md:flex items-center gap-3 shrink-0">
                    <Link href="/comparador" className="relative">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <BarChart3 className="size-4" />
                            Comparar
                        </Button>
                        {compareList.length > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center">
                                {compareList.length}
                            </Badge>
                        )}
                    </Link>
                    <Button variant="ghost" size="sm" asChild>
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
                                        className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <Link
                                    href="/comparador"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                >
                                    <BarChart3 className="size-4" />
                                    Comparar
                                    {compareList.length > 0 && (
                                        <Badge className="ml-auto h-4 w-4 p-0 text-[10px] flex items-center justify-center">
                                            {compareList.length}
                                        </Badge>
                                    )}
                                </Link>
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
