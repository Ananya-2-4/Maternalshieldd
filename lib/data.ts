import type { Patient, DoctorProfile } from "./types"

export const mockDoctor: DoctorProfile = {
  id: "DR001",
  name: "Dr. Raghuram",
  specialty: "Obstetrics & Gynecology",
  department: "Maternal-Fetal Medicine",
}

export const mockPatients: Patient[] = [
  {
    id: "P001",
    name: "Lakshmi Devi",
    age: 28,
    trimester: 2,
    contactNumber: "+918309359973",
    familyHistoryPreeclampsia: true,
    firstTimePregnancy: true,
    riskScore: 82.5,
    doctorInCharge: "Dr. Raghuram",
    visits: [
      { visitNumber: 1, systolic: 115, diastolic: 72, weight: 58.5, bmi: 23.2, map: 86.3, bpVelocity: 0, riskScore: 25 },
      { visitNumber: 2, systolic: 118, diastolic: 74, weight: 59.2, bmi: 23.5, map: 88.7, bpVelocity: 2.8, riskScore: 32 },
      { visitNumber: 3, systolic: 125, diastolic: 78, weight: 60.1, bmi: 23.8, map: 93.7, bpVelocity: 5.6, riskScore: 48 },
      { visitNumber: 4, systolic: 132, diastolic: 82, weight: 61.3, bmi: 24.3, map: 98.7, bpVelocity: 5.7, riskScore: 65 },
      { visitNumber: 5, systolic: 138, diastolic: 88, weight: 62.5, bmi: 24.8, map: 104.7, bpVelocity: 6.8, riskScore: 82.5 },
    ],
  },
  {
    id: "P002",
    name: "Priya Sharma",
    age: 32,
    trimester: 3,
    contactNumber: "+919876543210",
    familyHistoryPreeclampsia: false,
    firstTimePregnancy: false,
    riskScore: 68.2,
    doctorInCharge: "Dr. Raghuram",
    visits: [
      { visitNumber: 1, systolic: 112, diastolic: 70, weight: 65.0, bmi: 25.0, map: 84.0, bpVelocity: 0, riskScore: 20 },
      { visitNumber: 2, systolic: 116, diastolic: 73, weight: 66.2, bmi: 25.5, map: 87.3, bpVelocity: 3.9, riskScore: 28 },
      { visitNumber: 3, systolic: 122, diastolic: 76, weight: 67.5, bmi: 26.0, map: 91.3, bpVelocity: 4.6, riskScore: 42 },
      { visitNumber: 4, systolic: 128, diastolic: 80, weight: 68.8, bmi: 26.5, map: 96.0, bpVelocity: 5.2, riskScore: 55 },
      { visitNumber: 5, systolic: 134, diastolic: 84, weight: 70.0, bmi: 26.9, map: 100.7, bpVelocity: 5.3, riskScore: 68.2 },
    ],
  },
  {
    id: "P003",
    name: "Ananya Reddy",
    age: 26,
    trimester: 2,
    contactNumber: "+919123456789",
    familyHistoryPreeclampsia: true,
    firstTimePregnancy: true,
    riskScore: 45.8,
    doctorInCharge: "Dr. Raghuram",
    visits: [
      { visitNumber: 1, systolic: 110, diastolic: 68, weight: 55.0, bmi: 21.5, map: 82.0, bpVelocity: 0, riskScore: 18 },
      { visitNumber: 2, systolic: 114, diastolic: 71, weight: 56.2, bmi: 22.0, map: 85.3, bpVelocity: 4.0, riskScore: 28 },
      { visitNumber: 3, systolic: 118, diastolic: 74, weight: 57.5, bmi: 22.5, map: 88.7, bpVelocity: 4.0, riskScore: 38 },
      { visitNumber: 4, systolic: 122, diastolic: 76, weight: 58.8, bmi: 23.0, map: 91.3, bpVelocity: 2.9, riskScore: 45.8 },
    ],
  },
  {
    id: "P004",
    name: "Meera Patel",
    age: 30,
    trimester: 1,
    contactNumber: "+919988776655",
    familyHistoryPreeclampsia: false,
    firstTimePregnancy: true,
    riskScore: 22.3,
    doctorInCharge: "Dr. Raghuram",
    visits: [
      { visitNumber: 1, systolic: 108, diastolic: 68, weight: 62.0, bmi: 24.0, map: 81.3, bpVelocity: 0, riskScore: 15 },
      { visitNumber: 2, systolic: 110, diastolic: 70, weight: 62.8, bmi: 24.3, map: 83.3, bpVelocity: 2.5, riskScore: 18 },
      { visitNumber: 3, systolic: 112, diastolic: 71, weight: 63.5, bmi: 24.6, map: 84.7, bpVelocity: 1.6, riskScore: 22.3 },
    ],
  },
  {
    id: "P005",
    name: "Kavitha Nair",
    age: 34,
    trimester: 3,
    contactNumber: "+919555444333",
    familyHistoryPreeclampsia: true,
    firstTimePregnancy: false,
    riskScore: 78.9,
    doctorInCharge: "Dr. Raghuram",
    visits: [
      { visitNumber: 1, systolic: 118, diastolic: 75, weight: 70.0, bmi: 27.0, map: 89.3, bpVelocity: 0, riskScore: 30 },
      { visitNumber: 2, systolic: 124, diastolic: 78, weight: 71.5, bmi: 27.5, map: 93.3, bpVelocity: 4.5, riskScore: 42 },
      { visitNumber: 3, systolic: 130, diastolic: 82, weight: 73.0, bmi: 28.1, map: 98.0, bpVelocity: 5.2, riskScore: 58 },
      { visitNumber: 4, systolic: 136, diastolic: 86, weight: 74.5, bmi: 28.7, map: 102.7, bpVelocity: 5.4, riskScore: 72 },
      { visitNumber: 5, systolic: 140, diastolic: 90, weight: 76.0, bmi: 29.2, map: 106.7, bpVelocity: 4.6, riskScore: 78.9 },
    ],
  },
  {
    id: "P006",
    name: "Sunita Kumari",
    age: 24,
    trimester: 1,
    contactNumber: "+919444555666",
    familyHistoryPreeclampsia: false,
    firstTimePregnancy: true,
    riskScore: 15.2,
    doctorInCharge: "Dr. Raghuram",
    visits: [
      { visitNumber: 1, systolic: 105, diastolic: 65, weight: 52.0, bmi: 20.5, map: 78.3, bpVelocity: 0, riskScore: 12 },
      { visitNumber: 2, systolic: 107, diastolic: 67, weight: 52.8, bmi: 20.8, map: 80.3, bpVelocity: 2.5, riskScore: 15.2 },
    ],
  },
]

export function getPatientById(id: string): Patient | undefined {
  return mockPatients.find((p) => p.id === id)
}

export function getPatientsByDoctor(doctorName: string): Patient[] {
  return mockPatients.filter(
    (p) => p.doctorInCharge.toLowerCase() === doctorName.toLowerCase()
  )
}

export function sortPatientsByRisk(patients: Patient[]): Patient[] {
  return [...patients].sort((a, b) => b.riskScore - a.riskScore)
}
