import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRiskLevel(score: number): {
  level: "critical" | "high" | "moderate" | "low"
  label: string
  color: string
  bgColor: string
  borderColor: string
} {
  if (score > 75) {
    return {
      level: "critical",
      label: "Critical Risk",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
    }
  }
  if (score > 60) {
    return {
      level: "high",
      label: "High Risk",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-500",
    }
  }
  if (score > 35) {
    return {
      level: "moderate",
      label: "Moderate Risk",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-500",
    }
  }
  return {
    level: "low",
    label: "Low Risk",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
  }
}

export function formatPhoneForWhatsApp(phone: string): string {
  return phone.replace(/\D/g, "")
}

export function generateAlertMessage(patient: {
  name: string
  id: string
  riskScore: number
  systolic: number
  diastolic: number
  map: number
}): string {
  const risk = getRiskLevel(patient.riskScore)
  return encodeURIComponent(
    `MATERNALSHIELD CLINICAL ALERT\n\n` +
    `Patient: ${patient.name} (${patient.id})\n` +
    `Risk Level: ${risk.label} (${patient.riskScore.toFixed(1)}%)\n\n` +
    `Current Vitals:\n` +
    `- Systolic BP: ${patient.systolic} mmHg\n` +
    `- Diastolic BP: ${patient.diastolic} mmHg\n` +
    `- MAP: ${patient.map.toFixed(1)}\n\n` +
    `Please attend to your scheduled checkup immediately. Contact your healthcare provider if you experience headaches, vision changes, or swelling.`
  )
}
