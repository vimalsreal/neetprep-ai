import { GoogleGenerativeAI } from "@google/generative-ai"

export class GeminiService {
  private genAI: GoogleGenerativeAI

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required")
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  }

  async extractTextFromPDF(base64Data: string): Promise<string> {
    try {
      console.log("🔍 Extracting text from PDF using Gemini...")
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

      const prompt = `Extract all educational content from this NCERT PDF. Focus on:
      1. Main concepts, definitions, and theories
      2. Important facts, figures, and data
      3. Formulas, equations, and laws
      4. Examples, case studies, and applications
      5. Key points and summaries
      6. Diagrams descriptions and explanations
      7. Important notes and highlights
      
      Provide clean, structured text that preserves the educational content and can be used for generating NEET-level MCQs.
      Maintain the logical flow and organization of the content.`

      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Data,
            mimeType: "application/pdf",
          },
        },
        prompt,
      ])

      const response = await result.response
      const extractedText = response.text()

      console.log(`✅ Successfully extracted ${extractedText.length} characters from PDF`)
      return extractedText
    } catch (error) {
      console.error("❌ Error extracting text from PDF:", error)
      throw new Error("Failed to extract text from PDF")
    }
  }

  async generateMCQsFromContent(
    content: string,
    subject: string,
    chapter: string,
    classLevel: string,
    difficulty: "easy" | "medium" | "hard",
    count = 60,
  ) {
    const difficultyInstructions = {
      easy: "Direct recall questions from NCERT text. Test basic facts, definitions, and simple concepts. Focus on remembering key terms and straightforward applications.",
      medium:
        "Application-based questions requiring understanding and analysis of concepts. Include diagram-based questions, cause-effect relationships, and moderate problem-solving.",
      hard: "Complex analytical questions requiring synthesis of multiple concepts. Include assertion-reasoning, case-study based questions, and advanced problem-solving that tests deep understanding.",
    }

    const prompt = `Generate exactly ${count} unique NEET-level multiple choice questions for ${subject} - ${chapter} (${classLevel}) at ${difficulty} difficulty.

NCERT Content:
${content.substring(0, 15000)} // Limit content to avoid token limits

Difficulty Level: ${difficulty}
Instructions: ${difficultyInstructions[difficulty]}

CRITICAL REQUIREMENTS:
- Generate EXACTLY ${count} questions, no more, no less
- Each question must be UNIQUE and not repeat concepts
- Each question must have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Include detailed explanations with NCERT references
- Cover different topics within the chapter
- Questions must be suitable for NEET examination
- Avoid repetitive question patterns
- Use proper scientific terminology
- Include numerical problems where applicable
- Reference specific NCERT chapter sections when possible

Format as valid JSON array:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact text of correct option",
    "explanation": "Detailed explanation with NCERT reference",
    "topic": "Specific topic within chapter"
  }
]

Generate exactly ${count} questions in this format. Ensure valid JSON structure.`

    try {
      console.log(`🧠 Generating ${count} ${difficulty} questions for ${subject} - ${chapter}`)

      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 8192,
        },
      })

      const result = await model.generateContent(prompt)
      const response = await result.response
      const responseText = response.text()

      // Clean and parse JSON response
      const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, "").trim()

      try {
        const questions = JSON.parse(cleanedResponse)

        if (!Array.isArray(questions)) {
          throw new Error("Response is not an array")
        }

        // Validate and ensure we have exactly the right number of questions
        const validQuestions = questions.slice(0, count).map((q: any, index: number) => ({
          question: q.question || `Sample question ${index + 1} for ${chapter}`,
          options:
            Array.isArray(q.options) && q.options.length === 4
              ? q.options
              : ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: q.correctAnswer || q.options?.[0] || "Option A",
          explanation: q.explanation || `This is a ${difficulty} level question about ${chapter}.`,
          topic: q.topic || chapter.replace(/-/g, " "),
        }))

        // Ensure we have exactly the requested count
        while (validQuestions.length < count) {
          validQuestions.push({
            question: `Additional ${difficulty} question ${validQuestions.length + 1} for ${chapter}`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: "Option A",
            explanation: `This is a ${difficulty} level question about ${chapter}.`,
            topic: chapter.replace(/-/g, " "),
          })
        }

        console.log(`✅ Generated ${validQuestions.length} ${difficulty} questions for ${chapter}`)
        return validQuestions.slice(0, count) // Ensure exact count
      } catch (parseError) {
        console.error("❌ JSON parsing error:", parseError)
        throw new Error("Failed to parse AI response")
      }
    } catch (error) {
      console.error("❌ Error generating MCQs from content:", error)
      throw new Error("Failed to generate questions from content")
    }
  }

  async analyzeTestPerformance(testResults: any) {
    const prompt = `Analyze this NEET test performance and provide personalized recommendations:

Test Results:
- Subject: ${testResults.subject}
- Chapter: ${testResults.chapter}
- Score: ${testResults.score}/${testResults.maxScore}
- Accuracy: ${testResults.accuracy}%
- Incorrect topics: ${testResults.incorrectTopics?.join(", ")}

Provide:
1. Strengths and weaknesses analysis
2. Specific NCERT chapters/pages to review
3. Study strategy for next 7 days
4. Motivational message for NEET aspirant
5. Practice recommendations

Keep response encouraging and actionable for Indian NEET students.`

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error("Error analyzing performance:", error)
      throw new Error("Failed to analyze performance")
    }
  }

  async chatWithMentor(message: string, context?: any) {
    const prompt = `You are an expert NEET mentor for Indian students. Respond to this query: "${message}"

Context: ${context ? JSON.stringify(context) : "General NEET preparation query"}

Guidelines:
- Be encouraging and motivational
- Provide specific, actionable advice
- Reference NCERT textbooks when relevant
- Use simple, clear language
- Include study tips and strategies
- Be empathetic to NEET preparation challenges
- Keep responses conversational and helpful

Respond as if you're chatting with a student who needs guidance and support.`

    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        },
      })

      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error("Error in AI chat:", error)
      throw new Error("Failed to get AI response")
    }
  }
}

export const geminiService = new GeminiService()
