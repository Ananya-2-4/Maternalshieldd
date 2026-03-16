"use client"

import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  History,
  Bell,
  LogOut,
  User,
  Stethoscope,
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
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <Logo size="sm" />
      </div>

      {/* Doctor Profile */}
      <div className="p-4 mx-4 mt-4 bg-secondary/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">
              {doctor?.name || "Dr. Raghuram"}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Stethoscope size={12} />
              <span className="truncate">
                {doctor?.specialty || "OB-GYN"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg",
                "text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon size={20} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-semibold",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {item.badge}
                </span>
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
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg",
            "text-sm font-medium text-muted-foreground",
            "hover:bg-destructive/10 hover:text-destructive",
            "transition-all duration-200"
          )}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
