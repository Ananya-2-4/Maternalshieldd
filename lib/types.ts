export interface Patient {
  id: string
  name: string
  age: number
  trimester: number
  contactNumber: string
  familyHistoryPreeclampsia: boolean
  firstTimePregnancy: boolean
  riskScore: number
  doctorInCharge: string
  visits: PatientVisit[]
}

export interface PatientVisit {
  visitNumber: number
  systolic: number
  diastolic: number
  weight: number
  bmi: number
  map: number
  bpVelocity: number
  riskScore: number
}

export interface DoctorProfile {
  id: string
  name: string
  specialty: string
  department: string
}

export interface AuthState {
  isAuthenticated: boolean
  doctor: DoctorProfile | null
}
