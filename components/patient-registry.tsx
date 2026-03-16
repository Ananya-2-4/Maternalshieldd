"use client"

import { useState, useMemo } from "react"
import { Search, Users, AlertTriangle, Activity, Stethoscope } from "lucide-react"
import { getAllPatients, sortPatientsByRisk, allDoctors, getHighRiskPatients, getPatientStats } from "@/lib/data"
import { PatientTile } from "./patient-tile"
import { MetricCard } from "./metric-card"
import { cn } from "@/lib/utils"

type FilterType = "all" | "critical" | "high" | "moderate" | "low"

export function PatientRegistry() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [doctorFilter, setDoctorFilter] = useState<string>("all")

  const allPatients = useMemo(() => getAllPatients(), [])
  const sortedPatients = useMemo(() => sortPatientsByRisk(allPatients), [allPatients])
  const stats = useMemo(() => getPatientStats(), [])

  const filteredPatients = useMemo(() => {
    return sortedPatients.filter((patient) => {
      // Search filter
      const matchesSearch =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase())

      // Doctor filter
      const matchesDoctor = doctorFilter === "all" || patient.doctorInCharge === doctorFilter

      // Risk filter
      let matchesFilter = true
      if (filter === "critical") matchesFilter = patient.riskScore >= 70
      else if (filter === "high") matchesFilter = patient.riskScore >= 50 && patient.riskScore < 70
      else if (filter === "moderate") matchesFilter = patient.riskScore >= 30 && patient.riskScore < 50
      else if (filter === "low") matchesFilter = patient.riskScore < 30

      return matchesSearch && matchesFilter && matchesDoctor
    })
  }, [sortedPatients, searchQuery, filter, doctorFilter])

  // Calculate summary metrics
  const highRiskPatients = useMemo(() => getHighRiskPatients(), [])
  const avgRisk = allPatients.length > 0
    ? allPatients.reduce((acc, p) => acc + p.riskScore, 0) / allPatients.length
    : 0

  const filterOptions: { value: FilterType; label: string; color: string }[] = [
    { value: "all", label: "All Patients", color: "bg-primary" },
    { value: "critical", label: "Critical", color: "bg-red-500" },
    { value: "high", label: "High", color: "bg-orange-500" },
    { value: "moderate", label: "Moderate", color: "bg-yellow-500" },
    { value: "low", label: "Low", color: "bg-green-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-semibold text-foreground">Patient Registry</h1>
        <p className="text-muted-foreground mt-1">
          Overview of antenatal patients. Select a patient to view their Bi-LSTM predictive risk trajectory.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Patients"
          value={stats.total}
          icon={<Users size={18} className="text-primary" />}
          delay={100}
        />
        <MetricCard
          label="High Risk"
          value={stats.highRisk}
          variant="critical"
          icon={<AlertTriangle size={18} className="text-red-500" />}
          delay={200}
        />
        <MetricCard
          label="Moderate Risk"
          value={stats.moderate}
          variant="warning"
          icon={<Activity size={18} className="text-orange-500" />}
          delay={300}
        />
        <MetricCard
          label="Low Risk"
          value={stats.low}
          icon={<Activity size={18} className="text-green-500" />}
          delay={400}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-lg border border-input",
                "bg-card text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                "transition-all duration-200"
              )}
            />
          </div>

          {/* Doctor Filter */}
          <div className="relative">
            <Stethoscope
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className={cn(
                "pl-10 pr-8 py-2.5 rounded-lg border border-input",
                "bg-card text-foreground appearance-none cursor-pointer",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                "transition-all duration-200"
              )}
            >
              <option value="all">All Doctors</option>
              {allDoctors.map((doctor) => (
                <option key={doctor.id} value={doctor.name}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Risk Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                filter === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:bg-secondary"
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    filter === option.value ? "bg-primary-foreground" : option.color
                  )}
                />
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Patient Grid */}
      {filteredPatients.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Users size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No patients found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient, index) => (
            <PatientTile key={patient.id} patient={patient} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
