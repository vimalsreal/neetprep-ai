"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart3, Sparkles, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Performance",
    href: "/dashboard/performance",
    icon: BarChart3,
  },
  {
    name: "AI Mentor",
    href: "/dashboard/ai-mentor",
    icon: Sparkles,
  },
]

export function DesktopSidebar() {
  const pathname = usePathname()

  const handleLogout = () => {
    // Implement logout logic
    window.location.href = "/"
  }

  return (
    <div className="h-full bg-white border-r border-gray-100 flex flex-col">
      <nav className="p-4 space-y-2 flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-black text-white" : "text-gray-600 hover:text-black hover:bg-gray-50",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Profile Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 mb-2">
          <User className="h-5 w-5" />
          <span>Profile</span>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  )
}
