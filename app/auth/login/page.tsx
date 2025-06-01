"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function Login() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"email" | "otp">("email")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [debugOtp, setDebugOtp] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setStep("otp")
        setOtpSent(true)
        // For development/testing only - remove in production
        if (data.debug?.otp) {
          setDebugOtp(data.debug.otp)
          console.log("Debug OTP:", data.debug.otp)
        }

        toast({
          title: "OTP Sent",
          description: "Please check your email for the verification code",
        })
      } else {
        throw new Error(data.error || "Failed to send OTP")
      }
    } catch (error) {
      console.error("Error sending OTP:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send OTP",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data?.error || "Verification failed")
      }

      if (data.success) {
        toast({
          title: "Login Successful",
          description: "Welcome back to ExamGPT!",
        })

        // If it's a new user, redirect to onboarding
        if (data.isNewUser) {
          router.push("/auth/onboarding")
        } else {
          router.push("/dashboard")
        }
      } else {
        throw new Error(data.error || "Verification failed")
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid or expired OTP",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        // For development/testing only - remove in production
        if (data.debug?.otp) {
          setDebugOtp(data.debug.otp)
          console.log("Debug OTP:", data.debug.otp)
        }

        toast({
          title: "OTP Resent",
          description: "Please check your email for the new verification code",
        })
      } else {
        throw new Error(data.error || "Failed to resend OTP")
      }
    } catch (error) {
      console.error("Error resending OTP:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend OTP",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="font-bold text-xl bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent"
          >
            ExamGPT
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-gray-600 mt-2">
              {step === "email" ? "Enter your email to log in" : "Enter the verification code sent to your email"}
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                />
                {debugOtp && <p className="text-xs text-gray-500 mt-1">Debug OTP: {debugOtp} (for testing only)</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Log in"
                )}
              </Button>
              <div className="flex justify-between">
                <Button type="button" variant="link" onClick={() => setStep("email")} disabled={isLoading}>
                  Back to email
                </Button>
                <Button type="button" variant="link" onClick={handleResendOTP} disabled={isLoading || !otpSent}>
                  Resend code
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/payment" className="font-medium text-black hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
