import { Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

const sizeMap = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 40, text: "text-2xl" },
  lg: { icon: 56, text: "text-3xl" },
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const { icon, text } = sizeMap[size]

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative">
        <Shield
          size={icon}
          className="text-primary fill-primary/10"
          strokeWidth={1.5}
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ marginTop: icon * 0.05 }}
        >
          <svg
            width={icon * 0.4}
            height={icon * 0.4}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4C10.5 6 8 8 8 11C8 14 10 16 12 18C14 16 16 14 16 11C16 8 13.5 6 12 4Z"
              fill="currentColor"
              className="text-primary"
            />
          </svg>
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-semibold text-foreground leading-tight", text)}>
            MaternalShield
          </span>
          <span className="text-xs text-muted-foreground tracking-wide uppercase">
            Clinical Dashboard
          </span>
        </div>
      )}
    </div>
  )
}
