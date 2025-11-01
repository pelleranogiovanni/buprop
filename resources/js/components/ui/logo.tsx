import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-10 w-10"
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "rounded-lg bg-primary flex items-center justify-center",
        sizeClasses[size]
      )}>
        <svg 
          className="w-1/2 h-1/2 text-primary-foreground" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </div>
      <span className={cn(
        "font-bold text-foreground",
        textSizes[size]
      )}>
        Mi Alquiler
      </span>
    </div>
  )
}