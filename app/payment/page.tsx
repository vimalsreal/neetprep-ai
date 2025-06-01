"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, CreditCard, Loader2, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function Payment() {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      // Create payment session
      const response = await fetch("/api/payment/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "user@example.com", // Replace with actual user email from auth
          name: "Student Name", // Replace with actual user name
          phone: "9999999999", // Replace with actual user phone
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Payment Session Created",
          description: "Redirecting to payment gateway...",
        })

        // Redirect to payment URL (demo or actual Cashfree)
        window.location.href = data.paymentUrl
      } else {
        throw new Error(data.error || "Failed to create payment session")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
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
          <div className="mb-6">
            <Link href="/auth/register" className="inline-flex items-center text-sm text-gray-600 hover:text-black">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Complete your purchase</CardTitle>
              <CardDescription>One-time payment for unlimited access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-medium">ExamGPT Premium</h3>
                    <p className="text-sm text-gray-500">Lifetime access to all features</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹1,000</p>
                    <p className="text-xs text-gray-500">One-time payment</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">What's included:</h3>
                  <ul className="space-y-2">
                    {[
                      "Unlimited practice tests with 180 MCQs per chapter",
                      "AI-powered explanations and analysis",
                      "Personalized study recommendations",
                      "NCERT-aligned content for all subjects",
                      "AI mentor for doubt clearing",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Tabs defaultValue="upi" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upi">UPI</TabsTrigger>
                    <TabsTrigger value="card">Card</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upi" className="space-y-4 pt-4">
                    <div className="flex items-center justify-center p-6 border border-gray-200 rounded-lg">
                      <div className="text-center">
                        <Smartphone className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">Pay with any UPI app</p>
                        <div className="bg-gray-100 p-4 rounded-lg mb-2">
                          <p className="font-mono text-sm">examgpt@ybl</p>
                        </div>
                        <p className="text-xs text-gray-500">or click pay to open your UPI app</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="card" className="space-y-4 pt-4">
                    <div className="flex items-center justify-center p-6 border border-gray-200 rounded-lg">
                      <div className="text-center">
                        <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm text-gray-600">Card payment will be processed securely via Cashfree</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay ₹1,000"
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6 text-center text-xs text-gray-500">
            By proceeding with the payment, you agree to our{" "}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
