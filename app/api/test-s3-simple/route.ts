import { type NextRequest, NextResponse } from "next/server"
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3"

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Testing basic S3 connectivity")
    console.log(`AWS Region: ${process.env.AWS_REGION}`)
    console.log(`AWS Access Key ID: ${process.env.AWS_ACCESS_KEY_ID ? "Configured" : "Missing"}`)
    console.log(`AWS Secret Access Key: ${process.env.AWS_SECRET_ACCESS_KEY ? "Configured" : "Missing"}`)

    // Create a simple S3 client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    })

    // Try a simple operation - list buckets
    const command = new ListBucketsCommand({})
    const response = await s3Client.send(command)

    return NextResponse.json({
      success: true,
      message: "S3 connection successful",
      buckets: response.Buckets?.map((bucket) => bucket.Name) || [],
      owner: response.Owner?.DisplayName || "Unknown",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ S3 simple test failed:", error)

    // Extract detailed error information
    let errorDetails = "Unknown error"
    let errorName = "Unknown"
    let errorStack = undefined

    if (error instanceof Error) {
      errorDetails = error.message
      errorName = error.name
      errorStack = error.stack
    }

    return NextResponse.json(
      {
        success: false,
        error: errorDetails,
        errorType: errorName,
        stack: errorStack,
        awsRegion: process.env.AWS_REGION || "not set",
        hasAccessKeyId: !!process.env.AWS_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
