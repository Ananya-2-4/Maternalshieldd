"use client"

import { AuthProvider } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"

export default function Home() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}
