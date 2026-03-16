"use client"

import { useMemo } from "react"
import type { PatientVisit } from "@/lib/types"

interface RiskChartProps {
  visits: PatientVisit[]
  currentRisk: number
}

export function RiskChart({ visits, currentRisk }: RiskChartProps) {
  const getRiskColor = (risk: number) => {
    if (risk > 75) return "#dc2626"
    if (risk > 60) return "#ea580c"
    if (risk > 35) return "#ca8a04"
    return "#16a34a"
  }

  // Chart dimensions
  const chartConfig = {
    width: 800,
    height: 200,
    padding: { top: 20, right: 60, bottom: 40, left: 70 },
  }

  const riskChartData = useMemo(() => {
    const { width, height, padding } = chartConfig
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    const maxVisits = Math.max(visits.length, 10)
    
    const points = visits.map((v, i) => ({
      x: padding.left + ((i + 1) / maxVisits) * chartWidth,
      y: padding.top + chartHeight - (v.riskScore / 100) * chartHeight,
      visit: v,
    }))

    const pathD = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ")

    return { points, pathD, chartWidth, chartHeight, maxVisits }
  }, [visits])

  const bpChartData = useMemo(() => {
    const { width, height, padding } = chartConfig
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    const maxVisits = Math.max(visits.length, 10)
    const minBP = 90
    const maxBP = 170

    const points = visits.map((v, i) => ({
      x: padding.left + ((i + 1) / maxVisits) * chartWidth,
      y: padding.top + chartHeight - ((v.systolic - minBP) / (maxBP - minBP)) * chartHeight,
      visit: v,
    }))

    const pathD = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ")

    // Emergency line at 140 mmHg
    const emergencyY = padding.top + chartHeight - ((140 - minBP) / (maxBP - minBP)) * chartHeight

    return { points, pathD, chartWidth, chartHeight, maxVisits, emergencyY, minBP, maxBP }
  }, [visits])

  const { padding } = chartConfig

  return (
    <div className="bg-card rounded-xl shadow-card border border-border p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-foreground">
          MaternalShield: Predictive Risk vs. Clinical Thresholds
        </h3>
        <p className="text-sm text-muted-foreground">
          Bi-LSTM Confidence Trajectory (Spike occurs prior to clinical BP boundaries)
        </p>
      </div>

      {/* Risk Score Panel */}
      <div className="space-y-2">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 rounded" style={{ backgroundColor: getRiskColor(currentRisk) }} />
            <span className="text-muted-foreground font-medium">Patient Risk Score</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 rounded bg-amber-500" style={{ background: "repeating-linear-gradient(90deg, #f59e0b, #f59e0b 4px, transparent 4px, transparent 8px)" }} />
            <span className="text-muted-foreground">High-Risk Threshold (75%)</span>
          </div>
        </div>

        <svg 
          viewBox={`0 0 ${chartConfig.width} ${chartConfig.height}`} 
          className="w-full h-48 bg-slate-50 rounded-lg border border-slate-200"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Y-axis labels and grid lines for Risk */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((tick) => {
            const y = padding.top + riskChartData.chartHeight - tick * riskChartData.chartHeight
            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartConfig.width - padding.right}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y}
                  fill="#64748b"
                  fontSize="12"
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {tick.toFixed(1)}
                </text>
              </g>
            )
          })}

          {/* Y-axis title */}
          <text
            x={20}
            y={chartConfig.height / 2}
            fill="#334155"
            fontSize="12"
            fontWeight="500"
            textAnchor="middle"
            transform={`rotate(-90, 20, ${chartConfig.height / 2})`}
          >
            Model Predictive Risk Score (0-1)
          </text>

          {/* High-risk threshold line (75%) */}
          <line
            x1={padding.left}
            y1={padding.top + riskChartData.chartHeight - 0.75 * riskChartData.chartHeight}
            x2={chartConfig.width - padding.right}
            y2={padding.top + riskChartData.chartHeight - 0.75 * riskChartData.chartHeight}
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="8,4"
          />

          {/* Risk line with gradient effect */}
          <defs>
            <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={getRiskColor(visits[0]?.riskScore || 0)} />
              <stop offset="100%" stopColor={getRiskColor(currentRisk)} />
            </linearGradient>
          </defs>
          <path
            d={riskChartData.pathD}
            fill="none"
            stroke={getRiskColor(currentRisk)}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8,4"
          />

          {/* Data points */}
          {riskChartData.points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill={getRiskColor(point.visit.riskScore)}
                stroke="white"
                strokeWidth="2"
              />
              {/* Inner square for high-risk patients */}
              {point.visit.riskScore > 50 && (
                <rect
                  x={point.x - 3}
                  y={point.y - 3}
                  width="6"
                  height="6"
                  fill="white"
                  transform={`rotate(45, ${point.x}, ${point.y})`}
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Systolic BP Panel */}
      <div className="space-y-2">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 rounded bg-green-600" />
            <span className="text-muted-foreground font-medium">Systolic BP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 rounded bg-red-800" />
            <span className="text-muted-foreground">Emergency Clinical Limit (140 mmHg)</span>
          </div>
        </div>

        <svg 
          viewBox={`0 0 ${chartConfig.width} ${chartConfig.height}`} 
          className="w-full h-48 bg-slate-50 rounded-lg border border-slate-200"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Y-axis labels and grid lines for BP */}
          {[100, 110, 120, 130, 140, 150, 160].map((tick) => {
            const y = padding.top + bpChartData.chartHeight - ((tick - bpChartData.minBP) / (bpChartData.maxBP - bpChartData.minBP)) * bpChartData.chartHeight
            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartConfig.width - padding.right}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y}
                  fill="#64748b"
                  fontSize="12"
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {tick}
                </text>
              </g>
            )
          })}

          {/* Y-axis title */}
          <text
            x={20}
            y={chartConfig.height / 2}
            fill="#334155"
            fontSize="12"
            fontWeight="500"
            textAnchor="middle"
            transform={`rotate(-90, 20, ${chartConfig.height / 2})`}
          >
            Systolic BP (mmHg)
          </text>

          {/* Emergency clinical limit line (140 mmHg) */}
          <line
            x1={padding.left}
            y1={bpChartData.emergencyY}
            x2={chartConfig.width - padding.right}
            y2={bpChartData.emergencyY}
            stroke="#7f1d1d"
            strokeWidth="2"
          />

          {/* X-axis labels (Sequential Visits) */}
          {Array.from({ length: bpChartData.maxVisits }, (_, i) => i + 1).map((visit) => {
            const x = padding.left + (visit / bpChartData.maxVisits) * bpChartData.chartWidth
            return (
              <text
                key={visit}
                x={x}
                y={chartConfig.height - 10}
                fill="#64748b"
                fontSize="12"
                textAnchor="middle"
              >
                {visit}
              </text>
            )
          })}

          {/* X-axis title */}
          <text
            x={chartConfig.width / 2}
            y={chartConfig.height - 2}
            fill="#334155"
            fontSize="12"
            fontWeight="500"
            textAnchor="middle"
          >
            Sequential Antenatal Visits (1 to 10)
          </text>

          {/* BP line */}
          <path
            d={bpChartData.pathD}
            fill="none"
            stroke="#16a34a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8,4"
          />

          {/* Data points */}
          {bpChartData.points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill={point.visit.systolic >= 140 ? "#dc2626" : "#16a34a"}
                stroke="white"
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Current Status Summary */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Latest Risk Score</div>
          <div 
            className="text-2xl font-bold"
            style={{ color: getRiskColor(currentRisk) }}
          >
            {(currentRisk / 100).toFixed(2)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Latest Systolic BP</div>
          <div className={`text-2xl font-bold ${visits[visits.length - 1]?.systolic >= 140 ? "text-red-600" : "text-green-600"}`}>
            {visits[visits.length - 1]?.systolic || "—"} <span className="text-sm font-normal">mmHg</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Total Visits</div>
          <div className="text-2xl font-bold text-foreground">
            {visits.length}
          </div>
        </div>
      </div>
    </div>
  )
}
