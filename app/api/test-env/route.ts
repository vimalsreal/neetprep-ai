import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Check which environment variables are set (without revealing their values)
    const envStatus = {
      AWS_REGION: !!process.env.AWS_REGION,
      AWS_S3_BUCKET_NAME: !!process.env.AWS_S3_BUCKET_NAME,
      AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
      GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
      CASHFREE_APP_ID: !!process.env.CASHFREE_APP_ID,
      CASHFREE_SECRET_KEY: !!process.env.CASHFREE_SECRET_KEY,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "not set",
    }

    // Get Node.js version
    const nodeVersion = process.version

    return NextResponse.json({
      success: true,
      message: "Environment check successful",
      environment: process.env.NODE_ENV || "unknown",
      nodeVersion,
      envStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Environment test failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
