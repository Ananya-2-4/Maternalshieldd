"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { DoctorProfile, AuthState } from "./types"
import { mockDoctor } from "./data"

interface AuthContextType extends AuthState {
  login: (doctorId: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    doctor: null,
  })

  const login = useCallback((doctorId: string, password: string): boolean => {
    // Mock authentication - in production, this would validate against a backend
    if (doctorId && password) {
      setAuthState({
        isAuthenticated: true,
        doctor: {
          ...mockDoctor,
          name: doctorId.startsWith("Dr.") ? doctorId : `Dr. ${doctorId}`,
        },
      })
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      doctor: null,
    })
  }, [])

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
