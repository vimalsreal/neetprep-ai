"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Database, Users, BookOpen, TrendingUp, Target, Clock, Award, Brain } from "lucide-react"

interface AnalyticsData {
  totalQuestions: number
  totalTests: number
  totalUsers: number
  averageScore: number
  questionsBySubject: Array<{ subject: string; count: number }>
  questionsByDifficulty: Array<{ difficulty: string; count: number }>
  testPerformance: Array<{ date: string; averageScore: number; testsCount: number }>
  topPerformers: Array<{ userId: string; averageScore: number; testsCompleted: number }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics/dashboard")
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error("Error fetching analytics:", error)
      // Mock data for demonstration
      setData({
        totalQuestions: 15420,
        totalTests: 1250,
        totalUsers: 340,
        averageScore: 72.5,
        questionsBySubject: [
          { subject: "Physics", count: 5140 },
          { subject: "Chemistry", count: 5140 },
          { subject: "Biology", count: 5140 },
        ],
        questionsByDifficulty: [
          { difficulty: "Easy", count: 5140 },
          { difficulty: "Medium", count: 5140 },
          { difficulty: "Hard", count: 5140 },
        ],
        testPerformance: [
          { date: "2025-05-24", averageScore: 68, testsCount: 45 },
          { date: "2025-05-25", averageScore: 71, testsCount: 52 },
          { date: "2025-05-26", averageScore: 69, testsCount: 48 },
          { date: "2025-05-27", averageScore: 73, testsCount: 61 },
          { date: "2025-05-28", averageScore: 75, testsCount: 58 },
          { date: "2025-05-29", averageScore: 72, testsCount: 67 },
          { date: "2025-05-30", averageScore: 74, testsCount: 71 },
        ],
        topPerformers: [
          { userId: "user1", averageScore: 92, testsCompleted: 15 },
          { userId: "user2", averageScore: 89, testsCompleted: 12 },
          { userId: "user3", averageScore: 87, testsCompleted: 18 },
          { userId: "user4", averageScore: 85, testsCompleted: 14 },
          { userId: "user5", averageScore: 83, testsCompleted: 16 },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p className="text-gray-600">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Platform Analytics</h1>
        <p className="text-gray-600">
          Comprehensive insights into platform usage, question bank, and student performance.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold">{data.totalQuestions.toLocaleString()}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                180 per chapter
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{data.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                +12% this week
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tests Completed</p>
                <p className="text-2xl font-bold">{data.totalTests.toLocaleString()}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {Math.round(data.totalTests / data.totalUsers)} avg per user
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold">{data.averageScore}%</p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-4">
              <Progress value={data.averageScore} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="questions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="questions">Question Bank</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Questions by Subject</CardTitle>
                <CardDescription>Distribution of questions across subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.questionsBySubject}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Questions by Difficulty</CardTitle>
                <CardDescription>Breakdown of question difficulty levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.questionsByDifficulty}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ difficulty, percent }) => `${difficulty} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {data.questionsByDifficulty.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Performance Trends</CardTitle>
              <CardDescription>Average scores and test completion over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.testPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="right" dataKey="testsCount" fill="#82ca9d" />
                  <Line yAxisId="left" type="monotone" dataKey="averageScore" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Students with highest average scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topPerformers.map((performer, index) => (
                  <div key={performer.userId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">Student {performer.userId.slice(-4)}</p>
                        <p className="text-sm text-gray-600">{performer.testsCompleted} tests completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{performer.averageScore}%</p>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Award className="w-3 h-3 mr-1" />
                        Top {Math.round(((index + 1) / data.topPerformers.length) * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Weekly Growth</p>
                    <p className="text-xl font-bold">+15.2%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Clock className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Avg. Study Time</p>
                    <p className="text-xl font-bold">2.4h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Brain className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">AI Interactions</p>
                    <p className="text-xl font-bold">1,247</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
