"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, ChevronRight, Clock, Target, Award, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { subjectsData } from "@/lib/subjects-data"

export default function Dashboard() {
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setProgress(68), 500)
    return () => clearTimeout(timer)
  }, [])

  const user = {
    name: "Rahul",
    streak: 5,
    lastActivity: "Biology - Cell Division",
    recentScore: 78,
  }

  const subjects = [
    {
      name: "Biology",
      icon: BookOpen,
      progress: 72,
      chapters: 38,
      completed: 12,
      accuracy: 76,
      color: "bg-green-500",
      gradient: "from-green-500 to-green-600",
    },
    {
      name: "Physics",
      icon: BookOpen,
      progress: 45,
      chapters: 30,
      completed: 7,
      accuracy: 68,
      color: "bg-blue-500",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      name: "Chemistry",
      icon: BookOpen,
      progress: 58,
      chapters: 29,
      completed: 8,
      accuracy: 72,
      color: "bg-purple-500",
      gradient: "from-purple-500 to-purple-600",
    },
  ]

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DashboardHeader />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-in slide-in-from-top duration-500">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <span>{user.streak} day streak</span>
            <span className="text-orange-500">🔥</span>
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="animate-in slide-in-from-left duration-500 delay-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <p className="text-2xl font-bold">{progress}%</p>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">NEET Syllabus</p>
            </CardContent>
          </Card>

          <Card className="animate-in slide-in-from-bottom duration-500 delay-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{user.lastActivity}</p>
                  <p className="text-xs text-gray-500">Score: {user.recentScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in slide-in-from-right duration-500 delay-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Today's Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium text-sm">3 Chapters</p>
                  <p className="text-xs text-gray-500">2 completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">Your Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <Card
                key={subject.name}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-in slide-in-from-bottom duration-500`}
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${subject.color} group-hover:scale-110 transition-transform duration-200`}
                      />
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium">{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-xs text-gray-500">Chapters</p>
                        <p className="font-medium text-sm">
                          {subject.completed}/{subject.chapters}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Accuracy</p>
                        <p className="font-medium text-sm">{subject.accuracy}%</p>
                      </div>
                    </div>

                    {/* All Chapters for this subject */}
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium mb-3 text-gray-700">All Chapters</h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {/* Class 11 Chapters */}
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Class 11</p>
                          <div className="space-y-1">
                            {subjectsData[subject.name.toLowerCase()]?.class11.slice(0, 3).map((chapter) => (
                              <Link
                                key={chapter.id}
                                href={`/dashboard/test/${subject.name.toLowerCase()}/class11/${chapter.id}`}
                                className="block"
                              >
                                <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors duration-150 group/chapter">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium truncate">{chapter.name}</p>
                                  </div>
                                  <ChevronRight className="h-3 w-3 text-gray-400 group-hover/chapter:text-gray-600 transition-colors duration-150" />
                                </div>
                              </Link>
                            ))}
                            {subjectsData[subject.name.toLowerCase()]?.class11.length > 3 && (
                              <Link href={`/dashboard/subjects/${subject.name.toLowerCase()}`} className="block">
                                <div className="p-2 text-center">
                                  <p className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-150">
                                    +{subjectsData[subject.name.toLowerCase()].class11.length - 3} more chapters
                                  </p>
                                </div>
                              </Link>
                            )}
                          </div>
                        </div>

                        {/* Class 12 Chapters */}
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Class 12</p>
                          <div className="space-y-1">
                            {subjectsData[subject.name.toLowerCase()]?.class12.slice(0, 3).map((chapter) => (
                              <Link
                                key={chapter.id}
                                href={`/dashboard/test/${subject.name.toLowerCase()}/class12/${chapter.id}`}
                                className="block"
                              >
                                <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors duration-150 group/chapter">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium truncate">{chapter.name}</p>
                                  </div>
                                  <ChevronRight className="h-3 w-3 text-gray-400 group-hover/chapter:text-gray-600 transition-colors duration-150" />
                                </div>
                              </Link>
                            ))}
                            {subjectsData[subject.name.toLowerCase()]?.class12.length > 3 && (
                              <Link href={`/dashboard/subjects/${subject.name.toLowerCase()}`} className="block">
                                <div className="p-2 text-center">
                                  <p className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-150">
                                    +{subjectsData[subject.name.toLowerCase()].class12.length - 3} more chapters
                                  </p>
                                </div>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="animate-in slide-in-from-bottom duration-500 delay-700">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { subject: "Biology", chapter: "Cell Cycle and Cell Division", class: "11", score: 78 },
              { subject: "Chemistry", chapter: "Chemical Bonding", class: "11", score: 82 },
              { subject: "Physics", chapter: "Laws of Motion", class: "11", score: 65 },
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div>
                        <p className="font-medium text-sm">{item.chapter}</p>
                        <p className="text-xs text-gray-500">
                          {item.subject} Class {item.class}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {item.score}%
                      </Badge>
                      <Award className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  )
}
