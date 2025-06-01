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
import { Database, Users, BookOpen, TrendingUp, Target, Clock, Award, Brain, CheckCircle, AlertCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

interface AnalyticsData {
  totalQuestions: number
  totalTests: number
  totalUsers: number
  averageScore: number
  questionsBySubject: Array<{ subject: string; count: number }>
  questionsByDifficulty: Array<{ difficulty: string; count: number }>
  testPerformance: Array<{ date: string; averageScore: number; testsCount: number }>
  topPerformers: Array<{ userId: string; averageScore: number; testsCompleted: number }>
  allUsers: Array<{ id: string; name: string; email: string; phone?: string; class?: string; city?: string; created_at: string }>
}

interface FeatureStatuses {
  [key: string]: { status: "ok" | "error"; message?: string };
}

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [featureStatuses, setFeatureStatuses] = useState<FeatureStatuses | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true)
  const [loadingFeatures, setLoadingFeatures] = useState(true)

  useEffect(() => {
    fetchAnalytics()
    fetchFeatureStatuses()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics/dashboard")
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
      // Handle error or set mock data if necessary
      setAnalyticsData(null);
    } finally {
      setLoadingAnalytics(false)
    }
  }

  const fetchFeatureStatuses = async () => {
    try {
      const response = await fetch("/api/analytics/features");
      const data = await response.json();
      if (data.success) {
        setFeatureStatuses(data.statuses);
      } else {
        console.error("Error fetching feature statuses:", data.error);
        setFeatureStatuses({}); // Set to empty object on error
      }
    } catch (error) {
      console.error("Error fetching feature statuses:", error);
      setFeatureStatuses({}); // Set to empty object on error
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const isLoading = loadingAnalytics || loadingFeatures;

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 pb-20 md:pb-0">
          <DashboardHeader />
          <main className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-gray-600">Loading admin analytics...</p>
              </div>
            </div>
          </main>
        </div>
        <MobileBottomNav />
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 pb-20 md:pb-0">
          <DashboardHeader />
          <main className="container mx-auto py-8 px-4">
            <div className="text-center">
              <p className="text-gray-600">Failed to load analytics data</p>
            </div>
          </main>
        </div>
        <MobileBottomNav />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 pb-20 md:pb-0">
        <DashboardHeader />
        <main className="container mx-auto py-8 px-4 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Platform Analytics</h1>
            <p className="text-gray-600">
              Comprehensive insights into platform usage, question bank, student performance, and feature health.
            </p>
          </div>

          {/* Feature Status Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Feature Health Status</CardTitle>
              <CardDescription>Current status of key platform features</CardDescription>
            </CardHeader>
            <CardContent>
              {featureStatuses ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(featureStatuses).map(([feature, status]) => (
                    <div key={feature} className="flex items-center gap-2">
                      {status.status === "ok" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-medium">{feature.charAt(0).toUpperCase() + feature.slice(1)}:</span>
                      <Badge variant={status.status === "ok" ? "secondary" : "destructive"}>
                        {status.status.toUpperCase()}
                      </Badge>
                      {status.message && (
                        <span className="text-sm text-gray-500" title={status.message}>({status.message})</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : ( // Should not happen with initial state and error handling, but as a fallback
                <p className="text-gray-500">Feature statuses not available.</p>
              )}
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Questions</p>
                    <p className="text-2xl font-bold">{analyticsData.totalQuestions.toLocaleString()}</p>
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
                    <p className="text-2xl font-bold">{analyticsData.totalUsers.toLocaleString()}</p>
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
                    <p className="text-2xl font-bold">{analyticsData.totalTests.toLocaleString()}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-purple-500" />
                </div>
                <div className="mt-4">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {Math.round(analyticsData.totalTests / analyticsData.totalUsers)} avg per user
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold">{analyticsData.averageScore}%</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-500" />
                </div>
                <div className="mt-4">
                  <Progress value={analyticsData.averageScore} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="questions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="questions">Question Bank</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
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
                      <BarChart data={analyticsData.questionsBySubject}>
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
                          data={analyticsData.questionsByDifficulty}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ difficulty, percent }) => `${difficulty} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {analyticsData.questionsByDifficulty.map((entry, index) => (
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
                    <LineChart data={analyticsData.testPerformance}>
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
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Students with highest average scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topPerformers.map((performer, index) => (
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
                            Top {Math.round(((index + 1) / analyticsData.topPerformers.length) * 100)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>Details of registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analyticsData.allUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name || "N/A"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone || "N/A"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.class || "N/A"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.city || "N/A"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}
