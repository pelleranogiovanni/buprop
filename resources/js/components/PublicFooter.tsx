import { Link } from "@inertiajs/react"

const footerLinks = [
    { href: "/", label: "Inicio" },
    { href: "/propiedades", label: "Propiedades" },
    { href: "/publicar", label: "Publicar propiedad" },
    { href: "/contacto", label: "Contacto" },
]

export function PublicFooter() {
    return (
        <footer className="w-full bg-foreground">
            <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-6 px-6 py-6">
                {/* Left: logo + tagline */}
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-base font-extrabold text-primary">
                        BuProp
                    </span>
                    <span className="text-[13px] text-white/40 hidden sm:inline">
                        — Propiedades en Villa Ángela, Chaco
                    </span>
                </div>

                {/* Right: nav links */}
                <nav className="flex items-center gap-6 flex-wrap justify-end">
                    {footerLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-[13px] text-white/40 hover:text-white/80 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </footer>
    )
}
