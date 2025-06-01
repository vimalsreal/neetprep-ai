import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    console.log(`🔐 Verifying OTP for: ${email}, OTP: ${otp}`)

    // Get the most recent OTP for this email
    const { data, error } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      console.log(`❌ No OTP found for ${email}`)
      return NextResponse.json({ error: "No verification code found" }, { status: 400 })
    }

    console.log(
      `📝 Found OTP record: ${JSON.stringify({
        stored_otp: data.otp,
        provided_otp: otp,
        expires_at: data.expires_at,
        now: new Date().toISOString(),
        is_expired: new Date(data.expires_at) < new Date(),
        is_verified: data.verified,
      })}`,
    )

    // Check if OTP is expired
    if (new Date(data.expires_at) < new Date()) {
      console.log(`❌ OTP expired for ${email}`)
      return NextResponse.json({ error: "Verification code has expired" }, { status: 400 })
    }

    // Check if OTP is already verified
    if (data.verified) {
      console.log(`❌ OTP already used for ${email}`)
      return NextResponse.json({ error: "Verification code already used" }, { status: 400 })
    }

    // Check if OTP matches
    if (data.otp !== otp) {
      console.log(`❌ OTP mismatch for ${email}: Expected ${data.otp}, got ${otp}`)
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Mark OTP as verified
    await supabase.from("otp_verifications").update({ verified: true }).eq("id", data.id)

    // Check if user exists
    const { data: existingUser } = await supabase.from("users").select("*").eq("email", email).single()

    console.log(`✅ OTP verified for ${email}, isNewUser: ${!existingUser}`)

    return NextResponse.json({
      success: true,
      isNewUser: !existingUser,
      user: existingUser || null,
      message: "OTP verified successfully",
    })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
