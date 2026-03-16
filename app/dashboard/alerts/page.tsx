"use client"

import { useRouter } from "next/navigation"
import { AlertTriangle, TrendingUp, Activity, ArrowRight } from "lucide-react"
import { mockPatients } from "@/lib/data"
import { getRiskLevel, cn } from "@/lib/utils"

export default function AlertsPage() {
  const router = useRouter()
  
  // Filter patients with elevated risk
  const alertPatients = mockPatients
    .filter((p) => p.riskScore > 60)
    .sort((a, b) => b.riskScore - a.riskScore)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Active Alerts</h1>
        <p className="text-muted-foreground mt-1">
          Patients requiring immediate attention based on Bi-LSTM risk analysis
        </p>
      </div>

      {alertPatients.length === 0 ? (
        <div className="bg-card rounded-xl shadow-card border border-border p-12 text-center">
          <Activity size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Active Alerts</h3>
          <p className="text-muted-foreground">
            All patients are currently within acceptable risk parameters
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alertPatients.map((patient) => {
            const risk = getRiskLevel(patient.riskScore)
            const latestVisit = patient.visits[patient.visits.length - 1]
            const isCritical = patient.riskScore > 75

            return (
              <div
                key={patient.id}
                onClick={() => router.push(`/dashboard/patient/${patient.id}`)}
                className={cn(
                  "bg-card rounded-xl shadow-card border cursor-pointer",
                  "hover:shadow-card-hover transition-all duration-200",
                  isCritical ? "border-red-300" : "border-orange-300"
                )}
              >
                {/* Alert Header */}
                <div
                  className={cn(
                    "px-6 py-4 rounded-t-xl flex items-center justify-between",
                    isCritical ? "bg-red-50" : "bg-orange-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {isCritical ? (
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                        <AlertTriangle size={20} className="text-red-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <TrendingUp size={20} className="text-orange-600" />
                      </div>
                    )}
                    <div>
                      <h3 className={cn("font-semibold", isCritical ? "text-red-700" : "text-orange-700")}>
                        {isCritical ? "CRITICAL: High Risk Detected" : "WARNING: Emerging Trend"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Bi-LSTM Risk Score: {patient.riskScore.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-muted-foreground" />
                </div>

                {/* Alert Body */}
                <div className="px-6 py-4">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Patient</p>
                      <p className="font-medium text-foreground">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">{patient.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current BP</p>
                      <p className="font-medium text-foreground">
                        {latestVisit.systolic}/{latestVisit.diastolic} mmHg
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">MAP</p>
                      <p className="font-medium text-foreground">{latestVisit.map.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">BP Velocity</p>
                      <p className="font-medium text-foreground">
                        +{latestVisit.bpVelocity.toFixed(1)} mmHg/visit
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium",
                          risk.bgColor,
                          risk.color
                        )}
                      >
                        {risk.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
