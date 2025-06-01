import { type NextRequest, NextResponse } from "next/server"
import { s3Service } from "@/lib/aws-s3"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get("subject") || "biology"
    const chapter = searchParams.get("chapter") || "cell-division"

    console.log(`🧪 Testing S3 access for ${subject} - ${chapter}`)
    console.log(`AWS Region: ${process.env.AWS_REGION}`)
    console.log(`AWS Bucket: ${process.env.AWS_S3_BUCKET_NAME}`)
    console.log(`AWS Access Key ID: ${process.env.AWS_ACCESS_KEY_ID ? "Configured" : "Missing"}`)
    console.log(`AWS Secret Access Key: ${process.env.AWS_SECRET_ACCESS_KEY ? "Configured" : "Missing"}`)

    // First, test basic S3 connectivity without trying to get a specific file
    try {
      const s3Client = s3Service.getS3Client()
      console.log("S3 client created successfully")

      // List buckets to test basic connectivity
      const listBucketsCommand = await s3Client.listBuckets({})
      console.log(`S3 connection successful. Found ${listBucketsCommand.Buckets?.length || 0} buckets.`)
    } catch (connError) {
      console.error("❌ Basic S3 connectivity test failed:", connError)
      return NextResponse.json(
        {
          success: false,
          error: connError instanceof Error ? connError.message : "Unknown S3 connection error",
          errorType: connError instanceof Error ? connError.name : "Unknown",
          stage: "connection",
          details: "Failed to establish basic S3 connection. Check AWS credentials and permissions.",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    // Now try to get the specific PDF file
    try {
      // Test S3 connection and PDF access
      const pdfBuffer = await s3Service.getPDFBuffer(subject, chapter)

      return NextResponse.json({
        success: true,
        message: "S3 access successful",
        pdfSize: pdfBuffer.length,
        subject,
        chapter,
        timestamp: new Date().toISOString(),
      })
    } catch (fileError) {
      console.error("❌ S3 file access failed:", fileError)

      return NextResponse.json(
        {
          success: false,
          error: fileError instanceof Error ? fileError.message : "Unknown file access error",
          errorType: fileError instanceof Error ? fileError.name : "Unknown",
          stage: "file_access",
          details: `S3 connection worked but couldn't access the specific file: ncert-pdfs/${subject}/${chapter}.pdf`,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ S3 test failed with unexpected error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        errorType: error instanceof Error ? error.name : "Unknown",
        stage: "unexpected",
        details: "An unexpected error occurred during the S3 test",
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
