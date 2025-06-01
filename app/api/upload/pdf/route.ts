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
      return NextResponse.json(
        { error: "Missing required fields: file, subject, classLevel, chapter" },
        { status: 400 },
      )
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 50MB" }, { status: 400 })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to S3
    const s3Url = await s3Service.uploadPDF(buffer, subject, classLevel, chapter)

    return NextResponse.json({
      success: true,
      message: "PDF uploaded successfully",
      url: s3Url,
      key: `ncert-pdfs/${subject}/${classLevel}/${chapter}.pdf`,
    })
  } catch (error) {
    console.error("Error uploading PDF:", error)
    return NextResponse.json(
      {
        error: "Failed to upload PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
