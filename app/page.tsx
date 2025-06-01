"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiResponse, setAiResponse] = useState<{
    correct: boolean
    explanation: string
    reference: string
  } | null>(null)

  const demoQuestion = {
    question: "Which of the following is the correct sequence of events in mitosis?",
    options: [
      "Prophase → Metaphase → Anaphase → Telophase",
      "Prophase → Anaphase → Metaphase → Telophase",
      "Metaphase → Prophase → Telophase → Anaphase",
      "Telophase → Anaphase → Metaphase → Prophase",
    ],
    correctAnswer: "Prophase → Metaphase → Anaphase → Telophase",
    explanation:
      "Mitosis follows a specific sequence: Prophase (chromosomes condense), Metaphase (chromosomes align at the equator), Anaphase (sister chromatids separate), and Telophase (nuclear envelope reforms).",
    reference: "NCERT Biology Class 11, Chapter 10: Cell Cycle and Cell Division",
  }

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setAiResponse({
        correct: option === demoQuestion.correctAnswer,
        explanation: demoQuestion.explanation,
        reference: demoQuestion.reference,
      })
    }, 1500)
  }

  const resetDemo = () => {
    setSelectedOption(null)
    setAiResponse(null)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="font-bold text-xl bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            ExamGPT
          </div>
          <div className="space-x-4">
            <Button variant="outline" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/payment">Create New Account</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
              Crack NEET with AI
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Master NEET with personalized AI-powered practice tests, instant feedback, and expert guidance
            </p>
          </motion.div>

          {/* Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Can you solve this?</h2>

            <div className="mb-8">
              <p className="text-lg mb-4">{demoQuestion.question}</p>

              <div className="space-y-3">
                {demoQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    disabled={isAnalyzing || aiResponse !== null}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedOption === option ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                ))}
              </div>
            </div>

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <p className="mt-2 text-gray-600">AI analyzing your answer...</p>
              </div>
            )}

            {aiResponse && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  {aiResponse.correct ? (
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center mt-1 flex-shrink-0">
                      ✗
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      {aiResponse.correct ? "Great job! That's correct!" : "Not quite right, but keep going!"}
                    </h3>
                    <p className="text-gray-700 mb-3">{aiResponse.explanation}</p>
                    <p className="text-sm text-gray-500">Reference: {aiResponse.reference}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="text-center mt-8">
              <Button size="lg" className="font-medium" asChild>
                <Link href="/payment">
                  Practice Unlimited MCQs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "180 MCQs Per Chapter",
                description: "Practice with 60 easy, 60 medium, and 60 hard questions for each chapter",
              },
              {
                title: "AI-Powered Analysis",
                description: "Get instant feedback and personalized explanations for every question",
              },
              {
                title: "₹1000/Lifetime",
                description: "Get premium NEET preparation at just ₹1000 for lifetime access compared to coaching fees",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white p-6 rounded-lg border border-gray-100"
              >
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
