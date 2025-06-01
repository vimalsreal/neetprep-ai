import type React from "react"
import { SiteFooter } from "@/components/site-footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      <SiteFooter />
    </div>
  )
}
