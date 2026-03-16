"use client"

import { useRouter } from "next/navigation"
import { User, Phone, ChevronRight, HeartPulse, Dna, Activity } from "lucide-react"
import { cn, getRiskLevel } from "@/lib/utils"
import type { Patient } from "@/lib/types"

interface PatientTileProps {
  patient: Patient
  index?: number
}

export function PatientTile({ patient, index = 0 }: PatientTileProps) {
  const router = useRouter()
  const risk = getRiskLevel(patient.riskScore)
  const latestVisit = patient.visits[patient.visits.length - 1]

  return (
    <div
      onClick={() => router.push(`/dashboard/patient/${patient.id}`)}
      style={{ animationDelay: `${index * 0.05}s` }}
      className={cn(
        "bg-card rounded-xl shadow-card border border-border",
        "hover:shadow-card-hover hover:border-primary/30",
        "transition-all duration-300 cursor-pointer",
        "overflow-hidden group",
        "hover-lift animate-fade-in-up opacity-0"
      )}
    >
      {/* Risk Indicator Bar with gradient animation */}
      <div className={cn(
        "h-1.5 relative overflow-hidden",
        risk.bgColor.replace("bg-", "bg-").replace("-50", "-500")
      )}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      <div className="p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center relative overflow-hidden group-hover:bg-primary/20 transition-colors duration-300">
              <User size={24} className="text-primary relative z-10" />
              {/* Pulse ring on hover */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/0 group-hover:border-primary/30 group-hover:scale-150 transition-all duration-500 opacity-0 group-hover:opacity-100" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{patient.name}</h3>
              <p className="text-sm text-muted-foreground">{patient.id}</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Trimester Badge */}
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary transition-all duration-300 hover:bg-primary/20">
            T{patient.trimester}
          </span>
          {/* Age Badge */}
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground transition-all duration-300 hover:bg-secondary/80">
            {patient.age} yrs
          </span>
          {/* Preeclampsia Indicator */}
          {patient.preeclampsia && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 animate-pulse-ring">
              PE+
            </span>
          )}
          {/* Risk Badge */}
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300",
              risk.bgColor,
              risk.color
            )}
          >
            {patient.riskScore.toFixed(1)}% Risk
          </span>
        </div>

        {/* Clinical Indicators */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-secondary/50 group-hover:bg-secondary transition-colors duration-300">
            <HeartPulse size={16} className="text-red-500 animate-heartbeat-subtle" />
            <span className="text-muted-foreground">BP:</span>
            <span className="font-medium text-foreground">
              {latestVisit.systolic}/{latestVisit.diastolic}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-secondary/50 group-hover:bg-secondary transition-colors duration-300">
            <Activity size={16} className="text-primary" />
            <span className="text-muted-foreground">MAP:</span>
            <span className="font-medium text-foreground">
              {latestVisit.map.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Dna size={14} className={cn(
              "transition-colors duration-300",
              patient.familyHistoryPreeclampsia ? "text-red-500" : "text-green-500"
            )} />
            <span className="text-xs text-muted-foreground">
              {patient.familyHistoryPreeclampsia ? "Family History" : "No Family Hx"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground truncate">
              {patient.contactNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
