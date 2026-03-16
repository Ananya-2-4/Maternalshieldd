"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { getPatientById } from "@/lib/mock-data";
import { getRiskLevel } from "@/lib/utils";
import { MetricCard } from "@/components/metric-card";
import { RiskChart } from "@/components/risk-chart";
import { ClinicalReasoning } from "@/components/clinical-reasoning";
import { WhatsAppAlert } from "@/components/whatsapp-alert";
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  Heart,
  Activity,
  Weight,
  Gauge,
} from "lucide-react";

export default function PatientAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const patient = getPatientById(id);

  if (!patient) {
    return (
      <div className="p-8">
        <div className="clinical-card p-12 text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">Patient not found</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 text-[#0056b3] hover:underline"
          >
            Return to Registry
          </button>
        </div>
      </div>
    );
  }

  const riskInfo = getRiskLevel(patient.riskScore);
  const lastVisit = patient.visits[patient.visits.length - 1];
  const prevVisit = patient.visits.length > 1 ? patient.visits[patient.visits.length - 2] : lastVisit;

  // Calculate deltas
  const systolicDelta = lastVisit.systolic - prevVisit.systolic;
  const mapDeltaPct =
    prevVisit.map > 0 ? ((lastVisit.map - prevVisit.map) / prevVisit.map) * 100 : 0;
  const weightDelta = lastVisit.weight - prevVisit.weight;

  return (
    <div className="p-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Registry
        </button>
      </div>

      {/* Patient Header */}
      <div className="clinical-card p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#0056b3]/10 flex items-center justify-center">
              <User className="w-8 h-8 text-[#0056b3]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{patient.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="font-medium">{patient.id}</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span>{patient.age} years old</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {patient.contactNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Risk Badge */}
          <div className={`px-6 py-3 rounded-xl ${riskInfo.bgColor} ${riskInfo.borderColor} border-2`}>
            <p className="text-sm text-muted-foreground">Bi-LSTM Risk Score</p>
            <p className={`text-3xl font-bold ${riskInfo.color}`}>
              {patient.riskScore.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Clinical Background Tags */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
          <span className="px-4 py-2 rounded-full bg-secondary text-foreground text-sm font-medium">
            <Calendar className="w-4 h-4 inline mr-2" />
            Trimester {patient.trimester}
          </span>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              patient.familyHistory
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            <Heart className="w-4 h-4 inline mr-2" />
            {patient.familyHistory ? "Family History of Preeclampsia" : "No Family History"}
          </span>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              patient.firstPregnancy
                ? "bg-orange-50 text-orange-700 border border-orange-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            {patient.firstPregnancy ? "First-Time Pregnancy" : "Multipara"}
          </span>
        </div>
      </div>

      {/* WhatsApp Alert - Only show for high risk */}
      {patient.riskScore > 60 && (
        <div className="mb-6">
          <WhatsAppAlert
            patientName={patient.name}
            contactNumber={patient.contactNumber}
            riskScore={patient.riskScore}
          />
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Bi-LSTM Risk"
          value={patient.riskScore.toFixed(1)}
          unit="%"
          variant={
            riskInfo.level === "critical"
              ? "critical"
              : riskInfo.level === "high"
              ? "warning"
              : "default"
          }
          icon={<Gauge className="w-5 h-5 text-[#0056b3]" />}
        />
        <MetricCard
          label="Systolic BP"
          value={lastVisit.systolic}
          unit="mmHg"
          delta={systolicDelta}
          deltaLabel="mmHg"
          variant={lastVisit.systolic >= 140 ? "critical" : "default"}
          icon={<Activity className="w-5 h-5 text-[#0056b3]" />}
        />
        <MetricCard
          label="MAP"
          value={lastVisit.map.toFixed(1)}
          delta={parseFloat(mapDeltaPct.toFixed(1))}
          deltaLabel="%"
          icon={<Activity className="w-5 h-5 text-[#0056b3]" />}
        />
        <MetricCard
          label="Weight"
          value={lastVisit.weight.toFixed(1)}
          unit="kg"
          delta={parseFloat(weightDelta.toFixed(1))}
          deltaLabel="kg"
          icon={<Weight className="w-5 h-5 text-[#0056b3]" />}
        />
      </div>

      {/* Clinical Reasoning */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Clinical Reasoning
        </h2>
        <ClinicalReasoning
          riskScore={patient.riskScore}
          systolicDelta={systolicDelta}
          mapDelta={mapDeltaPct}
        />
      </div>

      {/* Risk Chart */}
      <RiskChart visits={patient.visits} currentRiskLevel={riskInfo.level} />

      {/* Visit History Table */}
      <div className="clinical-card p-6 mt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Visit History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Visit
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Systolic
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Diastolic
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                  MAP
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                  BP Velocity
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Weight
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Risk Score
                </th>
              </tr>
            </thead>
            <tbody>
              {patient.visits.map((visit) => (
                <tr key={visit.visitNumber} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium text-foreground">
                    Visit {visit.visitNumber}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{visit.date}</td>
                  <td className="py-3 px-4 text-foreground">{visit.systolic} mmHg</td>
                  <td className="py-3 px-4 text-foreground">{visit.diastolic} mmHg</td>
                  <td className="py-3 px-4 text-foreground">{visit.map.toFixed(1)}</td>
                  <td className="py-3 px-4 text-foreground">{visit.bpVelocity.toFixed(1)}</td>
                  <td className="py-3 px-4 text-foreground">{visit.weight} kg</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        getRiskLevel(visit.riskScore).bgColor
                      } ${getRiskLevel(visit.riskScore).color}`}
                    >
                      {visit.riskScore.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
