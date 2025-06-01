"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "pending">("pending")

  const orderId = searchParams.get("order_id")

  useEffect(() => {
    if (orderId) {
      // Verify payment status
      setTimeout(() => {
        setIsVerifying(false)
        setPaymentStatus("success")
      }, 2000)
    }
  }, [orderId])

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Congratulations! Your payment has been processed successfully. You now have lifetime access to ExamGPT
              Premium.
            </p>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-800">What's Next?</p>
              <ul className="text-sm text-green-700 mt-2 space-y-1">
                <li>• Complete your profile setup</li>
                <li>• Take your first diagnostic test</li>
                <li>• Start practicing with AI-powered MCQs</li>
              </ul>
            </div>

            <Button asChild className="w-full">
              <Link href="/auth/onboarding">Complete Your Profile</Link>
            </Button>

            <p className="text-xs text-gray-500">Order ID: {orderId}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">We couldn't process your payment. Please try again.</p>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/payment">Try Again</Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
