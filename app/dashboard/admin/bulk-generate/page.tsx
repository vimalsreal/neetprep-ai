"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, Play, CheckCircle, AlertCircle, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GenerationJob {
  subject: string
  classLevel: string
  status: "pending" | "processing" | "completed" | "failed"
  progress: number
  chaptersProcessed: number
  totalChapters: number
  questionsGenerated: number
}

export default function BulkGeneratePage() {
  const [jobs, setJobs] = useState<GenerationJob[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const { toast } = useToast()

  const subjects = [
    { key: "physics", name: "Physics" },
    { key: "chemistry", name: "Chemistry" },
    { key: "biology", name: "Biology" },
  ]

  const classLevels = [
    { key: "class11", name: "Class 11" },
    { key: "class12", name: "Class 12" },
  ]

  const initializeJobs = () => {
    const newJobs: GenerationJob[] = []

    subjects.forEach((subject) => {
      classLevels.forEach((classLevel) => {
        newJobs.push({
          subject: subject.key,
          classLevel: classLevel.key,
          status: "pending",
          progress: 0,
          chaptersProcessed: 0,
          totalChapters: 15, // Approximate chapters per subject
          questionsGenerated: 0,
        })
      })
    })

    setJobs(newJobs)
    return newJobs
  }

  const startBulkGeneration = async () => {
    setIsRunning(true)
    const initialJobs = initializeJobs()

    toast({
      title: "Bulk generation started",
      description: "Generating 180 MCQs (60 easy, 60 medium, 60 hard) for each chapter",
    })

    let completedJobs = 0
    const totalJobs = initialJobs.length

    // Process jobs sequentially to avoid overwhelming the API
    for (let i = 0; i < initialJobs.length; i++) {
      const job = initialJobs[i]

      // Update job status to processing
      setJobs((prev) => prev.map((j, index) => (index === i ? { ...j, status: "processing" } : j)))

      try {
        const response = await fetch("/api/questions/generate-batch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: job.subject,
            classLevel: job.classLevel,
            batchSize: 10, // Process all chapters at once
          }),
        })

        const data = await response.json()

        if (response.ok) {
          // Update job as completed
          setJobs((prev) =>
            prev.map((j, index) =>
              index === i
                ? {
                    ...j,
                    status: "completed",
                    progress: 100,
                    chaptersProcessed: data.processed || 0,
                    questionsGenerated:
                      data.results?.reduce((sum: number, r: any) => sum + (r.questionsGenerated || 0), 0) || 0,
                  }
                : j,
            ),
          )
        } else {
          throw new Error(data.error || "Generation failed")
        }
      } catch (error) {
        console.error(`Error processing ${job.subject} ${job.classLevel}:`, error)

        // Update job as failed
        setJobs((prev) => prev.map((j, index) => (index === i ? { ...j, status: "failed", progress: 0 } : j)))
      }

      completedJobs++
      setOverallProgress((completedJobs / totalJobs) * 100)

      // Small delay between jobs to prevent overwhelming the system
      if (i < initialJobs.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    setIsRunning(false)
    toast({
      title: "Bulk generation completed",
      description: `Processed ${completedJobs} subject-class combinations`,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      default:
        return <Database className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      processing: "default",
      completed: "default",
      failed: "destructive",
    } as const

    const colors = {
      pending: "bg-gray-100 text-gray-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const totalQuestionsGenerated = jobs.reduce((sum, job) => sum + job.questionsGenerated, 0)
  const completedJobs = jobs.filter((job) => job.status === "completed").length
  const failedJobs = jobs.filter((job) => job.status === "failed").length

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bulk Question Generation</h1>
        <p className="text-gray-600">
          Generate 180 MCQs (60 easy, 60 medium, 60 hard) for all chapters across all subjects and classes. This will
          create a comprehensive question bank for NEET preparation.
        </p>
      </div>

      {/* Control Panel */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Generation Control
          </CardTitle>
          <CardDescription>
            Start the bulk generation process to create questions for all subjects and classes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total combinations: {subjects.length * classLevels.length}</p>
              <p className="text-sm text-gray-600">
                Expected questions: ~{subjects.length * classLevels.length * 15 * 180} MCQs
              </p>
            </div>
            <Button onClick={startBulkGeneration} disabled={isRunning} size="lg" className="min-w-[200px]">
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Bulk Generation
                </>
              )}
            </Button>
          </div>

          {isRunning && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{jobs.length}</div>
              <p className="text-xs text-gray-600">Total Jobs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{completedJobs}</div>
              <p className="text-xs text-gray-600">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-600">{failedJobs}</div>
              <p className="text-xs text-gray-600">Failed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">{totalQuestionsGenerated.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Questions Generated</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Job Status Grid */}
      {jobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generation Status</CardTitle>
            <CardDescription>
              Real-time status of question generation for each subject and class combination.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium capitalize">
                        {job.subject} - {job.classLevel.replace("class", "Class ")}
                      </h3>
                    </div>
                    {getStatusIcon(job.status)}
                  </div>

                  <div className="flex justify-between items-center">
                    {getStatusBadge(job.status)}
                    <span className="text-sm text-gray-600">
                      {job.chaptersProcessed}/{job.totalChapters} chapters
                    </span>
                  </div>

                  {job.status === "processing" && <Progress value={job.progress} className="h-1" />}

                  {job.questionsGenerated > 0 && (
                    <p className="text-sm text-green-600">{job.questionsGenerated} questions generated</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
