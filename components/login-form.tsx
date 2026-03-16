"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Lock, LogIn, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Logo } from "./logo"
import { cn } from "@/lib/utils"

export function LoginForm() {
  const [doctorId, setDoctorId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (login(doctorId, password)) {
      router.push("/dashboard")
    } else {
      setError("Please enter valid credentials")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-mesh" />
        
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-dot-pattern animate-grid-fade" />
        
        {/* Floating blobs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: "-4s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-3xl animate-pulse-glow" />
        
        {/* Floating medical icons/shapes */}
        <div className="absolute top-1/4 left-[15%] opacity-10">
          <svg className="w-16 h-16 text-primary animate-float" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </div>
        <div className="absolute bottom-1/4 right-[20%] opacity-10">
          <svg className="w-12 h-12 text-primary animate-float-delayed" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4H6v-2h4V7h2v4h4v2h-4v4z"/>
          </svg>
        </div>
        <div className="absolute top-[60%] left-[10%] opacity-10">
          <svg className="w-10 h-10 text-primary animate-float-slow" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/>
          </svg>
        </div>
        
        {/* ECG line animation */}
        <svg className="absolute bottom-[30%] left-0 w-full h-24 opacity-5" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path 
            className="animate-ecg stroke-primary" 
            fill="none" 
            strokeWidth="2"
            d="M0,50 L200,50 L220,50 L240,20 L260,80 L280,30 L300,70 L320,50 L400,50 L600,50 L620,50 L640,20 L660,80 L680,30 L700,70 L720,50 L800,50 L1000,50 L1020,50 L1040,20 L1060,80 L1080,30 L1100,70 L1120,50 L1200,50"
          />
        </svg>
      </div>

      <div className="w-full max-w-[400px] relative">
        {/* Login Card */}
        <div className="bg-card rounded-xl shadow-card p-8 border border-border">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <Logo size="lg" />
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Secure Clinical Decision Support System
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Doctor ID Input */}
            <div className="space-y-2">
              <label
                htmlFor="doctorId"
                className="text-sm font-medium text-foreground"
              >
                Doctor ID
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  id="doctorId"
                  type="text"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  placeholder="e.g., Dr. Raghuram"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-lg border border-input",
                    "bg-background text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                    "transition-all duration-200"
                  )}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-lg border border-input",
                    "bg-background text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                    "transition-all duration-200"
                  )}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-3 px-4 rounded-lg font-medium",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 active:bg-primary/80",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "transition-all duration-200",
                "flex items-center justify-center gap-2",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Authenticate
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Protected health information. Authorized personnel only.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <p className="mt-4 text-xs text-muted-foreground text-center">
          256-bit SSL Encrypted Connection
        </p>
      </div>
    </div>
  )
}
