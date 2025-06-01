import { type NextRequest, NextResponse } from "next/server"
import { geminiService } from "@/lib/gemini"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { message, userId, context } = await request.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Message and User ID are required" }, { status: 400 })
    }

    // Check user subscription status
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("subscription")
      .eq("id", userId)
      .single()

    if (userError || !user || user.subscription !== "premium") {
      console.warn("[AI CHAT] Unauthorized access attempt by user ID:", userId)
      return NextResponse.json({ error: "Access denied. Please subscribe to use the AI Mentor." }, { status: 403 })
    }

    // Get user context if userId is provided
    let userContext = null
    if (userId) {
      const { data: user } = await supabase.from("users").select("name, class").eq("id", userId).single()

      const { data: recentTests } = await supabase
        .from("test_results")
        .select("subject, chapter, accuracy, score")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5)

      userContext = {
        user,
        recentTests,
      }
    }

    // Get AI response using enhanced Gemini service
    const aiResponse = await geminiService.chatWithMentor(message, {
      ...context,
      userContext,
    })

    // Store chat message in database (optional)
    if (userId) {
      await supabase.from("chat_messages").insert({
        user_id: userId,
        message,
        ai_response: aiResponse,
        context,
      })
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
    })
  } catch (error) {
    console.error("Error in AI chat:", error)
    return NextResponse.json(
      {
        error: "Failed to get AI response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
