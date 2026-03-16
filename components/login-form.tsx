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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-primary/5 to-transparent rounded-full" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-primary/5 to-transparent rounded-full" />
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
