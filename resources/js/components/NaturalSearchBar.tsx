import { useState } from "react"
import { Search } from "lucide-react"
import { router } from "@inertiajs/react"
import { cn } from "@/lib/utils"

interface NaturalSearchBarProps {
  initialValue?: string
  className?: string
}

export function NaturalSearchBar({ initialValue = "", className }: NaturalSearchBarProps) {
  const [value, setValue] = useState(initialValue)

  const handleSearch = () => {
    router.get("/", { q: value || undefined }, { preserveState: true, preserveScroll: true })
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card px-5 py-3.5 shadow-sm",
        className
      )}
    >
      <Search className="h-[18px] w-[18px] shrink-0 text-primary" />

      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-[11px] font-medium text-muted-foreground">¿Qué estás buscando?</span>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="Ej: Casa en alquiler con jardín y 2 dormitorios"
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
        />
      </div>

      <button
        onClick={handleSearch}
        className="flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-[18px] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Buscar</span>
      </button>
    </div>
  )
}
