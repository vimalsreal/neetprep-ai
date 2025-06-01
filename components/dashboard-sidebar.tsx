"use client"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, Brain, BarChart3, MessageSquare, Settings, Trophy } from "lucide-react"
import { DesktopSidebar } from "./desktop-sidebar"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Subjects",
    href: "/dashboard/subjects",
    icon: BookOpen,
  },
  {
    name: "Practice Tests",
    href: "/dashboard/tests",
    icon: Brain,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "AI Mentor",
    href: "/dashboard/ai-mentor",
    icon: MessageSquare,
  },
  {
    name: "Achievements",
    href: "/dashboard/achievements",
    icon: Trophy,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-screen sticky top-0 hidden md:block">
      <DesktopSidebar />
    </div>
  )
}
