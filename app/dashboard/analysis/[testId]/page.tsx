"use client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, TrendingUp, Target, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function TestAnalysis() {
  const params = useParams()
  const testId = params.testId as string

  // Mock test results data
  const testResults = {
    subject: "Biology",
    chapter: "Cell Division",
    difficulty: "Easy",
    totalQuestions: 5,
    attempted: 4,
    correct: 3,
    incorrect: 1,
    unanswered: 1,
    score: 11, // +4 for correct, -1 for incorrect, 0 for unanswered
    maxScore: 20,
    accuracy: 75,
    timeTaken: "25:30",
    timeLimit: "60:00",
    questions: [
      {
        id: "q1",
        question: "Which of the following is the correct sequence of events in mitosis?",
        userAnswer: "Prophase → Metaphase → Anaphase → Telophase",
        correctAnswer: "Prophase → Metaphase → Anaphase → Telophase",
        isCorrect: true,
        explanation:
          "Mitosis follows a specific sequence: Prophase (chromosomes condense), Metaphase (chromosomes align at the equator), Anaphase (sister chromatids separate), and Telophase (nuclear envelope reforms).",
        topic: "Cell Division",
        difficulty: "Easy",
      },
      {
        id: "q2",
        question: "Which of the following organelles is known as the 'powerhouse of the cell'?",
        userAnswer: "Golgi apparatus",
        correctAnswer: "Mitochondria",
        isCorrect: false,
        explanation:
          "Mitochondria are called the 'powerhouse of the cell' because they produce ATP through cellular respiration, providing energy for cellular processes.",
        topic: "Cell Organelles",
        difficulty: "Easy",
      },
      {
        id: "q3",
        question: "The process by which cells engulf material is called:",
        userAnswer: "Endocytosis",
        correctAnswer: "Endocytosis",
        isCorrect: true,
        explanation:
          "Endocytosis is the process by which cells take in materials from outside the cell by engulfing them with their cell membrane.",
        topic: "Cell Transport",
        difficulty: "Easy",
      },
      {
        id: "q4",
        question: "Which of the following is NOT a function of the cell membrane?",
        userAnswer: "Selective permeability",
        correctAnswer: "Protein synthesis",
        isCorrect: false,
        explanation:
          "Protein synthesis occurs in ribosomes, not the cell membrane. The cell membrane functions include selective permeability, cell recognition, and protection.",
        topic: "Cell Membrane",
        difficulty: "Easy",
      },
      {
        id: "q5",
        question: "Chromosomes are made up of:",
        userAnswer: null,
        correctAnswer: "DNA and proteins",
        isCorrect: false,
        explanation:
          "Chromosomes consist of DNA wrapped around histone proteins, forming a complex structure that helps organize and package genetic material.",
        topic: "Genetic Material",
        difficulty: "Easy",
      },
    ],
  }

  const topicWiseAnalysis = [
    { topic: "Cell Division", total: 1, correct: 1, accuracy: 100 },
    { topic: "Cell Organelles", total: 1, correct: 0, accuracy: 0 },
    { topic: "Cell Transport", total: 1, correct: 1, accuracy: 100 },
    { topic: "Cell Membrane", total: 1, correct: 0, accuracy: 0 },
    { topic: "Genetic Material", total: 1, correct: 0, accuracy: 0 },
  ]

  const strengths = ["Cell Division", "Cell Transport"]
  const weaknesses = ["Cell Organelles", "Cell Membrane", "Genetic Material"]

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <div className="flex-1">
        <DashboardHeader />

        <main className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold">Test Analysis</h1>
            <p className="text-gray-600 mt-1">
              {testResults.subject} - {testResults.chapter} ({testResults.difficulty})
            </p>
          </div>

          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{testResults.score}</p>
                  <span className="text-sm text-gray-500">/ {testResults.maxScore}</span>
                </div>
                <Progress value={(testResults.score / testResults.maxScore) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{testResults.accuracy}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {testResults.correct}/{testResults.attempted} attempted
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Time Taken</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{testResults.timeTaken}</p>
                <p className="text-sm text-gray-500 mt-1">of {testResults.timeLimit}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Correct: {testResults.correct}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">Incorrect: {testResults.incorrect}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Unanswered: {testResults.unanswered}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="questions" className="space-y-6">
            <TabsList>
              <TabsTrigger value="questions">Question Analysis</TabsTrigger>
              <TabsTrigger value="topics">Topic-wise Analysis</TabsTrigger>
              <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="space-y-4">
              {testResults.questions.map((question, index) => (
                <Card key={question.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">Q{index + 1}.</span>
                          {question.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : question.userAnswer ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-gray-400" />
                          )}
                          <Badge variant="outline">{question.topic}</Badge>
                        </div>
                        <p className="text-base">{question.question}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Your Answer:</p>
                          <p
                            className={`${
                              question.userAnswer
                                ? question.isCorrect
                                  ? "text-green-600"
                                  : "text-red-600"
                                : "text-gray-400"
                            }`}
                          >
                            {question.userAnswer || "Not answered"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Correct Answer:</p>
                          <p className="text-green-600">{question.correctAnswer}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium mb-2">Explanation:</p>
                        <p className="text-sm text-gray-700">{question.explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="topics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {strengths.map((topic) => (
                        <div key={topic} className="flex items-center justify-between">
                          <span>{topic}</span>
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
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-red-500" />
                      Areas to Improve
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {weaknesses.map((topic) => (
                        <div key={topic} className="flex items-center justify-between">
                          <span>{topic}</span>
                          <Badge variant="outline" className="bg-red-50">
                            Needs Work
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Topic-wise Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topicWiseAnalysis.map((topic) => (
                      <div key={topic.topic} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{topic.topic}</span>
                          <span className="text-sm text-gray-500">
                            {topic.correct}/{topic.total} ({topic.accuracy}%)
                          </span>
                        </div>
                        <Progress value={topic.accuracy} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI-Powered Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">📚 Study Plan</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Based on your performance, focus on these topics in the next 7 days:
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Review Cell Organelles (NCERT Class 11, Chapter 8)</li>
                      <li>• Practice Cell Membrane functions (NCERT Class 11, Chapter 8)</li>
                      <li>• Study Genetic Material structure (NCERT Class 12, Chapter 6)</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">💪 Strengths to Maintain</h3>
                    <p className="text-sm text-gray-700">
                      Great job on Cell Division and Cell Transport! Keep practicing these topics to maintain your
                      strong foundation.
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">⚡ Quick Tips</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Create flashcards for organelle functions</li>
                      <li>• Draw diagrams to visualize cell membrane structure</li>
                      <li>• Practice more MCQs on chromosome composition</li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button asChild>
                      <Link href="/dashboard/ai-mentor">Ask AI Mentor</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/dashboard/subjects/biology">Practice More Questions</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
