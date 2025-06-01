"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { TrendingUp, Target, Award, Calendar, BookOpen, Brain } from "lucide-react"

export default function PerformancePage() {
  const [performanceData, setPerformanceData] = useState({
    overallAccuracy: 74,
    testsCompleted: 28,
    totalQuestions: 1680,
    streak: 5,
    weakAreas: ["Organic Chemistry", "Optics", "Genetics"],
    strongAreas: ["Cell Biology", "Mechanics", "Atomic Structure"],
  })

  const subjectPerformance = [
    {
      subject: "Biology",
      accuracy: 78,
      testsCompleted: 12,
      lastScore: 82,
      trend: "up",
      color: "bg-green-500",
    },
    {
      subject: "Physics",
      accuracy: 68,
      testsCompleted: 8,
      lastScore: 65,
      trend: "down",
      color: "bg-blue-500",
    },
    {
      subject: "Chemistry",
      accuracy: 76,
      testsCompleted: 8,
      lastScore: 79,
      trend: "up",
      color: "bg-purple-500",
    },
  ]

  const recentTests = [
    {
      subject: "Biology",
      chapter: "Cell Division",
      score: 82,
      accuracy: 85,
      date: "2 days ago",
      difficulty: "Medium",
    },
    {
      subject: "Chemistry",
      chapter: "Chemical Bonding",
      score: 79,
      accuracy: 78,
      date: "3 days ago",
      difficulty: "Hard",
    },
    {
      subject: "Physics",
      chapter: "Laws of Motion",
      score: 65,
      accuracy: 68,
      date: "5 days ago",
      difficulty: "Easy",
    },
  ]

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <div className="flex-1 pb-20 md:pb-0">
        <DashboardHeader />

        <main className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Performance Analytics</h1>
            <p className="text-gray-600">Track your NEET preparation progress and identify areas for improvement</p>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Overall Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-2xl font-bold">{performanceData.overallAccuracy}%</p>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <Progress value={performanceData.overallAccuracy} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Tests Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{performanceData.testsCompleted}</p>
                <p className="text-sm text-gray-500">{performanceData.totalQuestions} questions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Study Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{performanceData.streak} days</p>
                <p className="text-sm text-gray-500">Keep it up! 🔥</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Best Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">95%</p>
                <p className="text-sm text-gray-500">Biology - Cell Structure</p>
              </CardContent>
            </Card>
          </div>

          {/* Subject Performance */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Subject-wise Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {subjectPerformance.map((subject) => (
                <Card key={subject.subject}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${subject.color}`} />
                        <CardTitle className="text-lg">{subject.subject}</CardTitle>
                      </div>
                      <Badge variant="outline" className={subject.trend === "up" ? "bg-green-50" : "bg-red-50"}>
                        {subject.trend === "up" ? "↗" : "↘"} {subject.lastScore}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Accuracy</span>
                          <span className="font-medium">{subject.accuracy}%</span>
                        </div>
                        <Progress value={subject.accuracy} className="h-2" />
                      </div>

                      <div className="text-sm text-gray-600">
                        <p>{subject.testsCompleted} tests completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Strong Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {performanceData.strongAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{area}</span>
                      <Badge variant="outline" className="bg-green-50">
                        Strong
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {performanceData.weakAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{area}</span>
                      <Badge variant="outline" className="bg-orange-50">
                        Focus
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tests */}
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Test Results</h2>
            <div className="space-y-3">
              {recentTests.map((test, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-sm">{test.chapter}</p>
                          <p className="text-xs text-gray-500">
                            {test.subject} • {test.difficulty} • {test.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-medium text-sm">{test.score}%</p>
                          <p className="text-xs text-gray-500">{test.accuracy}% accuracy</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={test.score >= 80 ? "bg-green-50" : test.score >= 60 ? "bg-yellow-50" : "bg-red-50"}
                        >
                          {test.score >= 80 ? "Excellent" : test.score >= 60 ? "Good" : "Needs Work"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}
