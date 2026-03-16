import { cn } from "@/lib/utils";
import { AlertTriangle, TrendingUp, Eye, CheckCircle } from "lucide-react";

interface ClinicalReasoningProps {
  riskScore: number;
  systolicDelta: number;
  mapDelta: number;
}

export function ClinicalReasoning({
  riskScore,
  systolicDelta,
  mapDelta,
}: ClinicalReasoningProps) {
  const getReasoning = () => {
    if (riskScore > 75) {
      return {
        icon: AlertTriangle,
        title: "High Predictive Risk Triggered",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-500",
        description: `Despite current vitals remaining below the 140 mmHg emergency line, the Bi-LSTM flags this sequence due to dangerous velocity. There is a ${systolicDelta} mmHg increase in Systolic BP in the last interval and a ${mapDelta.toFixed(1)}% acceleration in MAP. The Bidirectional layer matched this rapid temporal progression to impending preeclampsia.`,
        action: "Run SOS Protocol immediately.",
      };
    }
    if (riskScore > 60) {
      return {
        icon: TrendingUp,
        title: "Emerging Trend Detected",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-500",
        description: `Symptom velocity is accelerating steadily (MAP change: ${mapDelta.toFixed(1)}%). The model detects a pattern that often precedes clinical threshold breaches if unmanaged.`,
        action: "Adjust care plan and schedule early follow-up.",
      };
    }
    if (riskScore > 35) {
      return {
        icon: Eye,
        title: "Elevated Trajectory Noticed",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-500",
        description:
          "MAP and Systolic BP have shown creeping velocity. Although not an immediate crisis, it indicates an upward trend that deviates from standard pregnancy baselines.",
        action: "Monitor closely at the next checkup.",
      };
    }
    return {
      icon: CheckCircle,
      title: "Stable Baseline Confirmed",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      description:
        "Symptom velocity remains within normal physiological bounds. The Bi-LSTM confirms the sequential visit progression is stable.",
      action: "Continue routine care.",
    };
  };

  const reasoning = getReasoning();
  const Icon = reasoning.icon;

  return (
    <div
      className={cn(
        "clinical-card p-6 border-l-4",
        reasoning.bgColor,
        reasoning.borderColor
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            reasoning.bgColor
          )}
        >
          <Icon className={cn("w-5 h-5", reasoning.color)} />
        </div>
        <div className="flex-1">
          <h3 className={cn("text-lg font-semibold", reasoning.color)}>
            {reasoning.title}
          </h3>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            <strong>Reasoning:</strong> {reasoning.description}
          </p>
          <p className="mt-3 font-medium text-foreground">
            <strong>Recommended Action:</strong> {reasoning.action}
          </p>
        </div>
      </div>
    </div>
  );
}
