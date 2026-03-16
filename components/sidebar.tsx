"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Bell,
  History,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Patient Registry",
    href: "/dashboard",
    icon: Users,
  },
  {
    label: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: History,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [doctorId, setDoctorId] = useState("Dr. Raghuram");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const storedId = sessionStorage.getItem("doctorId");
    if (storedId) {
      setDoctorId(storedId);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("doctorId");
    sessionStorage.removeItem("isAuthenticated");
    router.push("/");
  };

  return (
    <aside className="w-64 h-screen flex flex-col bg-white border-r border-border">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Logo size="sm" />
      </div>

      {/* Doctor Profile Card */}
      <div className="p-4">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#0056b3] flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-foreground">{doctorId}</p>
            <p className="text-xs text-muted-foreground">Obstetrician</p>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              isProfileOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#0056b3] text-white"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Emergency Stats Card */}
      <div className="p-4">
        <div className="clinical-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-red-600">
              HIGH PRIORITY
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">3</p>
          <p className="text-xs text-muted-foreground">
            Patients require immediate attention
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
