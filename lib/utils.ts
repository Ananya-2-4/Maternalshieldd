import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRiskLevel(riskScore: number): {
  level: "critical" | "high" | "elevated" | "stable";
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  if (riskScore > 75) {
    return {
      level: "critical",
      label: "Critical Risk",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
    };
  }
  if (riskScore > 60) {
    return {
      level: "high",
      label: "High Risk",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-500",
    };
  }
  if (riskScore > 35) {
    return {
      level: "elevated",
      label: "Elevated Risk",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-500",
    };
  }
  return {
    level: "stable",
    label: "Stable",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
  };
}

export function formatPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

export function generateWhatsAppUrl(phone: string, patientName: string, riskScore: number): string {
  const cleanPhone = formatPhoneNumber(phone);
  const message = encodeURIComponent(
    `URGENT CLINICAL ALERT - MaternalShield\n\nPatient: ${patientName}\nBi-LSTM Predictive Risk: ${riskScore.toFixed(1)}%\n\nImmediate assessment recommended. Please contact your healthcare provider or visit the nearest facility.`
  );
  return `https://wa.me/${cleanPhone}?text=${message}`;
}
