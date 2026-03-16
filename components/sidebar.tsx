"use client"

import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  History,
  Bell,
  LogOut,
  User,
  Stethoscope,
  Activity,
} from "lucide-react"
import { Logo } from "./logo"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

interface NavItem {
  icon: typeof LayoutDashboard
  label: string
  href: string
  badge?: number
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: History, label: "History", href: "/dashboard/history" },
  { icon: Bell, label: "Alerts", href: "/dashboard/alerts", badge: 3 },
]

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { doctor, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0 animate-slide-in-left">
      {/* Logo Section */}
      <div className="p-6 border-b border-border relative overflow-hidden">
        <Logo size="sm" />
        {/* Subtle gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* Doctor Profile */}
      <div className="p-4 mx-4 mt-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-all duration-300 group cursor-default animate-fade-in-up stagger-1">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center relative group-hover:bg-primary/20 transition-colors duration-300">
            <User size={20} className="text-primary" />
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">
              {doctor?.name || "Dr. Raghuram"}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Stethoscope size={12} className="animate-float-gentle" />
              <span className="truncate">
                {doctor?.specialty || "OB-GYN"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Status Bar */}
      <div className="mx-4 mt-4 p-3 bg-green-50 rounded-lg border border-green-200 animate-fade-in-up stagger-2">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-green-600 animate-pulse" />
          <span className="text-xs font-medium text-green-700">System Active</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 mt-2">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              style={{ animationDelay: `${(index + 3) * 0.1}s` }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
                "text-sm font-medium transition-all duration-300",
                "animate-fade-in-up opacity-0",
                "relative overflow-hidden group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {/* Hover shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              
              <item.icon size={20} className={cn(
                "transition-transform duration-300",
                isActive ? "" : "group-hover:scale-110"
              )} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-semibold transition-all duration-300",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-destructive/10 text-destructive animate-pulse-ring"
                  )}
                >
                  {item.badge}
                </span>
              )}
              
              {/* Active indicator line */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
            "text-sm font-medium text-muted-foreground",
            "hover:bg-destructive/10 hover:text-destructive",
            "transition-all duration-300 group"
          )}
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
