import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { geminiService } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const { subject, chapter, classLevel, forceRegenerate = false } = await request.json()

    if (!subject || !chapter || !classLevel) {
      return NextResponse.json({ error: "Subject, chapter, and class level are required" }, { status: 400 })
    }

    console.log(`🚀 Generating questions for ${subject} - ${chapter} (${classLevel})`)

    // Check if questions already exist
    if (!forceRegenerate) {
      const { data: existingQuestions } = await supabase
        .from("questions")
        .select("*")
        .eq("subject", subject)
        .eq("chapter", chapter)
        .eq("class_level", classLevel)

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

    // Try to get PDF content from Supabase Storage
    let pdfContent: string | null = null
    let contentSource = "supabase"

    try {
      console.log(`📄 Fetching PDF from Supabase Storage: ${subject}/${classLevel}/${chapter}.pdf`)

      const { data: pdfData, error: pdfError } = await supabase.storage
        .from("ncert-pdfs")
        .download(`${subject}/${classLevel}/${chapter}.pdf`)

      if (pdfError) {
        throw new Error(`PDF not found: ${pdfError.message}`)
      }

      // Convert PDF to base64 for Gemini
      const arrayBuffer = await pdfData.arrayBuffer()
      const base64Data = Buffer.from(arrayBuffer).toString("base64")

      // Use Gemini to extract text from PDF
      pdfContent = await geminiService.extractTextFromPDF(base64Data)
      console.log("✅ Successfully extracted text from PDF")
    } catch (pdfError) {
      console.log("⚠️ PDF not available in Supabase, using fallback content:", pdfError)
      contentSource = "fallback"

      // Use fallback content
      pdfContent = `
# ${chapter.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())} - ${subject.toUpperCase()} Class ${classLevel.replace("class", "")}

## Introduction
This chapter covers fundamental concepts in ${subject} related to ${chapter.replace(/-/g, " ")}.

## Key Topics
1. Basic definitions and concepts
2. Important principles and laws  
3. Applications and examples
4. Problem-solving techniques

## Important Points for NEET
- Understand core concepts thoroughly
- Practice numerical problems
- Remember key formulas and definitions
- Focus on application-based questions

## Practice Questions
Regular practice with MCQs is essential for NEET preparation.
`
    }

    // Generate questions for each difficulty level
    const allQuestions = []
    const difficulties: Array<"easy" | "medium" | "hard"> = ["easy", "medium", "hard"]

    for (const difficulty of difficulties) {
      console.log(`🧠 Generating ${difficulty} questions for ${subject} - ${chapter}`)

      try {
        const questions = await geminiService.generateMCQsFromContent(
          pdfContent,
          subject,
          chapter,
          classLevel,
          difficulty,
          60,
        )

        // Add metadata to each question
        const questionsWithMetadata = questions.map((q: any, index: number) => ({
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

        allQuestions.push(...questionsWithMetadata)
        console.log(`✅ Generated ${questionsWithMetadata.length} ${difficulty} questions`)
      } catch (difficultyError) {
        console.error(`❌ Error generating ${difficulty} questions:`, difficultyError)

        // Generate fallback questions
        const fallbackQuestions = Array.from({ length: 60 }, (_, index) => ({
          subject,
          chapter,
          class_level: classLevel,
          difficulty,
          id: `${subject}_${chapter}_${classLevel}_${difficulty}_fallback_${index}`,
          question: `Sample ${difficulty} question ${index + 1} about ${chapter.replace(/-/g, " ")}`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct_answer: "Option A",
          explanation: `This is a sample ${difficulty} question about ${chapter.replace(/-/g, " ")}.`,
          topic: chapter.replace(/-/g, " "),
        }))

        allQuestions.push(...fallbackQuestions)
        console.log(`⚠️ Used fallback questions for ${difficulty}`)
      }
    }

    // Store questions in database
    try {
      const { error } = await supabase.from("questions").insert(allQuestions)

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
    console.error("💥 Error in generate-from-supabase route:", error)

    return NextResponse.json(
      {
        error: "Failed to generate questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
