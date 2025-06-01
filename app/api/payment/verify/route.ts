import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { emailService } from "@/lib/resend"

export async function POST(request: NextRequest) {
  try {
    const { orderId, status = "PAID" } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    console.log(`🔍 Verifying payment for order: ${orderId}`)

    // Update payment status in database
    const { data: payment, error } = await supabase
      .from("payments")
      .update({
        status: status.toLowerCase(),
        payment_details: {
          ...{},
          verified_at: new Date().toISOString(),
          payment_status: status,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderId)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
    }

    // If payment is successful, send welcome email
    if (status === "PAID" && payment) {
      try {
        // Get user details from payment
        const customerName = payment.payment_details?.customer_name || "Student"
        await emailService.sendWelcomeEmail(payment.email, customerName)
        console.log(`📧 Welcome email sent to ${payment.email}`)
      } catch (emailError) {
        console.error("Welcome email error:", emailError)
        // Continue anyway - payment is successful
      }
    }

    console.log(`✅ Payment verified: ${orderId} - Status: ${status}`)

    return NextResponse.json({
      success: true,
      payment,
      message: "Payment verified successfully",
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
