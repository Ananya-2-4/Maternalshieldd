"use client"

import { useEffect, useState } from "react"
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
  animate?: boolean
  delay?: number
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
  animate = true,
  delay = 0,
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value)
  const [isVisible, setIsVisible] = useState(!animate)
  
  useEffect(() => {
    if (!animate) return
    
    // Delay the animation start
    const timeout = setTimeout(() => {
      setIsVisible(true)
      
      // Animate number if it's a number
      if (typeof value === "number") {
        const duration = 1000
        const steps = 30
        const increment = value / steps
        let current = 0
        
        const interval = setInterval(() => {
          current += increment
          if (current >= value) {
            setDisplayValue(value)
            clearInterval(interval)
          } else {
            setDisplayValue(Math.round(current * 10) / 10)
          }
        }, duration / steps)
        
        return () => clearInterval(interval)
      } else {
        setDisplayValue(value)
      }
    }, delay)
    
    return () => clearTimeout(timeout)
  }, [value, animate, delay])

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
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "bg-card rounded-xl shadow-card p-5 border",
        "hover:shadow-card-hover transition-all duration-300",
        "hover-lift group",
        variantStyles[variant],
        animate && "animate-fade-in-up opacity-0"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 transform">
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn(
          "text-3xl font-semibold text-foreground",
          animate && isVisible && "animate-count-up"
        )}>
          {typeof displayValue === "number" ? displayValue.toFixed(1) : displayValue}
        </span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {delta !== undefined && (
        <div className={cn(
          "flex items-center gap-1 mt-2 text-sm",
          getDeltaColor(),
          "animate-fade-in-up"
        )} style={{ animationDelay: `${delay + 300}ms` }}>
          <span className="transition-transform duration-300 group-hover:scale-110">
            {getDeltaIcon()}
          </span>
          <span>
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)}
            {deltaLabel && ` ${deltaLabel}`}
          </span>
        </div>
      )}
      
      {/* Hover gradient effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  )
}
