"use client"

import { Clock, User, Activity } from "lucide-react"
import { mockPatients } from "@/lib/data"
import { getRiskLevel, cn } from "@/lib/utils"

export default function HistoryPage() {
  // Generate visit history from all patients
  const allVisits = mockPatients.flatMap((patient) =>
    patient.visits.map((visit) => ({
      ...visit,
      patientId: patient.id,
      patientName: patient.name,
    }))
  ).sort((a, b) => b.visitNumber - a.visitNumber)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Visit History</h1>
        <p className="text-muted-foreground mt-1">
          Chronological record of all patient visits and assessments
        </p>
      </div>

      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Patient
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Visit
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  BP (Sys/Dia)
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  MAP
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Weight
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Risk Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allVisits.slice(0, 20).map((visit, index) => {
                const risk = getRiskLevel(visit.riskScore)
                return (
                  <tr
                    key={`${visit.patientId}-${visit.visitNumber}-${index}`}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {visit.patientName}
                          </p>
                          <p className="text-xs text-muted-foreground">{visit.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">V{visit.visitNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground">
                        {visit.systolic}/{visit.diastolic}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground">{visit.map.toFixed(1)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground">{visit.weight.toFixed(1)} kg</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                          risk.bgColor,
                          risk.color
                        )}
                      >
                        <Activity size={12} />
                        {visit.riskScore.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
