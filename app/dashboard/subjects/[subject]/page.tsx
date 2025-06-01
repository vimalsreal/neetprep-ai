"use client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, BookOpen, CheckCircle, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { useState } from "react"

// Mock data for chapters
const subjectData = {
  biology: {
    name: "Biology",
    chapters: [
      {
        id: "cell-structure",
        name: "Cell Structure and Organization",
        completed: true,
        score: 85,
        progress: 100,
      },
      {
        id: "cell-division",
        name: "Cell Cycle and Cell Division",
        completed: true,
        score: 78,
        progress: 100,
      },
      {
        id: "transport",
        name: "Transport in Plants",
        completed: false,
        score: 0,
        progress: 0,
      },
      {
        id: "mineral-nutrition",
        name: "Mineral Nutrition",
        completed: false,
        score: 0,
        progress: 0,
      },
      {
        id: "photosynthesis",
        name: "Photosynthesis in Higher Plants",
        completed: false,
        score: 0,
        progress: 0,
      },
      {
        id: "respiration",
        name: "Respiration in Plants",
        completed: false,
        score: 0,
        progress: 0,
      },
    ],
  },
  physics: {
    name: "Physics",
    chapters: [
      {
        id: "kinematics",
        name: "Kinematics",
        completed: true,
        score: 72,
        progress: 100,
      },
      {
        id: "laws-of-motion",
        name: "Laws of Motion",
        completed: true,
        score: 68,
        progress: 100,
      },
      {
        id: "work-energy-power",
        name: "Work, Energy and Power",
        completed: false,
        score: 0,
        progress: 0,
      },
      {
        id: "rotational-motion",
        name: "Rotational Motion",
        completed: false,
        score: 0,
        progress: 0,
      },
      {
        id: "gravitation",
        name: "Gravitation",
        completed: false,
        score: 0,
        progress: 0,
      },
    ],
  },
  chemistry: {
    name: "Chemistry",
    chapters: [
      {
        id: "atomic-structure",
        name: "Atomic Structure",
        completed: true,
        score: 75,
        progress: 100,
      },
      {
        id: "chemical-bonding",
        name: "Chemical Bonding and Molecular Structure",
        completed: true,
        score: 82,
        progress: 100,
      },
      {
        id: "states-of-matter",
        name: "States of Matter",
        completed: false,
        score: 0,
        progress: 0,
      },
      {
        id: "thermodynamics",
        name: "Thermodynamics",
        completed: false,
        score: 0,
        progress: 0,
      },
      {
        id: "equilibrium",
        name: "Equilibrium",
        completed: false,
        score: 0,
        progress: 0,
      },
    ],
  },
}

export default function SubjectPage() {
  const params = useParams()
  const subject = params.subject as string
  const data = subjectData[subject as keyof typeof subjectData]
  const [loadingChapter, setLoadingChapter] = useState<string | null>(null)

  if (!data) {
    return <div>Subject not found</div>
  }

  const handleStartTest = (chapterId: string) => {
    setLoadingChapter(chapterId)
    // Simulate loading time for generating questions
    setTimeout(() => {
      setLoadingChapter(null)
      window.location.href = `/dashboard/test/${subject}/${chapterId}`
    }, 1000)
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <div className="flex-1 pb-20 md:pb-0">
        <DashboardHeader />

        <main className="container mx-auto px-4 py-4 md:py-6">
          <div className="mb-4 md:mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold">{data.name}</h1>
            <p className="text-gray-600 mt-1">
              {data.chapters.filter((ch) => ch.completed).length} of {data.chapters.length} chapters completed
            </p>
          </div>

          <div className="space-y-3 md:space-y-4">
            {data.chapters.map((chapter) => (
              <Card key={chapter.id} className="overflow-hidden">
                <div className="flex flex-col">
                  <div className="p-4 md:p-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {chapter.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base md:text-lg mb-2 leading-tight">{chapter.name}</h3>

                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                          {chapter.completed ? (
                            <>
                              <Badge variant="outline" className="bg-green-50 text-xs">
                                Completed
                              </Badge>
                              <div className="text-xs md:text-sm">
                                <span className="text-gray-500">Score:</span>{" "}
                                <span className="font-medium">{chapter.score}%</span>
                              </div>
                            </>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Not started
                            </Badge>
                          )}
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-xs md:text-sm mb-1">
                            <span className="text-gray-500">Progress</span>
                            <span>{chapter.progress}%</span>
                          </div>
                          <Progress value={chapter.progress} className="h-2" />
                        </div>

                        {/* Difficulty levels - Mobile responsive */}
                        <div className="grid grid-cols-3 gap-1 md:gap-2 mb-4">
                          <Badge variant="outline" className="flex items-center justify-center text-xs py-1">
                            Easy (60)
                          </Badge>
                          <Badge variant="outline" className="flex items-center justify-center text-xs py-1">
                            Medium (60)
                          </Badge>
                          <Badge variant="outline" className="flex items-center justify-center text-xs py-1">
                            Hard (60)
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 p-4 md:p-6 bg-gray-50">
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                      <div className="text-xs md:text-sm text-gray-600">
                        <p className="font-medium mb-1">180 Total Questions</p>
                        <p>90 minutes per difficulty level</p>
                      </div>

                      <Button
                        onClick={() => handleStartTest(chapter.id)}
                        disabled={loadingChapter === chapter.id}
                        className="w-full sm:w-auto"
                      >
                        {loadingChapter === chapter.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Questions...
                          </>
                        ) : (
                          <>
                            Take Test
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}
