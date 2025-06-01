import { type NextRequest, NextResponse } from "next/server"
import { subjectsData, type Subject, type ClassLevel } from "@/lib/subjects-data"

export const maxDuration = 60 // 1 minute timeout

export async function POST(request: NextRequest) {
  try {
    // This endpoint will trigger the batch generation for all subjects and classes
    const subjects = Object.keys(subjectsData) as Subject[]
    const classLevels = ["class11", "class12"] as ClassLevel[]

    const jobs = []

    // Queue up jobs for each subject and class level
    for (const subject of subjects) {
      for (const classLevel of classLevels) {
        // Create a job for this subject and class
        jobs.push({
          subject,
          classLevel,
          batchSize: 5, // Process 5 chapters at a time
          status: "queued",
        })
      }
    }

    // Start the first job immediately (the rest will be handled by the admin panel)
    if (jobs.length > 0) {
      const firstJob = jobs[0]

      // Make a non-blocking call to the batch generation endpoint
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/questions/generate-batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: firstJob.subject,
          classLevel: firstJob.classLevel,
          batchSize: firstJob.batchSize,
        }),
      }).catch((error) => {
        console.error("Error starting first job:", error)
      })

      firstJob.status = "processing"
    }

    return NextResponse.json({
      success: true,
      message: "Question generation jobs queued",
      jobs,
      totalJobs: jobs.length,
    })
  } catch (error) {
    console.error("Error in generate-all-questions route:", error)

    return NextResponse.json(
      {
        error: "Failed to queue question generation jobs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
