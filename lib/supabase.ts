import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  name: string
  dob: string
  class: string
  phone: string
  city: string
  created_at: string
  updated_at: string
}

export interface TestResult {
  id: string
  user_id: string
  subject: string
  chapter: string
  difficulty: string
  score: number
  max_score: number
  accuracy: number
  time_taken: number
  questions_data: any
  created_at: string
}

export interface Question {
  id: string
  subject: string
  chapter: string
  difficulty: "easy" | "medium" | "hard"
  question: string
  options: string[]
  correct_answer: string
  explanation: string
  topic: string
  created_at: string
}
