// Mock patient data - In production, this would come from your Python backend API
export interface Patient {
  id: string;
  name: string;
  age: number;
  trimester: number;
  contactNumber: string;
  familyHistory: boolean;
  firstPregnancy: boolean;
  riskScore: number;
  doctorInCharge: string;
  visits: Visit[];
}

export interface Visit {
  visitNumber: number;
  systolic: number;
  diastolic: number;
  map: number;
  bpVelocity: number;
  weight: number;
  bmi: number;
  riskScore: number;
  date: string;
}

export const mockPatients: Patient[] = [
  {
    id: "P001",
    name: "Priya Sharma",
    age: 28,
    trimester: 2,
    contactNumber: "+918309359973",
    familyHistory: true,
    firstPregnancy: true,
    riskScore: 82.5,
    doctorInCharge: "Dr. Raghuram",
    visits: [
      { visitNumber: 1, systolic: 115, diastolic: 72, map: 86.3, bpVelocity: 0, weight: 62, bmi: 24.2, riskScore: 18.2, date: "2024-01-15" },
      { visitNumber: 2, systolic: 118, diastolic: 74, map: 88.7, bpVelocity: 2.4, weight: 63.5, bmi: 24.8, riskScore: 24.5, date: "2024-01-29" },
      { visitNumber: 3, systolic: 124, diastolic: 78, map: 93.3, bpVelocity: 4.6, weight: 65, bmi: 25.4, riskScore: 38.2, date: "2024-02-12" },
      { visitNumber: 4, systolic: 132, diastolic: 84, map: 100.0, bpVelocity: 6.7, weight: 67, bmi: 26.2, riskScore: 58.4, date: "2024-02-26" },
      { visitNumber: 5, systolic: 138, diastolic: 88, map: 104.7, bpVelocity: 4.7, weight: 68.5, bmi: 26.8, riskScore: 82.5, date: "2024-03-11" },
    ],
  },
  {
    id: "P002",
    name: "Ananya Reddy",
    age: 32,
    trimester: 3,
    contactNumber: "+919876543210",
    familyHistory: false,
    firstPregnancy: false,
    riskScore: 65.3,
    doctorInCharge: "Dr. Raghuram",
    visits: [
      { visitNumber: 1, systolic: 112, diastolic: 70, map: 84.0, bpVelocity: 0, weight: 58, bmi: 23.1, riskScore: 12.4, date: "2024-01-10" },
      { visitNumber: 2, systolic: 116, diastolic: 73, map: 87.3, bpVelocity: 3.3, weight: 59.5, bmi: 23.7, riskScore: 22.1, date: "2024-01-24" },
      { visitNumber: 3, systolic: 122, diastolic: 77, map: 92.0, bpVelocity: 4.7, weight: 61, bmi: 24.3, riskScore: 35.8, date: "2024-02-07" },
      { visitNumber: 4, systolic: 128, diastolic: 82, map: 97.3, bpVelocity: 5.3, weight: 63, bmi: 25.1, riskScore: 52.6, date: "2024-02-21" },
      { visitNumber: 5, systolic: 133, diastolic: 85, map: 101.0, bpVelocity: 3.7, weight: 64.5, bmi: 25.7, riskScore: 65.3, date: "2024-03-06" },
    ],
  },
  {
    id: "P003",
    name: "Meera Krishnan",
    age: 26,
    trimester: 1,
    contactNumber: "+919988776655",
    familyHistory: false,
    firstPregnancy: true,
    riskScore: 42.1,
    doctorInCharge: "Dr. Raghuram",
    visits: [
      { visitNumber: 1, systolic: 110, diastolic: 68, map: 82.0, bpVelocity: 0, weight: 55, bmi: 22.0, riskScore: 8.5, date: "2024-02-01" },
      { visitNumber: 2, systolic: 114, diastolic: 71, map: 85.3, bpVelocity: 3.3, weight: 56, bmi: 22.4, riskScore: 18.2, date: "2024-02-15" },
      { visitNumber: 3, systolic: 120, diastolic: 76, map: 90.7, bpVelocity: 5.4, weight: 57.5, bmi: 23.0, riskScore: 32.4, date: "2024-02-29" },
      { visitNumber: 4, systolic: 124, diastolic: 79, map: 94.0, bpVelocity: 3.3, weight: 58.5, bmi: 23.4, riskScore: 42.1, date: "2024-03-14" },
    ],
  },
  {
    id: "P004",
    name: "Lakshmi Venkatesh",
    age: 29,
    trimester: 2,
    contactNumber: "+919123456789",
    familyHistory: false,
    firstPregnancy: false,
    riskScore: 18.7,
    doctorInCharge: "Dr. Raghuram",
    visits: [
      { visitNumber: 1, systolic: 108, diastolic: 66, map: 80.0, bpVelocity: 0, weight: 60, bmi: 23.4, riskScore: 6.2, date: "2024-01-20" },
      { visitNumber: 2, systolic: 110, diastolic: 68, map: 82.0, bpVelocity: 2.0, weight: 61, bmi: 23.8, riskScore: 9.8, date: "2024-02-03" },
      { visitNumber: 3, systolic: 112, diastolic: 70, map: 84.0, bpVelocity: 2.0, weight: 62, bmi: 24.2, riskScore: 14.2, date: "2024-02-17" },
      { visitNumber: 4, systolic: 114, diastolic: 71, map: 85.3, bpVelocity: 1.3, weight: 63.5, bmi: 24.8, riskScore: 18.7, date: "2024-03-02" },
    ],
  },
  {
    id: "P005",
    name: "Deepika Nair",
    age: 34,
    trimester: 3,
    contactNumber: "+919445566778",
    familyHistory: true,
    firstPregnancy: false,
    riskScore: 78.2,
    doctorInCharge: "Dr. Raghuram",
    visits: [
      { visitNumber: 1, systolic: 118, diastolic: 74, map: 88.7, bpVelocity: 0, weight: 70, bmi: 27.3, riskScore: 22.4, date: "2024-01-05" },
      { visitNumber: 2, systolic: 124, diastolic: 79, map: 94.0, bpVelocity: 5.3, weight: 72, bmi: 28.1, riskScore: 38.6, date: "2024-01-19" },
      { visitNumber: 3, systolic: 130, diastolic: 84, map: 99.3, bpVelocity: 5.3, weight: 74, bmi: 28.9, riskScore: 55.2, date: "2024-02-02" },
      { visitNumber: 4, systolic: 135, diastolic: 87, map: 103.0, bpVelocity: 3.7, weight: 75.5, bmi: 29.5, riskScore: 68.8, date: "2024-02-16" },
      { visitNumber: 5, systolic: 139, diastolic: 90, map: 106.3, bpVelocity: 3.3, weight: 77, bmi: 30.1, riskScore: 78.2, date: "2024-03-01" },
    ],
  },
  {
    id: "P006",
    name: "Kavitha Sundaram",
    age: 27,
    trimester: 2,
    contactNumber: "+919332211445",
    familyHistory: false,
    firstPregnancy: true,
    riskScore: 28.4,
    doctorInCharge: "Dr. Raghuram",
    visits: [
      { visitNumber: 1, systolic: 110, diastolic: 68, map: 82.0, bpVelocity: 0, weight: 56, bmi: 21.9, riskScore: 7.2, date: "2024-02-05" },
      { visitNumber: 2, systolic: 114, diastolic: 72, map: 86.0, bpVelocity: 4.0, weight: 57.5, bmi: 22.5, riskScore: 16.8, date: "2024-02-19" },
      { visitNumber: 3, systolic: 118, diastolic: 75, map: 89.3, bpVelocity: 3.3, weight: 59, bmi: 23.0, riskScore: 28.4, date: "2024-03-04" },
    ],
  },
];

export function getPatientsByDoctor(doctorName: string): Patient[] {
  return mockPatients.filter(
    (p) => p.doctorInCharge.toLowerCase() === doctorName.toLowerCase()
  );
}

export function getPatientById(id: string): Patient | undefined {
  return mockPatients.find((p) => p.id === id);
}
