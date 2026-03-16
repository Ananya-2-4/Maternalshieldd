"use client"

import { useMemo } from "react"
import type { PatientVisit } from "@/lib/types"

interface RiskChartProps {
  visits: PatientVisit[]
  currentRisk: number
}

export function RiskChart({ visits, currentRisk }: RiskChartProps) {
  const chartData = useMemo(() => {
    const maxRisk = 100
    const maxSystolic = 160
    const padding = 40
    const width = 100
    const height = 50

    return {
      riskPath: visits
        .map((v, i) => {
          const x = padding + (i / (visits.length - 1 || 1)) * (width - 2 * padding)
          const y = height - padding - (v.riskScore / maxRisk) * (height - 2 * padding)
          return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
        })
        .join(" "),
      systolicPath: visits
        .map((v, i) => {
          const x = padding + (i / (visits.length - 1 || 1)) * (width - 2 * padding)
          const normalizedSystolic = Math.min(v.systolic, maxSystolic)
          const y = height - padding - ((normalizedSystolic - 90) / (maxSystolic - 90)) * (height - 2 * padding)
          return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
        })
        .join(" "),
      points: visits.map((v, i) => ({
        x: padding + (i / (visits.length - 1 || 1)) * (width - 2 * padding),
        riskY: height - padding - (v.riskScore / maxRisk) * (height - 2 * padding),
        systolicY: height - padding - ((Math.min(v.systolic, maxSystolic) - 90) / (maxSystolic - 90)) * (height - 2 * padding),
        visit: v,
      })),
      thresholdY: height - padding - (75 / maxRisk) * (height - 2 * padding),
      emergencyY: height - padding - ((140 - 90) / (maxSystolic - 90)) * (height - 2 * padding),
      padding,
      width,
      height,
    }
  }, [visits])

  const getRiskColor = (risk: number) => {
    if (risk > 75) return "#ef4444"
    if (risk > 60) return "#f97316"
    if (risk > 35) return "#eab308"
    return "#22c55e"
  }

  return (
    <div className="bg-card rounded-xl shadow-card border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Risk Trajectory vs. Clinical Bounds</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-0.5 rounded"
              style={{ backgroundColor: getRiskColor(currentRisk) }}
            />
            <span className="text-muted-foreground">Bi-LSTM Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded bg-sky-500" />
            <span className="text-muted-foreground">Systolic BP</span>
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${chartData.width} ${chartData.height}`} className="w-full h-64">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const y =
            chartData.height -
            chartData.padding -
            (tick / 100) * (chartData.height - 2 * chartData.padding)
          return (
            <g key={tick}>
              <line
                x1={chartData.padding}
                y1={y}
                x2={chartData.width - chartData.padding}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.1}
                strokeDasharray="2,2"
              />
              <text
                x={chartData.padding - 4}
                y={y}
                fill="currentColor"
                fontSize="2.5"
                textAnchor="end"
                dominantBaseline="middle"
                className="text-muted-foreground"
              >
                {tick}%
              </text>
            </g>
          )
        })}

        {/* Clinical threshold line (75%) */}
        <line
          x1={chartData.padding}
          y1={chartData.thresholdY}
          x2={chartData.width - chartData.padding}
          y2={chartData.thresholdY}
          stroke="#f97316"
          strokeWidth="0.3"
          strokeDasharray="1,1"
        />
        <text
          x={chartData.width - chartData.padding + 1}
          y={chartData.thresholdY}
          fill="#f97316"
          fontSize="2"
          dominantBaseline="middle"
        >
          75%
        </text>

        {/* Emergency boundary (140 mmHg) */}
        <line
          x1={chartData.padding}
          y1={chartData.emergencyY}
          x2={chartData.width - chartData.padding}
          y2={chartData.emergencyY}
          stroke="#991b1b"
          strokeWidth="0.3"
          strokeOpacity={0.6}
        />
        <text
          x={chartData.width - chartData.padding + 1}
          y={chartData.emergencyY}
          fill="#991b1b"
          fontSize="2"
          dominantBaseline="middle"
        >
          140
        </text>

        {/* Systolic BP line */}
        <path
          d={chartData.systolicPath}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="0.5"
          strokeDasharray="1,0.5"
          strokeOpacity={0.8}
        />

        {/* Risk line */}
        <path
          d={chartData.riskPath}
          fill="none"
          stroke={getRiskColor(currentRisk)}
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {chartData.points.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.riskY}
              r="1"
              fill={getRiskColor(point.visit.riskScore)}
            />
            <circle cx={point.x} cy={point.systolicY} r="0.8" fill="#0ea5e9" />
            {/* Visit number labels */}
            <text
              x={point.x}
              y={chartData.height - chartData.padding + 4}
              fill="currentColor"
              fontSize="2"
              textAnchor="middle"
              className="text-muted-foreground"
            >
              V{point.visit.visitNumber}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-4 h-0.5 bg-orange-500 rounded" style={{ background: "repeating-linear-gradient(90deg, #f97316, #f97316 3px, transparent 3px, transparent 6px)" }} />
          <span>Clinical Risk Threshold (75%)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-4 h-0.5 bg-red-800 rounded" />
          <span>Emergency Boundary (140 mmHg)</span>
        </div>
      </div>
    </div>
  )
}
