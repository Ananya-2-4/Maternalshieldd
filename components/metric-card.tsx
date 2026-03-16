import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  delta?: number
  deltaLabel?: string
  icon?: React.ReactNode
  variant?: "default" | "critical" | "warning" | "success"
}

const variantStyles = {
  default: "border-border",
  critical: "border-l-4 border-l-red-500",
  warning: "border-l-4 border-l-orange-500",
  success: "border-l-4 border-l-green-500",
}

export function MetricCard({
  label,
  value,
  unit,
  delta,
  deltaLabel,
  icon,
  variant = "default",
}: MetricCardProps) {
  const getDeltaIcon = () => {
    if (delta === undefined || delta === 0) return <Minus size={14} />
    return delta > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />
  }

  const getDeltaColor = () => {
    if (delta === undefined || delta === 0) return "text-muted-foreground"
    // For medical metrics, increasing values are often concerning
    return delta > 0 ? "text-orange-500" : "text-green-500"
  }

  return (
    <div
      className={cn(
        "bg-card rounded-xl shadow-card p-5 border",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-semibold text-foreground">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {delta !== undefined && (
        <div className={cn("flex items-center gap-1 mt-2 text-sm", getDeltaColor())}>
          {getDeltaIcon()}
          <span>
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)}
            {deltaLabel && ` ${deltaLabel}`}
          </span>
        </div>
      )}
    </div>
  )
}
