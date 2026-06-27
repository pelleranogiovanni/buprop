import * as React from "react"
import { Info, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"

type InfoBannerVariant = "info" | "warning"

interface InfoBannerProps extends React.ComponentProps<"div"> {
  variant?: InfoBannerVariant
  title: string
}

const variantStyles: Record<InfoBannerVariant, {
  wrapper: string
  icon: string
  title: string
  description: string
  Icon: React.ElementType
}> = {
  info: {
    wrapper: "bg-info-light border border-blue-200",
    icon: "text-info",
    title: "text-blue-800",
    description: "text-info",
    Icon: Info,
  },
  warning: {
    wrapper: "bg-warning-light border border-yellow-200",
    icon: "text-warning",
    title: "text-amber-800",
    description: "text-amber-700",
    Icon: TriangleAlert,
  },
}

function InfoBanner({
  variant = "info",
  title,
  children,
  className,
  ...props
}: InfoBannerProps) {
  const styles = variantStyles[variant]
  const { Icon } = styles

  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-md px-5 py-3.5 w-full",
        styles.wrapper,
        className
      )}
      {...props}
    >
      <Icon className={cn("size-4 mt-0.5 shrink-0", styles.icon)} />
      <div className="flex flex-col gap-0.5">
        <p className={cn("text-[13px] font-semibold leading-snug", styles.title)}>
          {title}
        </p>
        {children && (
          <p className={cn("text-[13px] leading-snug", styles.description)}>
            {children}
          </p>
        )}
      </div>
    </div>
  )
}

export { InfoBanner }
