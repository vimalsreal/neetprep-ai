import { type NextRequest, NextResponse } from "next/server"
import { cashfreeService } from "@/lib/cashfree"

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Testing Cashfree API connection")

    // Test Cashfree API by fetching payment methods
    const paymentMethods = await cashfreeService.getPaymentMethods()

    return NextResponse.json({
      success: true,
      message: "Cashfree API test successful",
      paymentMethods: paymentMethods,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Cashfree test failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Make sure CASHFREE_APP_ID and CASHFREE_SECRET_KEY are configured correctly",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
