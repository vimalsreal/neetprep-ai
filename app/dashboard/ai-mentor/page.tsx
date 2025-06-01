"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, Sparkles, User, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export default function AIMentor() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI NEET mentor. I'm here to help you with your studies, clear doubts, and provide motivation. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage("")
    setIsLoading(true)

    try {
      console.log("🤖 Sending message to AI mentor:", currentMessage)

      // Call the AI mentor API
      const response = await fetch("/api/ai-mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentMessage,
          userId: "temp-user-id", // Replace with actual user ID from auth
          context: {
            previousMessages: messages.slice(-5), // Send last 5 messages for context
            currentSubject: "general", // Can be dynamic based on user's current activity
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: data.response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        console.log("✅ AI response received")
      } else {
        throw new Error(data.error || "Failed to get AI response")
      }
    } catch (error) {
      console.error("❌ Error sending message:", error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I'm sorry, I'm having trouble responding right now. Please try again in a moment. If the issue persists, check your internet connection.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Button variant="ghost" size="sm" className="p-2 md:hidden" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-3 flex-1">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="font-semibold text-lg">AI Mentor</h1>
            <p className="text-xs text-gray-500">Your personal NEET preparation assistant</p>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="px-4 py-4 space-y-4 pb-24">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === "user" ? "bg-black text-white" : "bg-blue-600 text-white"
                    }`}
                  >
                    {message.type === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-full ${
                      message.type === "user"
                        ? "bg-black text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.type === "user" ? "text-gray-300" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="border-t border-gray-200 bg-white p-4 fixed bottom-16 md:bottom-0 left-0 right-0 z-20">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              placeholder="Ask me anything about NEET preparation..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="pr-12 py-3 rounded-2xl border-gray-300 focus:border-blue-600 focus:ring-blue-600 resize-none"
              style={{ minHeight: "44px" }}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            size="icon"
            className="h-11 w-11 rounded-full bg-blue-600 hover:bg-blue-700 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
