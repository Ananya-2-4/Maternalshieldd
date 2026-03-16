"use client";

import Link from "next/link";
import { Patient } from "@/lib/mock-data";
import { getRiskLevel, cn } from "@/lib/utils";
import { User, Phone, ChevronRight, AlertTriangle, Heart } from "lucide-react";

interface PatientTileProps {
  patient: Patient;
}

export function PatientTile({ patient }: PatientTileProps) {
  const riskInfo = getRiskLevel(patient.riskScore);

  return (
    <Link href={`/dashboard/patient/${patient.id}`}>
      <div
        className={cn(
          "clinical-card p-4 hover:shadow-lg transition-all cursor-pointer group border-l-4",
          riskInfo.borderColor
        )}
      >
        <div className="flex items-start justify-between">
          {/* Patient Info */}
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                riskInfo.bgColor
              )}
            >
              <User className={cn("w-6 h-6", riskInfo.color)} />
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{patient.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                  {patient.id}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{patient.age} yrs</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span>
                  <Phone className="w-3 h-3 inline mr-1" />
                  {patient.contactNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Risk Score */}
          <div className="flex items-center gap-4">
            {/* Badges */}
            <div className="flex flex-col items-end gap-1">
              {/* Trimester Badge */}
              <span className="text-xs px-2 py-1 rounded-full bg-[#0056b3]/10 text-[#0056b3] font-medium">
                T{patient.trimester}
              </span>

              {/* Family History Badge */}
              {patient.familyHistory && (
                <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 font-medium flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  Family Hx
                </span>
              )}

              {/* First Pregnancy Badge */}
              {patient.firstPregnancy && (
                <span className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-600 font-medium">
                  First Pregnancy
                </span>
              )}
            </div>

            {/* Risk Indicator */}
            <div
              className={cn(
                "flex flex-col items-center px-4 py-2 rounded-lg",
                riskInfo.bgColor
              )}
            >
              {riskInfo.level === "critical" && (
                <AlertTriangle className={cn("w-5 h-5 mb-1", riskInfo.color)} />
              )}
              <span className={cn("text-2xl font-bold", riskInfo.color)}>
                {patient.riskScore.toFixed(1)}%
              </span>
              <span className={cn("text-xs font-medium", riskInfo.color)}>
                {riskInfo.label}
              </span>
            </div>

            {/* Arrow */}
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </div>

        {/* Latest Vitals Strip */}
        {patient.visits.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Latest BP: </span>
                <span className="font-semibold text-foreground">
                  {patient.visits[patient.visits.length - 1].systolic}/
                  {patient.visits[patient.visits.length - 1].diastolic} mmHg
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">MAP: </span>
                <span className="font-semibold text-foreground">
                  {patient.visits[patient.visits.length - 1].map.toFixed(1)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Visits: </span>
                <span className="font-semibold text-foreground">
                  {patient.visits.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
