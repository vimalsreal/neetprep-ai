"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function SiteFooter() {
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [adminCode, setAdminCode] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleAdminLogin = () => {
    if (adminCode === "Penaldo&Chokli#69") {
      toast({ title: "Admin Login", description: "Welcome, admin!", variant: "default" })
      localStorage.setItem("admin", "vimalrajxpr@gmail.com")
      setShowAdminModal(false)
      setTimeout(() => {
        router.push("/dashboard/admin/upload-pdfs")
      }, 500)
    } else {
      toast({ title: "Invalid Code", description: "Secret code is incorrect.", variant: "destructive" })
    }
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ExamGPT. All rights reserved.
          </p>
          <div className="flex gap-6 items-center">
            <Link href="/terms" className="text-sm text-gray-600 hover:text-black">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-black">
              Privacy Policy
            </Link>
            <a href="mailto:hi@examgpt.site" className="text-sm text-gray-600 hover:text-black">
              Contact Us
            </a>
            <Button size="sm" variant="outline" onClick={() => setShowAdminModal(true)}>
              Admin Login
            </Button>
          </div>
        </div>
      </div>
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
            <h2 className="text-lg font-bold mb-4">Admin Login</h2>
            <Input
              type="password"
              placeholder="Enter secret code"
              value={adminCode}
              onChange={e => setAdminCode(e.target.value)}
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={handleAdminLogin} className="flex-1">Confirm</Button>
              <Button onClick={() => setShowAdminModal(false)} variant="outline" className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}
