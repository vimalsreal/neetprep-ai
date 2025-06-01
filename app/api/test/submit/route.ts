import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { geminiService } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const { userId, subject, chapter, difficulty, answers, questions, timeTaken, classLevel } = await request.json()

    if (!userId || !subject || !chapter || !answers || !questions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate score and accuracy
    let correct = 0
    let incorrect = 0
    let unanswered = 0
    let score = 0

    const detailedResults = questions.map((question: any) => {
      const userAnswer = answers[question.id]
      const isCorrect = userAnswer === question.correct_answer

      if (!userAnswer) {
        unanswered++
        score += 0 // No marks for unanswered
      } else if (isCorrect) {
        correct++
        score += 4 // +4 for correct answer
      } else {
        incorrect++
        score -= 1 // -1 for wrong answer
      }

      return {
        ...question,
        userAnswer,
        isCorrect: userAnswer ? isCorrect : false,
      }
    })

    const maxScore = questions.length * 4
    const accuracy = correct > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0

    // Store test result in database
    const { data: testResult, error } = await supabase
      .from("test_results")
      .insert({
        user_id: userId,
        subject,
        chapter,
        class_level: classLevel,
        difficulty,
        score,
        max_score: maxScore,
        accuracy,
        time_taken: timeTaken,
        questions_data: detailedResults,
        correct_answers: correct,
        incorrect_answers: incorrect,
        unanswered_questions: unanswered,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save test result" }, { status: 500 })
    }

    // Generate AI analysis
    const incorrectTopics = detailedResults.filter((q: any) => !q.isCorrect && q.userAnswer).map((q: any) => q.topic)

    const analysisData = {
      subject,
      chapter,
      score,
      maxScore,
      accuracy,
      incorrectTopics,
    }

    const aiAnalysis = await geminiService.analyzeTestPerformance(analysisData)

    return NextResponse.json({
      success: true,
      testId: testResult.id,
      score,
      maxScore,
      accuracy,
      correct,
      incorrect,
      unanswered,
      aiAnalysis,
      detailedResults,
    })
  } catch (error) {
    console.error("Error submitting test:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
