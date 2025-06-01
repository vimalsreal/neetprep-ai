import { type NextRequest, NextResponse } from "next/server"
import { geminiService } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const { message = "Hello, can you help me with NEET preparation?" } = await request.json()

    console.log("🧪 Testing Gemini AI with message:", message)

    // Test Gemini AI chat
    const response = await geminiService.chatWithMentor(message, {
      testMode: true,
      subject: "general",
    })

    return NextResponse.json({
      success: true,
      message: "Gemini AI test successful",
      aiResponse: response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Gemini test failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Make sure GEMINI_API_KEY is configured correctly",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
