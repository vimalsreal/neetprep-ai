// Application configuration
export const config = {
  // App info
  appName: "ExamGPT",
  appDescription: "AI-powered NEET preparation platform",
  appVersion: "1.0.0",

  // Contact info
  contactEmail: "hi@examgpt.site",

  // API endpoints
  apiEndpoints: {
    auth: {
      sendOtp: "/api/auth/send-otp",
      verifyOtp: "/api/auth/verify-otp",
    },
    payment: {
      createSession: "/api/payment/create-session",
      verify: "/api/payment/verify",
      webhook: "/api/payment/webhook",
    },
    questions: {
      generate: "/api/questions/generate",
      generateFromSupabase: "/api/questions/generate-from-supabase",
      get: "/api/questions/get",
      generateBatch: "/api/questions/generate-batch",
    },
    test: {
      submit: "/api/test/submit",
    },
    aiMentor: {
      chat: "/api/ai-mentor/chat",
    },
  },

  // Feature flags
  features: {
    aiMentor: true,
    performance: true,
    testGeneration: true,
    pdfUpload: false, // Disabled for students
  },

  // Pricing
  pricing: {
    subscription: 1000, // ₹1000
    currency: "INR",
  },

  // Question generation settings
  questions: {
    easyCount: 60,
    mediumCount: 60,
    hardCount: 60,
    totalPerChapter: 180,
  },
}
