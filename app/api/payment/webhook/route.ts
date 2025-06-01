import { type NextRequest, NextResponse } from "next/server"
import { cashfreeService } from "@/lib/cashfree"
import { supabase } from "@/lib/supabase"
import { emailService } from "@/lib/resend"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id, payment_status } = body

    if (!order_id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Verify payment with Cashfree
    const paymentDetails = await cashfreeService.verifyPayment(order_id)

    // Update payment status in database
    const { data: payment, error } = await supabase
      .from("payments")
      .update({
        status: payment_status.toLowerCase(),
        payment_details: paymentDetails,
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", order_id)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
    }

    // If payment is successful, send welcome email
    if (payment_status === "PAID" && payment) {
      // Get user details
      const { data: user } = await supabase.from("users").select("name").eq("email", payment.email).single()

      if (user) {
        await emailService.sendWelcomeEmail(payment.email, user.name)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
