import { type NextRequest, NextResponse } from "next/server"
import { s3Service } from "@/lib/aws-s3"
import { geminiService } from "@/lib/gemini"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { subject, classLevel, chapter, forceRegenerate = false } = await request.json()

    if (!subject || !classLevel || !chapter) {
      return NextResponse.json({ error: "Subject, classLevel, and chapter are required" }, { status: 400 })
    }

    console.log(`🚀 Generating questions for ${subject} - ${classLevel} - ${chapter}`)

    // Check if questions already exist
    if (!forceRegenerate) {
      const { data: existingQuestions } = await supabase
        .from("questions")
        .select("*")
        .eq("subject", subject)
        .eq("class_level", classLevel)
        .eq("chapter", chapter)

      if (existingQuestions && existingQuestions.length >= 180) {
        const categorized = {
          easy: existingQuestions.filter((q) => q.difficulty === "easy").slice(0, 60),
          medium: existingQuestions.filter((q) => q.difficulty === "medium").slice(0, 60),
          hard: existingQuestions.filter((q) => q.difficulty === "hard").slice(0, 60),
        }

        console.log(`✅ Found existing questions: ${existingQuestions.length}`)
        return NextResponse.json({
          success: true,
          questions: categorized,
          cached: true,
          total: 180,
          source: "database",
        })
      }
    }

    // Check if PDF exists in S3
    const pdfExists = await s3Service.pdfExists(subject, classLevel, chapter)
    if (!pdfExists) {
      return NextResponse.json({ error: `PDF not found for ${subject} - ${classLevel} - ${chapter}` }, { status: 404 })
    }

    // Get PDF content from S3
    console.log(`📄 Fetching PDF from S3 for ${subject} - ${classLevel} - ${chapter}`)
    const pdfBase64 = await s3Service.getPDFBase64(subject, classLevel, chapter)

    // Generate questions for each difficulty level using Gemini
    const allQuestions = []
    const difficulties: Array<"easy" | "medium" | "hard"> = ["easy", "medium", "hard"]

    for (const difficulty of difficulties) {
      console.log(`🧠 Generating ${difficulty} questions for ${subject} - ${classLevel} - ${chapter}`)

      try {
        const questions = await geminiService.generateMCQsFromPDF(pdfBase64, subject, chapter, difficulty, 60)

        // Add metadata to each question
        const questionsWithMetadata = questions.map((q: any, index: number) => ({
          ...q,
          subject,
          chapter,
          class_level: classLevel,
          difficulty,
          id: `${subject}_${classLevel}_${chapter}_${difficulty}_${Date.now()}_${index}`,
        }))

        allQuestions.push(...questionsWithMetadata)
        console.log(`✅ Generated ${questionsWithMetadata.length} ${difficulty} questions`)
      } catch (difficultyError) {
        console.error(`❌ Error generating ${difficulty} questions:`, difficultyError)
        throw difficultyError
      }
    }

    // Store questions in database
    try {
      const questionsToInsert = allQuestions.map((q) => ({
        subject: q.subject,
        chapter: q.chapter,
        class_level: q.class_level,
        difficulty: q.difficulty,
        question: q.question,
        options: q.options,
        correct_answer: q.correctAnswer,
        explanation: q.explanation,
        topic: q.topic,
      }))

      const { error } = await supabase.from("questions").insert(questionsToInsert)

      if (error) {
        console.error("❌ Database error:", error)
        throw new Error(`Database error: ${error.message}`)
      } else {
        console.log("✅ Successfully stored questions in database")
      }
    } catch (dbError) {
      console.error("❌ Database operation failed:", dbError)
      throw dbError
    }

    // Categorize questions for response
    const categorized = {
      easy: allQuestions.filter((q) => q.difficulty === "easy"),
      medium: allQuestions.filter((q) => q.difficulty === "medium"),
      hard: allQuestions.filter((q) => q.difficulty === "hard"),
    }

    console.log(`🎉 Successfully generated ${allQuestions.length} total questions`)

    return NextResponse.json({
      success: true,
      questions: categorized,
      cached: false,
      total: allQuestions.length,
      source: "s3",
    })
  } catch (error) {
    console.error("💥 Error in generate-from-s3 route:", error)

    return NextResponse.json(
      {
        error: "Failed to generate questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
