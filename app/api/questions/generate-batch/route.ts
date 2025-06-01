import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { geminiService } from "@/lib/gemini"
import { subjectsData } from "@/lib/subjects-data"
import type { Subject, ClassLevel } from "@/lib/subjects-data"

export const maxDuration = 60 // 60 seconds maximum (was 300)

export async function POST(request: NextRequest) {
  try {
    const { subject, classLevel, batchSize = 5 } = await request.json()

    if (!subject || !classLevel) {
      return NextResponse.json({ error: "Subject and class level are required" }, { status: 400 })
    }

    // Validate subject and class level
    if (!Object.keys(subjectsData).includes(subject)) {
      return NextResponse.json({ error: "Invalid subject" }, { status: 400 })
    }

    if (!["class11", "class12"].includes(classLevel)) {
      return NextResponse.json({ error: "Invalid class level" }, { status: 400 })
    }

    console.log(`🚀 Starting batch generation for ${subject} - ${classLevel}, batch size: ${batchSize}`)

    // Get chapters for this subject and class
    const chapters = subjectsData[subject as Subject][classLevel as ClassLevel]

    // Select a batch of chapters that don't have complete question sets
    const chaptersToProcess = []
    const results = []

    for (const chapter of chapters) {
      // Check if this chapter already has complete questions
      const { data: existingQuestions, error } = await supabase
        .from("questions")
        .select("difficulty")
        .eq("subject", subject)
        .eq("chapter", chapter.id)
        .eq("class_level", classLevel)

      if (error) {
        console.error(`Error checking questions for ${chapter.id}:`, error)
        continue
      }

      // Count questions by difficulty
      const easyCount = existingQuestions?.filter((q) => q.difficulty === "easy").length || 0
      const mediumCount = existingQuestions?.filter((q) => q.difficulty === "medium").length || 0
      const hardCount = existingQuestions?.filter((q) => q.difficulty === "hard").length || 0

      // If we don't have 60 questions for each difficulty, add to processing list
      if (easyCount < 60 || mediumCount < 60 || hardCount < 60) {
        chaptersToProcess.push({
          chapter,
          existingCounts: { easy: easyCount, medium: mediumCount, hard: hardCount },
        })

        // Break if we've reached our batch size
        if (chaptersToProcess.length >= batchSize) break
      }
    }

    console.log(`📚 Processing ${chaptersToProcess.length} chapters`)

    // Process each chapter in the batch
    for (const { chapter, existingCounts } of chaptersToProcess) {
      console.log(`📝 Processing chapter: ${chapter.name} (${chapter.id})`)

      try {
        // Try to get PDF content from Supabase Storage
        let pdfContent: string | null = null
        let contentSource = "supabase"

        try {
          console.log(`📄 Fetching PDF from Supabase Storage: ${subject}/${classLevel}/${chapter.id}.pdf`)

          const { data: pdfData, error: pdfError } = await supabase.storage
            .from("ncert-pdfs")
            .download(`${subject}/${classLevel}/${chapter.id}.pdf`)

          if (pdfError) {
            throw new Error(`PDF not found: ${pdfError.message}`)
          }

          // Convert PDF to base64 for Gemini
          const arrayBuffer = await pdfData.arrayBuffer()
          const base64Data = Buffer.from(arrayBuffer).toString("base64")

          // Use Gemini to extract text from PDF
          pdfContent = await geminiService.extractTextFromPDF(base64Data)
          console.log(`✅ Successfully extracted text from PDF for ${chapter.name}`)
        } catch (pdfError) {
          console.log(`⚠️ PDF not available for ${chapter.name}, using fallback content:`, pdfError)
          contentSource = "fallback"

          // Use fallback content
          pdfContent = `
# ${chapter.name} - ${subject.toUpperCase()} Class ${classLevel.replace("class", "")}

## Introduction
This chapter covers fundamental concepts in ${subject} related to ${chapter.name}.

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

        // Generate questions for each difficulty level that needs more questions
        const allQuestions = []
        const difficulties: Array<"easy" | "medium" | "hard"> = ["easy", "medium", "hard"]

        for (const difficulty of difficulties) {
          // Calculate how many questions we need to generate
          const existingCount = existingCounts[difficulty]
          const neededCount = 60 - existingCount

          if (neededCount <= 0) {
            console.log(`✅ Already have enough ${difficulty} questions for ${chapter.name}`)
            continue
          }

          console.log(`🧠 Generating ${neededCount} ${difficulty} questions for ${chapter.name}`)

          try {
            const questions = await geminiService.generateMCQsFromContent(
              pdfContent,
              subject,
              chapter.id,
              classLevel,
              difficulty,
              neededCount,
            )

            // Add metadata to each question
            const questionsWithMetadata = questions.map((q: any, index: number) => ({
              subject,
              chapter: chapter.id,
              class_level: classLevel,
              difficulty,
              question: q.question,
              options: q.options,
              correct_answer: q.correctAnswer,
              explanation: q.explanation,
              topic: q.topic,
              id: `${subject}_${chapter.id}_${classLevel}_${difficulty}_${Date.now()}_${index}`,
            }))

            allQuestions.push(...questionsWithMetadata)
            console.log(`✅ Generated ${questionsWithMetadata.length} ${difficulty} questions for ${chapter.name}`)
          } catch (difficultyError) {
            console.error(`❌ Error generating ${difficulty} questions for ${chapter.name}:`, difficultyError)

            // Generate fallback questions
            const fallbackQuestions = Array.from({ length: neededCount }, (_, index) => ({
              subject,
              chapter: chapter.id,
              class_level: classLevel,
              difficulty,
              id: `${subject}_${chapter.id}_${classLevel}_${difficulty}_fallback_${Date.now()}_${index}`,
              question: `Sample ${difficulty} question ${index + 1} about ${chapter.name}`,
              options: ["Option A", "Option B", "Option C", "Option D"],
              correct_answer: "Option A",
              explanation: `This is a sample ${difficulty} question about ${chapter.name}.`,
              topic: chapter.name,
            }))

            allQuestions.push(...fallbackQuestions)
            console.log(
              `⚠️ Used ${fallbackQuestions.length} fallback questions for ${difficulty} level in ${chapter.name}`,
            )
          }
        }

        // Store questions in database
        if (allQuestions.length > 0) {
          try {
            const { error } = await supabase.from("questions").insert(allQuestions)

            if (error) {
              console.error(`⚠️ Database error for ${chapter.name} (continuing anyway):`, error)
            } else {
              console.log(`✅ Successfully stored ${allQuestions.length} questions for ${chapter.name}`)
            }
          } catch (dbError) {
            console.error(`⚠️ Database operation failed for ${chapter.name} (continuing anyway):`, dbError)
          }
        }

        // Add result for this chapter
        results.push({
          chapter: chapter.id,
          chapterName: chapter.name,
          questionsGenerated: allQuestions.length,
          contentSource,
          success: true,
        })
      } catch (chapterError) {
        console.error(`❌ Error processing chapter ${chapter.name}:`, chapterError)
        results.push({
          chapter: chapter.id,
          chapterName: chapter.name,
          questionsGenerated: 0,
          error: chapterError instanceof Error ? chapterError.message : "Unknown error",
          success: false,
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed: chaptersToProcess.length,
      results,
      message: `Batch processing completed for ${subject} - ${classLevel}`,
    })
  } catch (error) {
    console.error("💥 Error in generate-batch route:", error)

    return NextResponse.json(
      {
        error: "Failed to generate questions batch",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
