import { PatientAnalysis } from "@/components/patient-analysis"

interface PatientPageProps {
  params: Promise<{ id: string }>
}

export default async function PatientPage({ params }: PatientPageProps) {
  const { id } = await params
  return <PatientAnalysis patientId={id} />
}
