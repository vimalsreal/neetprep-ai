"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, Loader2, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function PaymentDemo() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending")

  const orderId = searchParams.get("order_id")
  const sessionId = searchParams.get("session_id")

  const handlePayment = async (method: "upi" | "card") => {
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Verify payment
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: "PAID",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setPaymentStatus("success")
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully",
        })

        // Redirect to success page after a delay
        setTimeout(() => {
          router.push(`/payment/success?order_id=${orderId}`)
        }, 2000)
      } else {
        throw new Error(data.error || "Payment verification failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentStatus("failed")
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
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
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">Redirecting you to complete your profile...</p>
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Complete Payment</CardTitle>
          <p className="text-center text-gray-600">Demo Payment Gateway</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-2xl font-bold">₹1,000</p>
            <p className="text-sm text-gray-500">ExamGPT Premium - Lifetime Access</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => handlePayment("upi")}
              disabled={isProcessing}
              className="w-full h-12"
              variant="outline"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <div className="mr-2 w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
                    UPI
                  </div>
                  Pay with UPI
                </>
              )}
            </Button>

            <Button onClick={() => handlePayment("card")} disabled={isProcessing} className="w-full h-12">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay with Card
                </>
              )}
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>Order ID: {orderId}</p>
            <p className="mt-2">This is a demo payment gateway. Click any payment method to simulate payment.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
