import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    // Get user ID from request (assuming authentication middleware provides it)
    // This is a placeholder; actual implementation depends on auth setup
    const userId = request.headers.get("x-user-id"); // Example: get user ID from a custom header

    if (!userId) {
       console.warn("[ANALYTICS] Unauthorized access attempt: Missing user ID")
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user subscription status
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("subscription")
      .eq("id", userId)
      .single()

    if (userError || !user || user.subscription !== "premium") {
      console.warn("[ANALYTICS] Unauthorized access attempt by user ID:", userId)
      return NextResponse.json({ error: "Access denied. Please subscribe to view analytics." }, { status: 403 })
    }

    // Get total questions count
    const { count: totalQuestions } = await supabase.from("questions").select("*", { count: "exact", head: true })

    // Get total tests count
    const { count: totalTests } = await supabase.from("test_results").select("*", { count: "exact", head: true })

    // Get unique users count
    const { data: uniqueUsers } = await supabase.from("test_results").select("user_id")

    const totalUsers = new Set(uniqueUsers?.map((u) => u.user_id)).size

    // Get average score
    const { data: testResults } = await supabase.from("test_results").select("accuracy")

    const averageScore = testResults?.length
      ? testResults.reduce((sum, test) => sum + test.accuracy, 0) / testResults.length
      : 0

    // Get questions by subject
    const { data: questionsBySubject } = await supabase.from("questions").select("subject")

    const subjectCounts =
      questionsBySubject?.reduce((acc: any, q) => {
        acc[q.subject] = (acc[q.subject] || 0) + 1
        return acc
      }, {}) || {}

    const questionsBySubjectData = Object.entries(subjectCounts).map(([subject, count]) => ({
      subject: subject.charAt(0).toUpperCase() + subject.slice(1),
      count: count as number,
    }))

    // Get questions by difficulty
    const { data: questionsByDifficulty } = await supabase.from("questions").select("difficulty")

    const difficultyCounts =
      questionsByDifficulty?.reduce((acc: any, q) => {
        acc[q.difficulty] = (acc[q.difficulty] || 0) + 1
        return acc
      }, {}) || {}

    const questionsByDifficultyData = Object.entries(difficultyCounts).map(([difficulty, count]) => ({
      difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
      count: count as number,
    }))

    // Get test performance over time (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: recentTests } = await supabase
      .from("test_results")
      .select("created_at, accuracy")
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: true })

    // Group by date
    const testsByDate =
      recentTests?.reduce((acc: any, test) => {
        const date = test.created_at.split("T")[0]
        if (!acc[date]) {
          acc[date] = { scores: [], count: 0 }
        }
        acc[date].scores.push(test.accuracy)
        acc[date].count++
        return acc
      }, {}) || {}

    const testPerformance = Object.entries(testsByDate).map(([date, data]: [string, any]) => ({
      date,
      averageScore: data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length,
      testsCount: data.count,
    }))

    // Get top performers
    const { data: allTestResults } = await supabase.from("test_results").select("user_id, accuracy")

    const userPerformance =
      allTestResults?.reduce((acc: any, test) => {
        if (!acc[test.user_id]) {
          acc[test.user_id] = { scores: [], count: 0 }
        }
        acc[test.user_id].scores.push(test.accuracy)
        acc[test.user_id].count++
        return acc
      }, {}) || {}

    const topPerformers = Object.entries(userPerformance)
      .map(([userId, data]: [string, any]) => ({
        userId,
        averageScore: Math.round(
          data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length,
        ),
        testsCompleted: data.count,
      }))
      .filter((user) => user.testsCompleted >= 3) // Only users with at least 3 tests
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5)

    return NextResponse.json({
      totalQuestions: totalQuestions || 0,
      totalTests: totalTests || 0,
      totalUsers,
      averageScore: Math.round(averageScore),
      questionsBySubject: questionsBySubjectData,
      questionsByDifficulty: questionsByDifficultyData,
      testPerformance,
      topPerformers,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
