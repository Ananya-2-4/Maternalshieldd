"use client";

import { Visit } from "@/lib/mock-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

interface RiskChartProps {
  visits: Visit[];
  currentRiskLevel: "critical" | "high" | "elevated" | "stable";
}

export function RiskChart({ visits, currentRiskLevel }: RiskChartProps) {
  const chartData = visits.map((v) => ({
    visit: `Visit ${v.visitNumber}`,
    risk: v.riskScore,
    systolic: v.systolic,
    date: v.date,
  }));

  const getRiskColor = () => {
    switch (currentRiskLevel) {
      case "critical":
        return "#ef4444";
      case "high":
        return "#f97316";
      case "elevated":
        return "#eab308";
      default:
        return "#22c55e";
    }
  };

  return (
    <div className="clinical-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Risk Trajectory vs. Clinical Bounds
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="visit"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={{ stroke: "#e5e7eb" }}
              label={{
                value: "Risk Score (%)",
                angle: -90,
                position: "insideLeft",
                fill: "#6b7280",
                fontSize: 12,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[80, 160]}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={{ stroke: "#e5e7eb" }}
              label={{
                value: "Systolic BP (mmHg)",
                angle: 90,
                position: "insideRight",
                fill: "#6b7280",
                fontSize: 12,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number, name: string) => {
                if (name === "risk") return [`${value.toFixed(1)}%`, "Bi-LSTM Risk"];
                return [`${value} mmHg`, "Systolic BP"];
              }}
            />
            <Legend />
            <ReferenceLine
              yAxisId="left"
              y={75}
              stroke="#f97316"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: "High Risk (75%)",
                position: "right",
                fill: "#f97316",
                fontSize: 11,
              }}
            />
            <ReferenceLine
              yAxisId="right"
              y={140}
              stroke="#dc2626"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: "Emergency (140 mmHg)",
                position: "right",
                fill: "#dc2626",
                fontSize: 11,
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="risk"
              stroke={getRiskColor()}
              strokeWidth={3}
              dot={{ fill: getRiskColor(), strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8 }}
              name="risk"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="systolic"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              name="systolic"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
