import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export class S3Service {
  private s3Client: S3Client
  private bucketName: string

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET_NAME!

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
  }

  // Upload PDF to S3
  async uploadPDF(file: Buffer, subject: string, classLevel: string, chapter: string): Promise<string> {
    const key = `ncert-pdfs/${subject}/${classLevel}/${chapter}.pdf`

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: "application/pdf",
        Metadata: {
          subject,
          classLevel,
          chapter,
          uploadedAt: new Date().toISOString(),
        },
      })

      await this.s3Client.send(command)
      console.log(`✅ Successfully uploaded PDF: ${key}`)

      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    } catch (error) {
      console.error(`❌ Error uploading PDF: ${key}`, error)
      throw new Error(`Failed to upload PDF: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Get PDF buffer from S3
  async getPDFBuffer(subject: string, classLevel: string, chapter: string): Promise<Buffer> {
    const key = `ncert-pdfs/${subject}/${classLevel}/${chapter}.pdf`

    try {
      console.log(`📄 Fetching PDF from S3: ${key}`)

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })

      const response = await this.s3Client.send(command)

      if (!response.Body) {
        throw new Error("No body in S3 response")
      }

      const buffer = Buffer.from(await response.Body.transformToByteArray())
      console.log(`✅ Successfully fetched PDF: ${key} (${buffer.length} bytes)`)

      return buffer
    } catch (error) {
      console.error(`❌ Error fetching PDF from S3: ${key}`, error)
      throw new Error(`Failed to fetch PDF: ${error instanceof Error ? error.message : "Unknown S3 error"}`)
    }
  }

  // Generate presigned URL for PDF upload
  async generateUploadUrl(subject: string, classLevel: string, chapter: string): Promise<string> {
    const key = `ncert-pdfs/${subject}/${classLevel}/${chapter}.pdf`

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: "application/pdf",
      })

      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }) // 1 hour
      return signedUrl
    } catch (error) {
      console.error("Error generating upload URL:", error)
      throw new Error("Failed to generate upload URL")
    }
  }

  // List all PDFs in the bucket
  async listPDFs(): Promise<Array<{ key: string; size: number; lastModified: Date }>> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: "ncert-pdfs/",
      })

      const response = await this.s3Client.send(command)

      return (response.Contents || []).map((obj) => ({
        key: obj.Key || "",
        size: obj.Size || 0,
        lastModified: obj.LastModified || new Date(),
      }))
    } catch (error) {
      console.error("Error listing PDFs:", error)
      throw new Error("Failed to list PDFs")
    }
  }

  // Check if PDF exists
  async pdfExists(subject: string, classLevel: string, chapter: string): Promise<boolean> {
    const key = `ncert-pdfs/${subject}/${classLevel}/${chapter}.pdf`

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })

      await this.s3Client.send(command)
      return true
    } catch (error) {
      return false
    }
  }

  // Get S3 client for testing
  getS3Client(): S3Client {
    return this.s3Client
  }

  // Parse PDF content using base64 for Gemini
  async getPDFBase64(subject: string, classLevel: string, chapter: string): Promise<string> {
    const buffer = await this.getPDFBuffer(subject, classLevel, chapter)
    return buffer.toString("base64")
  }
}

export const s3Service = new S3Service()
