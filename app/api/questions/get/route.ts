import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { subject, chapter, classLevel, difficulty, count = 10 } = await request.json()

    if (!subject || !chapter || !classLevel) {
      return NextResponse.json({ error: "Subject, chapter, and class level are required" }, { status: 400 })
    }

    console.log(`📚 Getting ${count} ${difficulty || "all"} questions for ${subject} - ${chapter} (${classLevel})`)

    // Build the query
    let query = supabase
      .from("questions")
      .select("*")
      .eq("subject", subject)
      .eq("chapter", chapter)
      .eq("class_level", classLevel)

    // Add difficulty filter if provided
    if (difficulty) {
      query = query.eq("difficulty", difficulty)
    }

    // Get questions
    const { data: questions, error } = await query.limit(count)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }

    // If no questions found, return empty array
    if (!questions || questions.length === 0) {
      return NextResponse.json({
        success: true,
        questions: [],
        message: "No questions found for the given criteria",
      })
    }

    console.log(`✅ Found ${questions.length} questions`)

    return NextResponse.json({
      success: true,
      questions,
      count: questions.length,
    })
  } catch (error) {
    console.error("Error getting questions:", error)
    return NextResponse.json(
      {
        error: "Failed to get questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
