import { type NextRequest, NextResponse } from "next/server"
import { s3Service } from "@/lib/aws-s3"

export async function GET(request: NextRequest) {
  try {
    const pdfs = await s3Service.listPDFs()

    // Organize PDFs by subject and class
    const organized = pdfs.reduce((acc, pdf) => {
      const pathParts = pdf.key.split("/")
      if (pathParts.length >= 4 && pathParts[0] === "ncert-pdfs") {
        const [, subject, classLevel, filename] = pathParts
        const chapter = filename.replace(".pdf", "")

        if (!acc[subject]) acc[subject] = {}
        if (!acc[subject][classLevel]) acc[subject][classLevel] = []

        acc[subject][classLevel].push({
          chapter,
          filename,
          size: pdf.size,
          lastModified: pdf.lastModified,
          key: pdf.key,
        })
      }
      return acc
    }, {} as any)

    return NextResponse.json({
      success: true,
      pdfs: organized,
      total: pdfs.length,
    })
  } catch (error) {
    console.error("Error listing PDFs:", error)
    return NextResponse.json(
      {
        error: "Failed to list PDFs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
