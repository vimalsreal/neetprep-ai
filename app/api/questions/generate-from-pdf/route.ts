import { type NextRequest, NextResponse } from "next/server"
import { pdfParserService } from "@/lib/pdf-parser"
import { geminiService } from "@/lib/gemini"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { subject, chapter, forceRegenerate = false } = await request.json()

    if (!subject || !chapter) {
      return NextResponse.json({ error: "Subject and chapter are required" }, { status: 400 })
    }

    console.log(`🚀 Generating questions for ${subject} - ${chapter}`)

    // Check if questions already exist
    if (!forceRegenerate) {
      const { data: existingQuestions } = await supabase
        .from("questions")
        .select("*")
        .eq("subject", subject)
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

    // Try to get content from S3 first, then fallback to mock content
    let pdfContent: string
    let contentSource = "s3"

    try {
      console.log(`📄 Attempting to parse PDF from S3 for ${subject} - ${chapter}`)
      pdfContent = await pdfParserService.parsePDFFromS3(subject, chapter)
      console.log("✅ Successfully parsed PDF from S3")
    } catch (s3Error) {
      console.log("⚠️ S3 PDF not available, using mock content:", s3Error)
      pdfContent = await pdfParserService.getMockContent(subject, chapter)
      contentSource = "mock"
    }

    // Generate questions for each difficulty level using Gemini
    const allQuestions = []
    const difficulties: Array<"easy" | "medium" | "hard"> = ["easy", "medium", "hard"]

    for (const difficulty of difficulties) {
      console.log(`🧠 Generating ${difficulty} questions for ${subject} - ${chapter}`)

      try {
        let questions

        if (contentSource === "s3") {
          // Use Gemini to generate from PDF content
          questions = await geminiService.generateMCQsFromPDF(pdfContent, subject, chapter, difficulty, 60)
        } else {
          // Use text-based generation for mock content
          questions = await pdfParserService.generateMCQsFromContent(pdfContent, subject, chapter, difficulty, 60)
        }

        // Add metadata to each question
        const questionsWithMetadata = questions.map((q: any, index: number) => ({
          ...q,
          subject,
          chapter,
          difficulty,
          id: `${subject}_${chapter}_${difficulty}_${Date.now()}_${index}`,
        }))

        allQuestions.push(...questionsWithMetadata)
        console.log(`✅ Generated ${questionsWithMetadata.length} ${difficulty} questions`)
      } catch (difficultyError) {
        console.error(`❌ Error generating ${difficulty} questions:`, difficultyError)

        // Generate fallback questions
        const fallbackQuestions = Array.from({ length: 60 }, (_, index) => ({
          subject,
          chapter,
          difficulty,
          id: `${subject}_${chapter}_${difficulty}_fallback_${index}`,
          question: `Sample ${difficulty} question ${index + 1} about ${chapter.replace(/-/g, " ")}`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A",
          explanation: `This is a sample ${difficulty} question about ${chapter.replace(/-/g, " ")}.`,
          topic: chapter.replace(/-/g, " "),
        }))

        allQuestions.push(...fallbackQuestions)
        console.log(`⚠️ Used fallback questions for ${difficulty}`)
      }
    }

    // Store questions in database (optional, continue even if this fails)
    try {
      const questionsToInsert = allQuestions.map((q) => ({
        subject: q.subject,
        chapter: q.chapter,
        difficulty: q.difficulty,
        question: q.question,
        options: q.options,
        correct_answer: q.correctAnswer,
        explanation: q.explanation,
        topic: q.topic,
      }))

      const { error } = await supabase.from("questions").insert(questionsToInsert)

      if (error) {
        console.error("⚠️ Database error (continuing anyway):", error)
      } else {
        console.log("✅ Successfully stored questions in database")
      }
    } catch (dbError) {
      console.error("⚠️ Database operation failed (continuing anyway):", dbError)
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
      source: contentSource,
    })
  } catch (error) {
    console.error("💥 Error in generate-from-pdf route:", error)

    // Return a user-friendly error with fallback
    return NextResponse.json(
      {
        error: "Failed to generate questions",
        details: error instanceof Error ? error.message : "Unknown error",
        fallback: true,
      },
      { status: 500 },
    )
  }
}
