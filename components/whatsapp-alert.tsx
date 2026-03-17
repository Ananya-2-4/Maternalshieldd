"use client"

import { MessageCircle, AlertTriangle, Users } from "lucide-react"
import { cn, formatPhoneForWhatsApp, generateAlertMessage } from "@/lib/utils"
import type { Patient } from "@/lib/types"

interface WhatsAppAlertProps {
  patient: Patient
}

const ALERT_CONTACTS = [
  { name: "Primary Contact", phone: "918309359973" },
  { name: "Secondary Contact", phone: "919035567631" },
]

export function WhatsAppAlert({ patient }: WhatsAppAlertProps) {
  const latestVisit = patient.visits[patient.visits.length - 1]
  
  const message = generateAlertMessage({
    name: patient.name,
    id: patient.id,
    riskScore: patient.riskScore,
    systolic: latestVisit.systolic,
    diastolic: latestVisit.diastolic,
    map: latestVisit.map,
  })

  const handleAlertSingle = (phone: string) => {
    const formattedPhone = formatPhoneForWhatsApp(phone)
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank")
  }

  const handleAlertAll = () => {
    // Open WhatsApp for each contact
    ALERT_CONTACTS.forEach((contact, index) => {
      setTimeout(() => {
        handleAlertSingle(contact.phone)
      }, index * 500) // Stagger the opening to avoid browser blocking
    })
  }

  const isHighRisk = patient.riskScore > 60

  return (
    <div className="space-y-3">
      {/* Alert All Button */}
      <button
        onClick={handleAlertAll}
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
          <Users size={24} />
        )}
        <span className="text-lg">
          {isHighRisk ? "ALERT ALL CONTACTS" : "Message All Contacts"}
        </span>
      </button>

      {/* Individual Contact Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {ALERT_CONTACTS.map((contact) => (
          <button
            key={contact.phone}
            onClick={() => handleAlertSingle(contact.phone)}
            className={cn(
              "py-3 px-4 rounded-lg font-medium text-sm",
              "flex items-center justify-center gap-2",
              "transition-all duration-200 transform",
              "hover:scale-[1.02] active:scale-[0.98]",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              "bg-white border-2",
              isHighRisk
                ? "border-red-200 text-red-700 hover:bg-red-50 focus:ring-red-300"
                : "border-green-200 text-green-700 hover:bg-green-50 focus:ring-green-300"
            )}
          >
            <MessageCircle size={18} />
            <span>{contact.name}</span>
          </button>
        ))}
      </div>

      {/* Contact Info */}
      <p className="text-xs text-muted-foreground text-center">
        Primary: +91 83093 59973 | Secondary: +91 90355 67631
      </p>
    </div>
  )
}
