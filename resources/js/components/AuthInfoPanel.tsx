import { CircleCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const benefits = [
    "Comparar propiedades seleccionadas",
    "Guardar tus preferencias de búsqueda",
    "Contactar directamente al propietario",
    "Acceder desde cualquier dispositivo",
]

interface AuthInfoPanelProps {
    title?: string
    description?: string
    className?: string
}

export function AuthInfoPanel({
    title = "Creá tu cuenta y continuá tu búsqueda.",
    description = "Registrate como interesado para comparar propiedades, guardar tus preferencias y acceder a más funciones.",
    className,
}: AuthInfoPanelProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-6 rounded-xl bg-primary p-8",
                className
            )}
        >
            {/* Title */}
            <h2 className="text-[22px] font-bold text-white leading-snug">
                {title}
            </h2>

            {/* Description */}
            <p className="text-sm text-blue-300 leading-relaxed">
                {description}
            </p>

            {/* Benefits list */}
            <ul className="flex flex-col gap-3">
                {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2.5">
                        <CircleCheck className="size-4 shrink-0 text-blue-300" />
                        <span className="text-sm text-white">{benefit}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
