"use client";

import { useState, useEffect } from "react";
import { mockPatients, Patient } from "@/lib/mock-data";
import { PatientTile } from "@/components/patient-tile";
import { Search, Filter, Users, AlertTriangle, TrendingUp, Heart } from "lucide-react";

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("all");

  useEffect(() => {
    // In production, fetch from your Python backend API
    // For now, use mock data
    setPatients(mockPatients);
  }, []);

  // Filter patients
  const filteredPatients = patients
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());

      if (filterRisk === "all") return matchesSearch;
      if (filterRisk === "critical") return matchesSearch && p.riskScore > 75;
      if (filterRisk === "high") return matchesSearch && p.riskScore > 60 && p.riskScore <= 75;
      if (filterRisk === "elevated") return matchesSearch && p.riskScore > 35 && p.riskScore <= 60;
      if (filterRisk === "stable") return matchesSearch && p.riskScore <= 35;
      return matchesSearch;
    })
    .sort((a, b) => b.riskScore - a.riskScore);

  // Calculate stats
  const criticalCount = patients.filter((p) => p.riskScore > 75).length;
  const highCount = patients.filter((p) => p.riskScore > 60 && p.riskScore <= 75).length;
  const elevatedCount = patients.filter((p) => p.riskScore > 35 && p.riskScore <= 60).length;
  const stableCount = patients.filter((p) => p.riskScore <= 35).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Patient Registry</h1>
        <p className="text-muted-foreground mt-1">
          Real-time Bi-LSTM predictive risk monitoring for your assigned antenatal patients
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="clinical-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Patients</p>
              <p className="text-3xl font-bold text-foreground mt-1">{patients.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#0056b3]/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#0056b3]" />
            </div>
          </div>
        </div>

        <div className="clinical-card p-5 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical Risk</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{criticalCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="clinical-card p-5 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High/Elevated</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{highCount + elevatedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="clinical-card p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Stable Baseline</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stableCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patients by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical ({">"}75%)</option>
            <option value="high">High (60-75%)</option>
            <option value="elevated">Elevated (35-60%)</option>
            <option value="stable">Stable ({"<"}35%)</option>
          </select>
        </div>
      </div>

      {/* Patient List */}
      <div className="space-y-4">
        {filteredPatients.length === 0 ? (
          <div className="clinical-card p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">No patients found</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <PatientTile key={patient.id} patient={patient} />
          ))
        )}
      </div>
    </div>
  );
}
