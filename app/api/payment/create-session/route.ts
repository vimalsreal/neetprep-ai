import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, name, phone } = await request.json()

    if (!email || !name || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log(`💳 Creating payment session for: ${email}`)

    // Generate unique order ID
    const orderId = `EXAMGPT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // For demo purposes, we'll simulate payment creation
    // In production, integrate with actual Cashfree API
    const paymentSessionId = `session_${Date.now()}`

    // Store payment record in database
    const { error } = await supabase.from("payments").insert({
      order_id: orderId,
      email,
      amount: 1000,
      status: "pending",
      payment_session_id: paymentSessionId,
      payment_details: {
        customer_name: name,
        customer_phone: phone,
        created_at: new Date().toISOString(),
      },
    })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create payment record" }, { status: 500 })
    }

    console.log(`✅ Payment session created: ${orderId}`)

    return NextResponse.json({
      success: true,
      orderId,
      paymentSessionId,
      amount: 1000,
      // For demo - in production, return actual Cashfree payment URL
      paymentUrl: `/payment/demo?order_id=${orderId}&session_id=${paymentSessionId}`,
      message: "Payment session created successfully",
    })
  } catch (error) {
    console.error("Error creating payment session:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
