import { type NextRequest, NextResponse } from "next/server"
import { s3Service } from "@/lib/aws-s3"
import { geminiService } from "@/lib/gemini"
import { supabase } from "@/lib/supabase"
import { subjectsData } from "@/lib/subjects-data"

export const maxDuration = 60 // 1 minute (Vercel Hobby plan limit)

export async function POST(request: NextRequest) {
  try {
    const { forceRegenerate = false, batchSize = 3 } = await request.json().catch(() => ({}))
    console.log(`🚀 Starting MCQ generation for all chapters (batch size: ${batchSize})`)

    const results = []
    let totalGenerated = 0
    let processedCount = 0

    // Process each subject
    for (const [subjectKey, subjectData] of Object.entries(subjectsData)) {
      console.log(`📚 Processing subject: ${subjectKey}`)

      // Process each class level
      for (const [classKey, chapters] of Object.entries(subjectData)) {
        console.log(`📖 Processing ${subjectKey} - ${classKey}`)

        // Process chapters in batches
        for (let i = 0; i < chapters.length; i += batchSize) {
          const batch = chapters.slice(i, i + batchSize)

          for (const chapter of batch) {
            // Ensure chapter is always an object
            const chapterObj = typeof chapter === "string" ? { id: chapter, name: chapter, chapter: 0 } : chapter;
            try {
              processedCount++
              console.log(`📝 Processing chapter ${processedCount}: ${chapterObj.name} (${chapterObj.id})`)

              // Check if questions already exist
              if (!forceRegenerate) {
                const { data: existingQuestions } = await supabase
                  .from("questions")
                  .select("difficulty")
                  .eq("subject", subjectKey)
                  .eq("chapter", chapterObj.id)
                  .eq("class_level", classKey)

                const counts = {
                  easy: existingQuestions?.filter((q) => q.difficulty === "easy").length || 0,
                  medium: existingQuestions?.filter((q) => q.difficulty === "medium").length || 0,
                  hard: existingQuestions?.filter((q) => q.difficulty === "hard").length || 0,
                }

                if (counts.easy >= 60 && counts.medium >= 60 && counts.hard >= 60) {
                  console.log(`✅ Chapter ${chapterObj.name} already has complete question set`)
                  results.push({
                    subject: subjectKey,
                    class: classKey,
                    chapter: chapterObj.id,
                    chapterName: chapterObj.name,
                    status: "skipped",
                    reason: "Already has complete questions",
                    existing: counts,
                  })
                  continue
                }
              }

              // Check if PDF exists in S3
              const pdfExists = await s3Service.pdfExists(subjectKey, classKey, chapterObj.id)
              if (!pdfExists) {
                console.log(`⚠️ PDF not found for ${subjectKey}/${classKey}/${chapterObj.id}`)
                results.push({
                  subject: subjectKey,
                  class: classKey,
                  chapter: chapterObj.id,
                  chapterName: chapterObj.name,
                  status: "error",
                  reason: "PDF not found in S3",
                })
                continue
              }

              // Get PDF content
              console.log(`📄 Fetching PDF for ${chapterObj.name}`)
              const pdfBase64 = await s3Service.getPDFBase64(subjectKey, classKey, chapterObj.id)

              // Extract text content from PDF
              const pdfContent = await geminiService.extractTextFromPDF(pdfBase64)

              // Generate questions for each difficulty level
              const allQuestions = []
              const difficulties: Array<"easy" | "medium" | "hard"> = ["easy", "medium", "hard"]

              for (const difficulty of difficulties) {
                console.log(`🧠 Generating ${difficulty} questions for ${chapterObj.name}`)

                try {
                  const questions = await geminiService.generateMCQsFromContent(
                    pdfContent,
                    subjectKey,
                    chapterObj.id,
                    classKey,
                    difficulty,
                    60,
                  )

                  // Add metadata and unique IDs
                  const questionsWithMetadata = questions.map((q: any, index: number) => ({
                    subject: subjectKey,
                    chapter: chapterObj.id,
                    class_level: classKey,
                    difficulty,
                    question: q.question,
                    options: q.options,
                    correct_answer: q.correctAnswer,
                    explanation: q.explanation,
                    topic: q.topic,
                    // Generate unique ID to prevent duplicates
                    id: `${subjectKey}_${classKey}_${chapterObj.id}_${difficulty}_${Date.now()}_${index}`,
                  }))

                  allQuestions.push(...questionsWithMetadata)
                  console.log(`✅ Generated ${questionsWithMetadata.length} ${difficulty} questions`)
                } catch (difficultyError) {
                  console.error(`❌ Error generating ${difficulty} questions:`, difficultyError)
                  throw difficultyError
                }
              }

              // Store questions in database
              if (allQuestions.length > 0) {
                // Remove existing questions if force regenerating
                if (forceRegenerate) {
                  await supabase
                    .from("questions")
                    .delete()
                    .eq("subject", subjectKey)
                    .eq("chapter", chapterObj.id)
                    .eq("class_level", classKey)
                }

                // Insert new questions
                const { error } = await supabase.from("questions").insert(allQuestions)

                if (error) {
                  console.error(`❌ Database error for ${chapterObj.name}:`, error)
                  throw error
                }

                console.log(`✅ Stored ${allQuestions.length} questions for ${chapterObj.name}`)
                totalGenerated += allQuestions.length
              }

              results.push({
                subject: subjectKey,
                class: classKey,
                chapter: chapterObj.id,
                chapterName: chapterObj.name,
                status: "success",
                questionsGenerated: allQuestions.length,
                breakdown: {
                  easy: allQuestions.filter((q) => q.difficulty === "easy").length,
                  medium: allQuestions.filter((q) => q.difficulty === "medium").length,
                  hard: allQuestions.filter((q) => q.difficulty === "hard").length,
                },
              })
            } catch (chapterError) {
              console.error(`❌ Error processing ${chapterObj.name}:`, chapterError)
              results.push({
                subject: subjectKey,
                class: classKey,
                chapter: chapterObj.id,
                chapterName: chapterObj.name,
                status: "error",
                error: chapterError instanceof Error ? chapterError.message : "Unknown error",
              })
            }

            // Add delay between chapters to avoid rate limits
            await new Promise((resolve) => setTimeout(resolve, 2000))
          }

          // Add longer delay between batches
          if (i + batchSize < chapters.length) {
            console.log(`⏳ Waiting before next batch...`)
            await new Promise((resolve) => setTimeout(resolve, 5000))
          }
        }
      }
    }

    console.log(`🎉 MCQ generation completed! Total generated: ${totalGenerated}`)

    return NextResponse.json({
      success: true,
      totalGenerated,
      processedChapters: processedCount,
      results,
      summary: {
        successful: results.filter((r) => r.status === "success").length,
        skipped: results.filter((r) => r.status === "skipped").length,
        errors: results.filter((r) => r.status === "error").length,
      },
    })
  } catch (error) {
    console.error("💥 Error in generate-all-mcqs:", error)
    // Enhanced error logging
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to generate MCQs",
          details: error.message,
          stack: error.stack,
          name: error.name,
        },
        { status: 500 },
      )
    } else {
      return NextResponse.json(
        {
          error: "Failed to generate MCQs",
          details: JSON.stringify(error),
        },
        { status: 500 },
      )
    }
  }
}
