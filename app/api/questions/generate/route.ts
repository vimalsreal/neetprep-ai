import { type NextRequest, NextResponse } from "next/server"
import { geminiService } from "@/lib/gemini"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { subject, chapter, class: classLevel, difficulty, count = 60 } = await request.json()

    if (!subject || !chapter || !classLevel || !difficulty) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    console.log(`🚀 Generating questions for ${subject} - ${chapter} (${classLevel}, ${difficulty})`)

    // Check if questions already exist in database
    const { data: existingQuestions } = await supabase
      .from("questions")
      .select("*")
      .eq("subject", subject)
      .eq("chapter", chapter)
      .eq("class_level", classLevel)
      .eq("difficulty", difficulty)

    if (existingQuestions && existingQuestions.length >= count) {
      console.log(`✅ Found existing questions: ${existingQuestions.length}`)
      return NextResponse.json({
        success: true,
        questions: existingQuestions.slice(0, count),
        cached: true,
        total: existingQuestions.length,
        source: "database",
      })
    }

    // Generate questions using Gemini AI
    console.log(`🧠 Generating ${count} ${difficulty} questions using Gemini AI`)

    const questions = await geminiService.generateMCQs(subject, chapter, classLevel, difficulty, count)

    // Store questions in database
    const questionsToInsert = questions.map((q: any, index: number) => ({
      subject,
      chapter,
      class_level: classLevel,
      difficulty,
      question: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
      explanation: q.explanation,
      topic: q.topic,
      id: `${subject}_${chapter}_${classLevel}_${difficulty}_${Date.now()}_${index}`,
    }))

    const { error } = await supabase.from("questions").insert(questionsToInsert)

    if (error) {
      console.error("Database error (continuing anyway):", error)
    } else {
      console.log("✅ Successfully stored questions in database")
    }

    return NextResponse.json({
      success: true,
      questions: questionsToInsert,
      cached: false,
      total: questionsToInsert.length,
      source: "generated",
    })
  } catch (error) {
    console.error("💥 Error in generate route:", error)

    return NextResponse.json(
      {
        error: "Failed to generate questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
