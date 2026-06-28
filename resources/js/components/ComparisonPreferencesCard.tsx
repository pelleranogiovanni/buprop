import { Link } from "@inertiajs/react"
import { Pencil } from "lucide-react"

interface ComparisonPreferencesCardProps {
  chips: string[]
  editUrl?: string
}

export function ComparisonPreferencesCard({ chips, editUrl = "/preferencias" }: ComparisonPreferencesCardProps) {
  if (chips.length === 0) return null

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-[12px] border border-border bg-card p-[18px] sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[14px] font-semibold text-[#0F172A]">
          Tus preferencias usadas para esta comparación
        </span>
        <Link
          href={editUrl}
          className="flex shrink-0 items-center gap-1.5 rounded-[8px] bg-muted px-3.5 py-[7px] text-[12px] font-medium text-[#475569] transition-colors hover:bg-border"
        >
          <Pencil className="h-[13px] w-[13px]" />
          Editar preferencias
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {chips.map((chip, index) => (
          <span
            key={index}
            className="rounded-[20px] bg-muted px-3 py-[5px] text-[12px] text-[#475569]"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  )
}
