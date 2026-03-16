"use client"

import { useRouter } from "next/navigation"
import { User, Phone, ChevronRight, HeartPulse, Dna } from "lucide-react"
import { cn, getRiskLevel } from "@/lib/utils"
import type { Patient } from "@/lib/types"

interface PatientTileProps {
  patient: Patient
}

export function PatientTile({ patient }: PatientTileProps) {
  const router = useRouter()
  const risk = getRiskLevel(patient.riskScore)
  const latestVisit = patient.visits[patient.visits.length - 1]

  return (
    <div
      onClick={() => router.push(`/dashboard/patient/${patient.id}`)}
      className={cn(
        "bg-card rounded-xl shadow-card border border-border",
        "hover:shadow-card-hover hover:border-primary/20",
        "transition-all duration-200 cursor-pointer",
        "overflow-hidden"
      )}
    >
      {/* Risk Indicator Bar */}
      <div className={cn("h-1", risk.bgColor.replace("bg-", "bg-").replace("-50", "-500"))} />

      <div className="p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{patient.name}</h3>
              <p className="text-sm text-muted-foreground">{patient.id}</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-muted-foreground" />
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Trimester Badge */}
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            T{patient.trimester}
          </span>
          {/* Age Badge */}
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
            {patient.age} yrs
          </span>
          {/* Preeclampsia Indicator */}
          {patient.preeclampsia && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
              PE+
            </span>
          )}
          {/* Risk Badge */}
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium",
              risk.bgColor,
              risk.color
            )}
          >
            {patient.riskScore.toFixed(1)}% Risk
          </span>
        </div>

        {/* Clinical Indicators */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <HeartPulse size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">BP:</span>
            <span className="font-medium text-foreground">
              {latestVisit.systolic}/{latestVisit.diastolic}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">MAP:</span>
            <span className="font-medium text-foreground">
              {latestVisit.map.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Dna size={14} className={patient.familyHistoryPreeclampsia ? "text-red-500" : "text-green-500"} />
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
