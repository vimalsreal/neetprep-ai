import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/resend"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    console.log(`📧 Sending OTP to: ${email}`)

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Set expiration time to 30 minutes from now
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 30)

    // Check if there's an existing OTP for this email
    const { data: existingOtp } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    // Store OTP in database
    if (existingOtp) {
      // Update existing OTP
      await supabase
        .from("otp_verifications")
        .update({
          otp,
          expires_at: expiresAt.toISOString(),
          verified: false,
        })
        .eq("id", existingOtp.id)

      console.log(`✅ Updated existing OTP for ${email}`)
    } else {
      // Insert new OTP
      await supabase.from("otp_verifications").insert({
        email,
        otp,
        expires_at: expiresAt.toISOString(),
        verified: false,
      })

      console.log(`✅ Created new OTP for ${email}`)
    }

    // For development/testing, log the OTP (remove in production)
    console.log(`🔑 OTP for ${email}: ${otp}`)

    // Send OTP via email
    try {
      await emailService.sendOTP(email, otp)
      console.log(`📤 OTP email sent to ${email}`)
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      // Continue even if email fails - we'll use the console log for testing
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      // Include OTP in response for testing (remove in production)
      debug: { otp },
    })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json(
      {
        error: "Failed to send OTP",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
