"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Clock, Flag, Loader2, Menu, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { subjectsData } from "@/lib/subjects-data"

export default function TestPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { subject, class: classLevel, chapter } = params

  const [currentDifficulty, setCurrentDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [markedForReview, setMarkedForReview] = useState<string[]>([])
  const [timeRemaining, setTimeRemaining] = useState(5400) // 90 minutes = 5400 seconds
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  // Get chapter name from subjects data
  const getChapterName = () => {
    const subjectData = subjectsData[subject as keyof typeof subjectsData]
    if (!subjectData) return "Unknown Chapter"

    const chapters = classLevel === "class11" ? subjectData.class11 : subjectData.class12
    const chapterData = chapters.find((ch) => ch.id === chapter)
    return chapterData?.name || "Unknown Chapter"
  }

  // Load questions from API
  useEffect(() => {
    loadQuestions()
  }, [subject, chapter, currentDifficulty])

  // Timer
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmitTest()
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  // Update the loadQuestions function to use the new API endpoint
  const loadQuestions = async () => {
    setIsLoading(true)
    setLoadingError(null)

    try {
      console.log(`Loading questions for ${subject} - ${chapter} (${classLevel}, ${currentDifficulty})`)

      const response = await fetch("/api/questions/generate-from-supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          chapter,
          classLevel,
          forceRegenerate: false,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const difficultyQuestions = data.questions[currentDifficulty] || []
        setQuestions(difficultyQuestions)

        toast({
          title: data.cached ? "Questions Loaded" : "Questions Generated",
          description: `${difficultyQuestions.length} questions ready for ${currentDifficulty} level`,
        })

        console.log(`Loaded ${difficultyQuestions.length} questions for ${currentDifficulty}`)
      } else {
        throw new Error(data.error || "Failed to load questions")
      }
    } catch (error) {
      console.error("Error loading questions:", error)
      setLoadingError(error instanceof Error ? error.message : "Failed to load questions")

      toast({
        title: "Error Loading Questions",
        description: "Please try again or contact support if the issue persists",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: value,
    }))
  }

  const handleMarkForReview = () => {
    const questionId = questions[currentQuestionIndex].id
    if (markedForReview.includes(questionId)) {
      setMarkedForReview((prev) => prev.filter((id) => id !== questionId))
    } else {
      setMarkedForReview((prev) => [...prev, questionId])
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmitTest = async () => {
    setIsSubmitting(true)

    try {
      // Submit test results
      const response = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "temp-user-id", // Replace with actual user ID
          subject,
          chapter,
          class: classLevel,
          difficulty: currentDifficulty,
          answers,
          questions,
          timeTaken: 5400 - timeRemaining,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Test Submitted",
          description: "Your test has been submitted successfully",
        })

        // Redirect to analysis page
        router.push(`/dashboard/analysis/${data.testId}`)
      } else {
        throw new Error(data.error || "Failed to submit test")
      }
    } catch (error) {
      console.error("Error submitting test:", error)
      toast({
        title: "Error",
        description: "Failed to submit test. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const switchDifficulty = (newDifficulty: "easy" | "medium" | "hard") => {
    setCurrentDifficulty(newDifficulty)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setMarkedForReview([])
    setTimeRemaining(5400) // Reset timer for new difficulty
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-sm md:text-base">Generating questions...</p>
          <p className="text-xs text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-medium mb-2">Unable to Load Questions</h2>
          <p className="text-gray-600 mb-4">{loadingError || "No questions available for this chapter"}</p>
          <div className="space-y-2">
            <Button onClick={() => loadQuestions()} className="w-full">
              Try Again
            </Button>
            <Button variant="outline" onClick={() => router.back()} className="w-full">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isMarkedForReview = markedForReview.includes(currentQuestion.id)
  const currentAnswer = answers[currentQuestion.id] || ""

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-2" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="min-w-0 flex-1">
                <h1 className="text-sm font-medium truncate">
                  {subject && typeof subject === "string" && subject.charAt(0).toUpperCase() + subject.slice(1)}
                </h1>
                <p className="text-xs text-gray-500 truncate">
                  {getChapterName()} - Class {classLevel?.replace("class", "")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs">
                <Clock className="h-3 w-3 text-gray-500" />
                <span className="font-medium">{formatTime(timeRemaining)}</span>
              </div>

              <Sheet open={isNavigationOpen} onOpenChange={setIsNavigationOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 md:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <QuestionNavigation
                    questions={questions}
                    currentIndex={currentQuestionIndex}
                    answers={answers}
                    markedForReview={markedForReview}
                    onQuestionSelect={(index) => {
                      setCurrentQuestionIndex(index)
                      setIsNavigationOpen(false)
                    }}
                    onClose={() => setIsNavigationOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Difficulty Selector - Mobile */}
          <div className="flex gap-1 mt-3 overflow-x-auto">
            {(["easy", "medium", "hard"] as const).map((difficulty) => (
              <Button
                key={difficulty}
                variant={currentDifficulty === difficulty ? "default" : "outline"}
                size="sm"
                className="text-xs whitespace-nowrap"
                onClick={() => switchDifficulty(difficulty)}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
            </div>
            <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex">
        {/* Question Content */}
        <div className="flex-1 p-4 md:p-6">
          <Card className="mb-4 md:mb-6">
            <CardContent className="p-4 md:p-6">
              <div className="mb-4">
                <Badge variant="outline" className="mb-3">
                  {currentQuestion.topic}
                </Badge>
                <p className="text-base md:text-lg leading-relaxed">{currentQuestion.question}</p>
              </div>

              <RadioGroup value={currentAnswer} onValueChange={handleAnswerChange} className="space-y-3">
                {currentQuestion.options.map((option: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} className="mt-0.5 flex-shrink-0" />
                    <Label
                      htmlFor={`option-${index}`}
                      className="text-sm md:text-base cursor-pointer leading-relaxed flex-1"
                    >
                      <span className="font-medium mr-2 text-gray-600">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Mobile Action Buttons */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="flex-1"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={isMarkedForReview ? "default" : "outline"}
                onClick={handleMarkForReview}
                className="flex-1"
              >
                <Flag className="mr-2 h-4 w-4" />
                {isMarkedForReview ? "Marked" : "Mark for Review"}
              </Button>

              <Button onClick={handleSubmitTest} disabled={isSubmitting} variant="destructive" className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Test"
                )}
              </Button>
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex justify-between">
            <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <Button variant={isMarkedForReview ? "default" : "outline"} onClick={handleMarkForReview}>
              <Flag className="mr-2 h-4 w-4" />
              {isMarkedForReview ? "Marked for Review" : "Mark for Review"}
            </Button>

            <Button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Desktop Question Navigation Sidebar */}
        <div className="hidden md:block w-80 border-l border-gray-200 bg-white">
          <QuestionNavigation
            questions={questions}
            currentIndex={currentQuestionIndex}
            answers={answers}
            markedForReview={markedForReview}
            onQuestionSelect={setCurrentQuestionIndex}
            showSubmit={true}
            onSubmit={handleSubmitTest}
            isSubmitting={isSubmitting}
          />
        </div>
      </main>
    </div>
  )
}

// Question Navigation Component
function QuestionNavigation({
  questions,
  currentIndex,
  answers,
  markedForReview,
  onQuestionSelect,
  onClose,
  showSubmit = false,
  onSubmit,
  isSubmitting = false,
}: {
  questions: any[]
  currentIndex: number
  answers: Record<string, string>
  markedForReview: string[]
  onQuestionSelect: (index: number) => void
  onClose?: () => void
  showSubmit?: boolean
  onSubmit?: () => void
  isSubmitting?: boolean
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Question Navigator</h3>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-6 gap-2">
          {questions.map((q, index) => {
            const isAnswered = !!answers[q.id]
            const isMarked = markedForReview.includes(q.id)
            const isCurrent = index === currentIndex

            return (
              <Button
                key={q.id}
                variant="outline"
                size="sm"
                className={`h-8 w-8 p-0 text-xs ${isCurrent ? "border-black bg-black text-white" : ""} ${
                  isMarked ? "bg-yellow-50 border-yellow-300" : ""
                } ${isAnswered && !isMarked ? "bg-green-50 border-green-300" : ""}`}
                onClick={() => onQuestionSelect(index)}
              >
                {index + 1}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="p-4 space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border border-green-300 rounded"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-50 border border-yellow-300 rounded"></div>
          <span>Marked for review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-black border border-black rounded"></div>
          <span>Current</span>
        </div>
      </div>

      {showSubmit && onSubmit && (
        <div className="mt-auto p-4 border-t border-gray-200">
          <Button onClick={onSubmit} disabled={isSubmitting} variant="destructive" className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Test"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
