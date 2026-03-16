import { AlertTriangle, TrendingUp, Activity, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ClinicalReasoningProps {
  riskScore: number
  systolicDelta: number
  mapDeltaPercent: number
}

export function ClinicalReasoning({
  riskScore,
  systolicDelta,
  mapDeltaPercent,
}: ClinicalReasoningProps) {
  const getReasoningContent = () => {
    if (riskScore > 75) {
      return {
        icon: AlertTriangle,
        title: "High Predictive Risk Triggered",
        borderColor: "border-l-red-500",
        bgColor: "bg-red-50",
        iconColor: "text-red-500",
        titleColor: "text-red-600",
        reasoning: `Despite current vitals remaining below the 140 mmHg emergency line, the Bi-LSTM flags this sequence due to dangerous velocity. There is a ${systolicDelta} mmHg increase in Systolic BP in the last interval and a ${mapDeltaPercent.toFixed(1)}% acceleration in MAP. The Bidirectional layer matched this rapid temporal progression to impending preeclampsia.`,
        action: "Run SOS Protocol via Emergency Alert Button.",
      }
    }
    if (riskScore > 60) {
      return {
        icon: TrendingUp,
        title: "Emerging Trend Detected",
        borderColor: "border-l-orange-500",
        bgColor: "bg-orange-50",
        iconColor: "text-orange-500",
        titleColor: "text-orange-600",
        reasoning: `Symptom velocity is accelerating steadily (MAP change: ${mapDeltaPercent.toFixed(1)}%). The model detects a pattern that often precedes clinical threshold breaches if unmanaged.`,
        action: "Adjust care plan and schedule early follow-up.",
      }
    }
    if (riskScore > 35) {
      return {
        icon: Activity,
        title: "Elevated Trajectory Noticed",
        borderColor: "border-l-yellow-500",
        bgColor: "bg-yellow-50",
        iconColor: "text-yellow-600",
        titleColor: "text-yellow-700",
        reasoning: `MAP and Systolic BP have shown creeping velocity. Although not an immediate crisis, it indicates an upward trend that deviates from standard pregnancy baselines.`,
        action: "Monitor closely at the next checkup.",
      }
    }
    return {
      icon: CheckCircle,
      title: "Stable Baseline Confirmed",
      borderColor: "border-l-green-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
      titleColor: "text-green-600",
      reasoning: `Symptom velocity remains within normal physiological bounds. The Bi-LSTM confirms the sequential visit progression is stable.`,
      action: "Routine care.",
    }
  }

  const content = getReasoningContent()
  const Icon = content.icon

  return (
    <div
      className={cn(
        "rounded-xl border-l-4 p-6",
        content.borderColor,
        content.bgColor
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-2 rounded-lg bg-white shadow-sm", content.iconColor)}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className={cn("text-lg font-semibold mb-2", content.titleColor)}>
            {content.title}
          </h3>
          <div className="space-y-3 text-sm text-foreground/80">
            <p>
              <span className="font-medium">Reasoning:</span> {content.reasoning}
            </p>
            <p>
              <span className="font-medium">Action:</span> {content.action}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
