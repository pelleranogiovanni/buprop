import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, router } from "@inertiajs/react"
import { Menu, User, LogOut, Settings } from "lucide-react"
import { useState } from "react"
import { useInitials } from "@/hooks/use-initials"

interface AuthUser {
    id: number
    name: string
    email: string
    roles?: Array<{ name: string }>
}

interface AuthenticatedHeaderProps {
    user: AuthUser
}

const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/properties", label: "Propiedades" },
    { href: "/publicar", label: "Publicar propiedad" },
]

export function AuthenticatedHeader({ user }: AuthenticatedHeaderProps) {
    const [open, setOpen] = useState(false)
    const getInitials = useInitials()
    const initials = getInitials(user.name)

    const handleLogout = () => {
        router.post("/logout")
    }

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

                {/* Account — desktop */}
                <div className="ml-auto hidden md:flex items-center gap-3 shrink-0">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="outline-none" aria-label="Menú de usuario">
                                <Avatar className="size-9 cursor-pointer ring-2 ring-transparent hover:ring-primary/30 transition-all">
                                    <AvatarFallback className="bg-primary-light text-primary text-xs font-semibold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <div className="px-3 py-2">
                                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/settings/profile">
                                    <User className="size-4" />
                                    Mi perfil
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/settings">
                                    <Settings className="size-4" />
                                    Configuración
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="text-destructive focus:text-destructive"
                            >
                                <LogOut className="size-4" />
                                Cerrar sesión
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                                <div className="px-3 py-2 mb-2 border-b border-border">
                                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
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
                                <div className="border-t border-border mt-2 pt-2">
                                    <button
                                        onClick={() => { setOpen(false); handleLogout() }}
                                        className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                    >
                                        <LogOut className="size-4" />
                                        Cerrar sesión
                                    </button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </header>
    )
}
