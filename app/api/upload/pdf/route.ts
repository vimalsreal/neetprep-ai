import { type NextRequest, NextResponse } from "next/server"
import { s3Service } from "@/lib/aws-s3"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const subject = formData.get("subject") as string
    const classLevel = formData.get("classLevel") as string
    const chapter = formData.get("chapter") as string

    if (!file || !subject || !classLevel || !chapter) {
      console.error("[UPLOAD] Missing required fields", { file, subject, classLevel, chapter })
      return NextResponse.json(
        { error: "Missing required fields: file, subject, classLevel, chapter", details: { file, subject, classLevel, chapter } },
        { status: 400 },
      )
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      console.error("[UPLOAD] Invalid file type", { type: file.type })
      return NextResponse.json({ error: "Only PDF files are allowed", details: { type: file.type } }, { status: 400 })
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      console.error("[UPLOAD] File too large", { size: file.size })
      return NextResponse.json({ error: "File size must be less than 50MB", details: { size: file.size } }, { status: 400 })
    }

    // Convert file to buffer
    let buffer: Buffer
    try {
      buffer = Buffer.from(await file.arrayBuffer())
    } catch (err) {
      console.error("[UPLOAD] Failed to convert file to buffer", err)
      return NextResponse.json({ error: "Failed to process file", details: err instanceof Error ? err.message : err }, { status: 500 })
    }

    // Upload to S3
    try {
      await s3Service.uploadPDF(subject, classLevel, chapter, buffer)
    } catch (s3err) {
      console.error("[UPLOAD] S3 upload failed", s3err)
      return NextResponse.json({ error: "Failed to upload to S3", details: s3err instanceof Error ? s3err.message : s3err }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[UPLOAD] Unexpected error", error)
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : error }, { status: 500 })
  }
}
