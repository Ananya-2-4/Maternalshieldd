"use client";

import { generateWhatsAppUrl } from "@/lib/utils";
import { MessageCircle, ExternalLink } from "lucide-react";

interface WhatsAppAlertProps {
  patientName: string;
  contactNumber: string;
  riskScore: number;
}

export function WhatsAppAlert({
  patientName,
  contactNumber,
  riskScore,
}: WhatsAppAlertProps) {
  const whatsappUrl = generateWhatsAppUrl(contactNumber, patientName, riskScore);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-lg rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
    >
      <MessageCircle className="w-6 h-6" />
      <span>SEND WHATSAPP ALERT</span>
      <ExternalLink className="w-5 h-5" />
    </a>
  );
}
