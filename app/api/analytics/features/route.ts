import { type NextRequest, NextResponse } from "next/server"
import { s3Service } from "@/lib/aws-s3"
import { supabase } from "@/lib/supabase"
import { geminiService } from "@/lib/gemini"
import { emailService } from "@/lib/resend"
// import { cashfreeService } from "@/lib/cashfree" // Assuming a Cashfree service exists

export async function GET() {
  const featureStatuses: Record<string, { status: "ok" | "error"; message?: string }> = {}

  // Check S3 status
  try {
    // Attempt to list a known bucket or perform a simple operation
    await s3Service.listPDFs() // Using an existing function that interacts with S3
    featureStatuses.s3 = { status: "ok" }
  } catch (error) {
    console.error("S3 health check failed:", error)
    featureStatuses.s3 = { status: "error", message: error instanceof Error ? error.message : "Unknown error" }
  }

  // Check Supabase status
  try {
    // Attempt a simple query
    const { error } = await supabase.from("users").select("id").limit(1)
    if (error) throw error
    featureStatuses.supabase = { status: "ok" }
  } catch (error) {
    console.error("Supabase health check failed:", error)
    featureStatuses.supabase = { status: "error", message: error instanceof Error ? error.message : "Unknown error" }
  }

  // Check Gemini status
  try {
    // Attempt a simple interaction (e.g., a basic prompt)
    await geminiService.chatWithMentor("Hello, are you there?", { userContext: null })
    featureStatuses.gemini = { status: "ok" }
  } catch (error) {
    console.error("Gemini health check failed:", error)
    featureStatuses.gemini = { status: "error", message: error instanceof Error ? error.message : "Unknown error" }
  }

  // Check Resend status
  try {
    // Attempt to send a test email (or use a health check method if available)
    // Note: Sending a real email might not be ideal for a health check. A dedicated health check endpoint from Resend would be better if available.
    // For now, we'll assume the service is OK if the client initializes without error.
    // A more robust check would involve a specific health check API call if Resend provides one.
    // As a placeholder, we'll just check if the emailService object exists.
    if (emailService) {
       featureStatuses.resend = { status: "ok" }
    } else {
       throw new Error("Resend email service not initialized")
    }
  } catch (error) {
    console.error("Resend health check failed:", error)
    featureStatuses.resend = { status: "error", message: error instanceof Error ? error.message : "Unknown error" }
  }

  // Check Cashfree status (assuming a cashfreeService with a health check method)
  // try {
  //   await cashfreeService.healthCheck()
  //   featureStatuses.cashfree = { status: "ok" }
  // } catch (error) {
  //   console.error("Cashfree health check failed:", error)
  //   featureStatuses.cashfree = { status: "error", message: error instanceof Error ? error.message : "Unknown error" }
  // }

  return NextResponse.json({
    success: true,
    statuses: featureStatuses,
  })
}
