import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  variant?: "default" | "critical" | "warning" | "success";
  icon?: React.ReactNode;
}

export function MetricCard({
  label,
  value,
  unit,
  delta,
  deltaLabel,
  variant = "default",
  icon,
}: MetricCardProps) {
  const variantClasses = {
    default: "border-border",
    critical: "border-l-4 border-l-red-500",
    warning: "border-l-4 border-l-orange-500",
    success: "border-l-4 border-l-green-500",
  };

  const getDeltaColor = (d: number) => {
    // For medical metrics, increases are often bad (like BP)
    if (d > 0) return "text-red-600";
    if (d < 0) return "text-green-600";
    return "text-muted-foreground";
  };

  const getDeltaIcon = (d: number) => {
    if (d > 0) return <TrendingUp className="w-4 h-4" />;
    if (d < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <div className={cn("clinical-card p-5", variantClasses[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
          </div>
          {delta !== undefined && (
            <div className={cn("flex items-center gap-1 mt-2 text-sm", getDeltaColor(delta))}>
              {getDeltaIcon(delta)}
              <span className="font-medium">
                {delta > 0 ? "+" : ""}
                {delta}
                {deltaLabel && ` ${deltaLabel}`}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
