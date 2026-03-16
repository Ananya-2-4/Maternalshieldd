"use client"

import { MessageCircle, AlertTriangle } from "lucide-react"
import { cn, formatPhoneForWhatsApp, generateAlertMessage } from "@/lib/utils"
import type { Patient } from "@/lib/types"

interface WhatsAppAlertProps {
  patient: Patient
}

export function WhatsAppAlert({ patient }: WhatsAppAlertProps) {
  const latestVisit = patient.visits[patient.visits.length - 1]
  
  const handleAlert = () => {
    const phone = formatPhoneForWhatsApp("918309359973")
    const message = generateAlertMessage({
      name: patient.name,
      id: patient.id,
      riskScore: patient.riskScore,
      systolic: latestVisit.systolic,
      diastolic: latestVisit.diastolic,
      map: latestVisit.map,
    })
    
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank")
  }

  const isHighRisk = patient.riskScore > 60

  return (
    <button
      onClick={handleAlert}
      className={cn(
        "w-full py-4 px-6 rounded-xl font-semibold text-white",
        "flex items-center justify-center gap-3",
        "transition-all duration-200 transform",
        "hover:scale-[1.02] active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        isHighRisk
          ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-500 animate-pulse-ring"
          : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-green-500"
      )}
    >
      {isHighRisk ? (
        <AlertTriangle size={24} className="animate-pulse" />
      ) : (
        <MessageCircle size={24} />
      )}
      <span className="text-lg">
        {isHighRisk ? "SEND WHATSAPP ALERT" : "Send WhatsApp Message"}
      </span>
    </button>
  )
}
