"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Clock, Target, Loader2, Atom, Microscope, Zap } from "lucide-react"
import { subjectsData } from "@/lib/subjects-data"

export default function SubjectsPage() {
  const [loadingTest, setLoadingTest] = useState<string | null>(null)

  const handleStartTest = (subject: string, classLevel: string, chapterId: string) => {
    setLoadingTest(`${subject}-${chapterId}`)
    // Simulate loading time for generating questions
    setTimeout(() => {
      setLoadingTest(null)
      window.location.href = `/dashboard/test/${subject}/${classLevel}/${chapterId}`
    }, 1000)
  }

  // Subject configurations with icons and colors
  const subjectConfigs = {
    physics: {
      icon: Zap,
      color: "bg-blue-500",
      name: "Physics",
    },
    chemistry: {
      icon: Atom,
      color: "bg-green-500",
      name: "Chemistry",
    },
    biology: {
      icon: Microscope,
      color: "bg-purple-500",
      name: "Biology",
    },
  }

  return (
    <div className="container mx-auto py-8 px-4 pb-20 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subjects</h1>
        <p className="text-gray-600">Choose a subject and chapter to start practicing</p>
      </div>

      <div className="grid gap-6">
        {Object.entries(subjectsData).map(([subjectKey, subject]) => {
          const config = subjectConfigs[subjectKey as keyof typeof subjectConfigs]
          const IconComponent = config?.icon || Target
          const totalChapters = (subject.class11?.length || 0) + (subject.class12?.length || 0)

          return (
            <Card key={subjectKey} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg ${config?.color || "bg-gray-500"} flex items-center justify-center`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{config?.name || subject.name}</CardTitle>
                      <p className="text-sm text-gray-600">{totalChapters} chapters available</p>
                    </div>
                  </div>
                  <Badge variant="outline">{totalChapters * 180} MCQs</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Class 11 Chapters */}
                {subject.class11 && subject.class11.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">Class 11</h3>
                    <div className="grid gap-3">
                      {subject.class11.map((chapter) => {
                        const progress = Math.floor(Math.random() * 100) // Random progress for demo
                        return (
                          <div
                            key={chapter.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-sm mb-1">{chapter.name}</h4>
                              <div className="flex items-center gap-4 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  <span>180 MCQs</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>90 min</span>
                                </div>
                              </div>
                              <div className="mt-2">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Progress</span>
                                  <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-1" />
                              </div>
                            </div>
                            <Button
                              onClick={() => handleStartTest(subjectKey, "class11", chapter.id)}
                              disabled={loadingTest === `${subjectKey}-${chapter.id}`}
                              size="sm"
                              className="ml-4"
                            >
                              {loadingTest === `${subjectKey}-${chapter.id}` ? (
                                <>
                                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                  Loading...
                                </>
                              ) : (
                                <>
                                  Start Test
                                  <ChevronRight className="ml-1 h-3 w-3" />
                                </>
                              )}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Class 12 Chapters */}
                {subject.class12 && subject.class12.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">Class 12</h3>
                    <div className="grid gap-3">
                      {subject.class12.map((chapter) => {
                        const progress = Math.floor(Math.random() * 100) // Random progress for demo
                        return (
                          <div
                            key={chapter.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-sm mb-1">{chapter.name}</h4>
                              <div className="flex items-center gap-4 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  <span>180 MCQs</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>90 min</span>
                                </div>
                              </div>
                              <div className="mt-2">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Progress</span>
                                  <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-1" />
                              </div>
                            </div>
                            <Button
                              onClick={() => handleStartTest(subjectKey, "class12", chapter.id)}
                              disabled={loadingTest === `${subjectKey}-${chapter.id}`}
                              size="sm"
                              className="ml-4"
                            >
                              {loadingTest === `${subjectKey}-${chapter.id}` ? (
                                <>
                                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                  Loading...
                                </>
                              ) : (
                                <>
                                  Start Test
                                  <ChevronRight className="ml-1 h-3 w-3" />
                                </>
                              )}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
