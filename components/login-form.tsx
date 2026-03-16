"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Lock, LogIn, AlertCircle, Shield, Activity } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Logo } from "./logo"
import { cn } from "@/lib/utils"

export function LoginForm() {
  const [doctorId, setDoctorId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh-animated p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-dot-pattern animate-grid-fade" />
        
        {/* Floating blobs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-3xl animate-blob" style={{ animationDelay: "-4s" }} />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-400/6 rounded-full blur-3xl animate-blob-spin" />
        
        {/* Particles */}
        <div className="absolute inset-0 bg-particles opacity-50" />
        
        {/* Floating medical icons/shapes */}
        <div className="absolute top-[20%] left-[12%] opacity-15">
          <svg className="w-20 h-20 text-primary animate-float" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </div>
        <div className="absolute bottom-[25%] right-[15%] opacity-15">
          <svg className="w-16 h-16 text-primary animate-float-delayed" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4H6v-2h4V7h2v4h4v2h-4v4z"/>
          </svg>
        </div>
        <div className="absolute top-[55%] left-[8%] opacity-10">
          <Shield className="w-14 h-14 text-primary animate-float-slow" />
        </div>
        <div className="absolute top-[15%] right-[10%] opacity-10">
          <Activity className="w-12 h-12 text-primary animate-float-gentle" />
        </div>
        
        {/* Multiple ECG lines */}
        <svg className="absolute top-[25%] left-0 w-full h-20 opacity-10" viewBox="0 0 1200 80" preserveAspectRatio="none">
          <path 
            className="animate-ecg stroke-primary" 
            fill="none" 
            strokeWidth="2"
            d="M0,40 L150,40 L170,40 L190,15 L210,65 L230,25 L250,55 L270,40 L400,40 L550,40 L570,40 L590,15 L610,65 L630,25 L650,55 L670,40 L800,40 L950,40 L970,40 L990,15 L1010,65 L1030,25 L1050,55 L1070,40 L1200,40"
          />
        </svg>
        <svg className="absolute bottom-[35%] left-0 w-full h-16 opacity-5" viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path 
            className="animate-ecg stroke-cyan-500" 
            fill="none" 
            strokeWidth="1.5"
            style={{ animationDelay: "-1.5s" }}
            d="M0,30 L200,30 L220,30 L240,10 L260,50 L280,20 L300,45 L320,30 L500,30 L700,30 L720,30 L740,10 L760,50 L780,20 L800,45 L820,30 L1000,30 L1200,30"
          />
        </svg>
        
        {/* Animated rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div className="absolute inset-0 border border-primary/5 rounded-full animate-pulse-glow" />
          <div className="absolute inset-12 border border-primary/5 rounded-full animate-pulse-glow" style={{ animationDelay: "-1s" }} />
          <div className="absolute inset-24 border border-primary/5 rounded-full animate-pulse-glow" style={{ animationDelay: "-2s" }} />
        </div>
      </div>

      <div className="w-full max-w-[420px] relative">
        {/* Login Card */}
        <div className="glass-effect rounded-2xl shadow-card-hover p-8 border border-white/50 animate-fade-in-scale">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8 animate-fade-in-up stagger-1">
            <div className="relative">
              <Logo size="lg" />
              {/* Heartbeat ring around logo */}
              <div className="absolute -inset-4 border-2 border-primary/20 rounded-full animate-heartbeat-subtle" />
            </div>
            <p className="mt-6 text-sm text-muted-foreground text-center">
              Secure Clinical Decision Support System
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-sm animate-fade-in-up">
              <AlertCircle size={16} className="animate-pulse" />
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Doctor ID Input */}
            <div className="space-y-2 animate-fade-in-up stagger-2">
              <label
                htmlFor="doctorId"
                className="text-sm font-medium text-foreground"
              >
                Doctor ID
              </label>
              <div className="relative group">
                <User
                  size={18}
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300",
                    focusedField === "doctorId" ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <input
                  id="doctorId"
                  type="text"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  onFocus={() => setFocusedField("doctorId")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g., Dr. Raghuram"
                  className={cn(
                    "w-full pl-10 pr-4 py-3.5 rounded-xl border-2",
                    "bg-white/80 text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:border-primary focus:bg-white",
                    "transition-all duration-300",
                    focusedField === "doctorId" ? "border-primary shadow-lg shadow-primary/10" : "border-border"
                  )}
                  required
                />
                {/* Animated underline */}
                <div className={cn(
                  "absolute bottom-0 left-1/2 h-0.5 bg-primary rounded-full transition-all duration-300",
                  focusedField === "doctorId" ? "w-full -translate-x-1/2" : "w-0 -translate-x-1/2"
                )} />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2 animate-fade-in-up stagger-3">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative group">
                <Lock
                  size={18}
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300",
                    focusedField === "password" ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter Password"
                  className={cn(
                    "w-full pl-10 pr-4 py-3.5 rounded-xl border-2",
                    "bg-white/80 text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:border-primary focus:bg-white",
                    "transition-all duration-300",
                    focusedField === "password" ? "border-primary shadow-lg shadow-primary/10" : "border-border"
                  )}
                  required
                />
                {/* Animated underline */}
                <div className={cn(
                  "absolute bottom-0 left-1/2 h-0.5 bg-primary rounded-full transition-all duration-300",
                  focusedField === "password" ? "w-full -translate-x-1/2" : "w-0 -translate-x-1/2"
                )} />
              </div>
            </div>

            {/* Submit Button */}
            <div className="animate-fade-in-up stagger-4">
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full py-3.5 px-4 rounded-xl font-medium",
                  "bg-primary text-primary-foreground",
                  "hover:bg-primary/90 active:scale-[0.98]",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "transition-all duration-300",
                  "flex items-center justify-center gap-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "hover-glow relative overflow-hidden group"
                )}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <>
                    <LogIn size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Authenticate</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border/50 animate-fade-in-up stagger-5">
            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
              <Shield size={12} className="text-green-500" />
              Protected health information. Authorized personnel only.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <p className="mt-4 text-xs text-muted-foreground text-center animate-fade-in-up stagger-6 flex items-center justify-center gap-2">
          <Lock size={10} />
          256-bit SSL Encrypted Connection
        </p>
      </div>
    </div>
  )
}
