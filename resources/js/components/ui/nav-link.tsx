import { Link } from "@inertiajs/react"
import { cn } from "@/lib/utils"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  active?: boolean
  className?: string
}

export function NavLink({ href, children, active = false, className }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
        active 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:text-foreground hover:bg-accent",
        className
      )}
    >
      {children}
    </Link>
  )
}