import { type NextRequest, NextResponse } from "next/server"
import { s3Service } from "@/lib/aws-s3"

export async function POST(request: NextRequest) {
  try {
    const { subject, classLevel, chapter } = await request.json()

    if (!subject || !classLevel || !chapter) {
      return NextResponse.json({ error: "Missing required fields: subject, classLevel, chapter" }, { status: 400 })
    }

    const uploadUrl = await s3Service.generateUploadUrl(subject, classLevel, chapter)

    return NextResponse.json({
      success: true,
      uploadUrl,
      key: `ncert-pdfs/${subject}/${classLevel}/${chapter}.pdf`,
    })
  } catch (error) {
    console.error("Error generating presigned URL:", error)
    return NextResponse.json(
      {
        error: "Failed to generate upload URL",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
