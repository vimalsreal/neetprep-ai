"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, BarChart3, Sparkles, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Subjects",
    href: "/dashboard/subjects",
    icon: BookOpen,
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
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  // Don't show on AI Mentor page to avoid overlap with input
  if (pathname === "/dashboard/ai-mentor") {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 md:hidden z-40">
      <nav className="flex items-center justify-around py-2 px-2">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/dashboard" && pathname === "/dashboard" && !pathname.includes("/dashboard/")) ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 min-w-0",
                isActive ? "text-blue-600 bg-blue-50 scale-105" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
              )}
            >
              {item.name === "AI Mentor" ? (
                <Sparkles
                  className={cn("h-4 w-4 transition-colors duration-200", isActive ? "text-blue-600" : "text-gray-400")}
                />
              ) : (
                <item.icon
                  className={cn("h-4 w-4 transition-colors duration-200", isActive ? "text-blue-600" : "text-gray-400")}
                />
              )}
              <span className="truncate text-[10px]">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
