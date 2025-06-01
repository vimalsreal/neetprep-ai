"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, CheckCircle, XCircle, FileText, Loader2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { subjectsData } from "@/lib/subjects-data"

interface UploadStatus {
  file: string
  status: "pending" | "uploading" | "success" | "error"
  progress: number
  message?: string
}

export default function UploadPDFsPage() {
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedChapter, setSelectedChapter] = useState("")
  const [uploads, setUploads] = useState<UploadStatus[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newUploads: UploadStatus[] = Array.from(files).map((file) => ({
      file: file.name,
      status: "pending" as const,
      progress: 0,
    }))

    setUploads(newUploads)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      try {
        // Update status to uploading
        setUploads((prev) =>
          prev.map((upload, index) => (index === i ? { ...upload, status: "uploading", progress: 0 } : upload)),
        )

        // Create form data
        const formData = new FormData()
        formData.append("file", file)
        formData.append("subject", selectedSubject)
        formData.append("classLevel", selectedClass)

        // Extract chapter from filename or use selected chapter
        const chapterName = selectedChapter || file.name.replace(".pdf", "").toLowerCase().replace(/\s+/g, "-")
        formData.append("chapter", chapterName)

        // Upload file
        const response = await fetch("/api/upload/pdf", {
          method: "POST",
          body: formData,
        })

        const result = await response.json()

        if (result.success) {
          setUploads((prev) =>
            prev.map((upload, index) =>
              index === i
                ? {
                    ...upload,
                    status: "success",
                    progress: 100,
                    message: "Upload successful",
                  }
                : upload,
            ),
          )
        } else {
          throw new Error(result.error || "Upload failed")
        }
      } catch (error) {
        setUploads((prev) =>
          prev.map((upload, index) =>
            index === i
              ? {
                  ...upload,
                  status: "error",
                  progress: 0,
                  message: error instanceof Error ? error.message : "Upload failed",
                }
              : upload,
          ),
        )
      }
    }

    setIsUploading(false)
  }

  const getStatusIcon = (status: UploadStatus["status"]) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: UploadStatus["status"]) => {
    switch (status) {
      case "uploading":
        return (
          <Badge variant="outline" className="bg-blue-50">
            Uploading
          </Badge>
        )
      case "success":
        return (
          <Badge variant="outline" className="bg-green-50">
            Success
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50">
            Error
          </Badge>
        )
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const availableChapters =
    selectedSubject && selectedClass
      ? subjectsData[selectedSubject as keyof typeof subjectsData]?.[
          selectedClass as keyof (typeof subjectsData)[keyof typeof subjectsData]
        ]?.chapters || []
      : []

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <div className="flex-1 pb-20 md:pb-0">
        <DashboardHeader />

        <main className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Upload NCERT PDFs</h1>
            <p className="text-gray-600 mt-1">Upload PDF files to AWS S3 for AI question generation</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Class</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class11">Class 11</SelectItem>
                      <SelectItem value="class12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Chapter (Optional)</label>
                  <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Auto-detect from filename" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableChapters.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">PDF Files</label>
                  <input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    disabled={!selectedSubject || !selectedClass || isUploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select multiple PDF files (max 50MB each). Files will be uploaded to:
                    <code className="bg-gray-100 px-1 rounded">
                      ncert-pdfs/{selectedSubject || "[subject]"}/{selectedClass || "[class]"}/[chapter].pdf
                    </code>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Upload Status */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Status</CardTitle>
              </CardHeader>
              <CardContent>
                {uploads.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No uploads yet</p>
                ) : (
                  <div className="space-y-3">
                    {uploads.map((upload, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(upload.status)}
                            <span className="text-sm font-medium truncate">{upload.file}</span>
                          </div>
                          {getStatusBadge(upload.status)}
                        </div>

                        {upload.status === "uploading" && <Progress value={upload.progress} className="mb-2" />}

                        {upload.message && (
                          <p className={`text-xs ${upload.status === "error" ? "text-red-600" : "text-gray-600"}`}>
                            {upload.message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Upload Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <div>
                <h3 className="font-medium mb-2">File Organization:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Files are organized as: <code>ncert-pdfs/[subject]/[class]/[chapter].pdf</code>
                  </li>
                  <li>Subject: physics, chemistry, biology</li>
                  <li>Class: class11, class12</li>
                  <li>Chapter: Auto-detected from filename or manually selected</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">File Requirements:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Only PDF files are accepted</li>
                  <li>Maximum file size: 50MB per file</li>
                  <li>Files should be searchable PDFs (not scanned images)</li>
                  <li>Recommended naming: chapter-1-physical-world.pdf</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">After Upload:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>PDFs will be available for AI question generation</li>
                  <li>Use the "Bulk Generate Questions" feature to create MCQs</li>
                  <li>Generated questions will be stored in the database</li>
                  <li>Students can then take tests based on these questions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}
