"use client"

import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  User,
  Phone,
  Stethoscope,
  HeartPulse,
  Scale,
  Activity,
  Dna,
  Baby,
} from "lucide-react"
import { getPatientById } from "@/lib/data"
import { getRiskLevel, cn } from "@/lib/utils"
import { MetricCard } from "./metric-card"
import { RiskChart } from "./risk-chart"
import { ClinicalReasoning } from "./clinical-reasoning"
import { WhatsAppAlert } from "./whatsapp-alert"

interface PatientAnalysisProps {
  patientId: string
}

export function PatientAnalysis({ patientId }: PatientAnalysisProps) {
  const router = useRouter()
  const patient = getPatientById(patientId)

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-foreground">Patient not found</h2>
        <p className="text-muted-foreground mt-2">The requested patient ID does not exist.</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Back to Registry
        </button>
      </div>
    )
  }

  const risk = getRiskLevel(patient.riskScore)
  const latestVisit = patient.visits[patient.visits.length - 1]
  const prevVisit = patient.visits[patient.visits.length - 2] || latestVisit

  // Calculate deltas
  const systolicDelta = latestVisit.systolic - prevVisit.systolic
  const mapDelta = latestVisit.map - prevVisit.map
  const mapDeltaPercent = prevVisit.map > 0 ? ((latestVisit.map - prevVisit.map) / prevVisit.map) * 100 : 0
  const weightDelta = latestVisit.weight - prevVisit.weight

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard")}
          className={cn(
            "p-2 rounded-lg bg-card border border-border",
            "hover:bg-secondary transition-colors"
          )}
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Patient Analysis: {patient.name}
          </h1>
          <p className="text-muted-foreground">{patient.id}</p>
        </div>
      </div>

      {/* Patient Profile Summary */}
      <div className="bg-card rounded-xl shadow-card border border-border p-6">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{patient.name}</p>
              <p className="text-sm text-muted-foreground">{patient.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone size={16} className="text-muted-foreground" />
            <span className="text-foreground">{patient.contactNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Stethoscope size={16} className="text-muted-foreground" />
            <span className="text-foreground">{patient.doctorInCharge}</span>
          </div>
        </div>
      </div>

      {/* Clinical Background Badges */}
      <div className="bg-card rounded-xl shadow-card border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Clinical Background</h3>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
            <User size={14} />
            Age: {patient.age} Yrs
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Activity size={14} />
            Trimester {patient.trimester}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
              patient.familyHistoryPreeclampsia
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            )}
          >
            <Dna size={14} />
            {patient.familyHistoryPreeclampsia ? "Family History: Yes" : "No Family History"}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
              patient.firstTimePregnancy
                ? "bg-orange-100 text-orange-700"
                : "bg-sky-100 text-sky-700"
            )}
          >
            <Baby size={14} />
            {patient.firstTimePregnancy ? "First Pregnancy" : "Multipara"}
          </span>
        </div>
      </div>

      {/* Vital Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Bi-LSTM Predictive Risk"
          value={patient.riskScore.toFixed(1)}
          unit="%"
          variant={risk.level === "critical" ? "critical" : risk.level === "high" ? "warning" : "default"}
          icon={<Activity size={18} className={risk.color} />}
        />
        <MetricCard
          label="Systolic BP"
          value={latestVisit.systolic}
          unit="mmHg"
          delta={systolicDelta}
          deltaLabel="mmHg"
          variant={latestVisit.systolic >= 140 ? "critical" : latestVisit.systolic >= 130 ? "warning" : "default"}
          icon={<HeartPulse size={18} className="text-red-500" />}
        />
        <MetricCard
          label="MAP"
          value={latestVisit.map.toFixed(1)}
          delta={mapDeltaPercent}
          deltaLabel="%"
          icon={<Activity size={18} className="text-orange-500" />}
        />
        <MetricCard
          label="Weight"
          value={latestVisit.weight.toFixed(1)}
          unit="kg"
          delta={weightDelta}
          deltaLabel="kg"
          icon={<Scale size={18} className="text-sky-500" />}
        />
      </div>

      {/* Clinical Reasoning */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">Clinical Reasoning</h3>
        <ClinicalReasoning
          riskScore={patient.riskScore}
          systolicDelta={systolicDelta}
          mapDeltaPercent={mapDeltaPercent}
        />
      </div>

      {/* Risk Trajectory Chart */}
      <RiskChart visits={patient.visits} currentRisk={patient.riskScore} />

      {/* WhatsApp Alert Button */}
      <div className="bg-card rounded-xl shadow-card border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Emergency Action Zone</h3>
        <WhatsAppAlert patient={patient} />
        <p className="text-xs text-muted-foreground text-center mt-4">
          Sends a pre-filled clinical alert message via WhatsApp to the designated emergency contact
        </p>
      </div>
    </div>
  )
}
