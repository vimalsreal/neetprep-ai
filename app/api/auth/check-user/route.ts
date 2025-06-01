import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }
    const { data, error } = await supabase.from("users").select("id").eq("email", email).single()
    if (error && error.code !== "PGRST116") {
      // PGRST116: No rows found
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ exists: !!data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
