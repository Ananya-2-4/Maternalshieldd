"use client"

import { Sidebar } from "./sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        
        {/* Floating ambient blobs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/3 rounded-full blur-3xl animate-float-delayed" />
      </div>
      
      <Sidebar />
      <main className="ml-64 min-h-screen relative z-10">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
