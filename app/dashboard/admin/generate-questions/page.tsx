"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { subjectsData } from "@/lib/subjects-data"
import { useToast } from "@/hooks/use-toast"

export default function GenerateQuestionsPage() {
  const [subject, setSubject] = useState<string>("")
  const [classLevel, setClassLevel] = useState<string>("")
  const [batchSize, setBatchSize] = useState<number>(5)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [results, setResults] = useState<any>(null)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!subject || !classLevel) {
      toast({
        title: "Missing fields",
        description: "Please select both subject and class level",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setResults(null)

    try {
      const response = await fetch("/api/questions/generate-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          classLevel,
          batchSize,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate questions")
      }

      setResults(data)
      toast({
        title: "Generation completed",
        description: `Processed ${data.processed} chapters successfully`,
      })
    } catch (error) {
      console.error("Error generating questions:", error)
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Generate NEET Questions</h1>
      <p className="text-gray-600 mb-8">
        This tool generates MCQs for NEET preparation. It will create 60 easy, 60 medium, and 60 hard questions for each
        chapter.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Question Generation Settings</CardTitle>
            <CardDescription>
              Select the subject and class level for which you want to generate questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(subjectsData).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Class Level</Label>
              <Select value={classLevel} onValueChange={setClassLevel}>
                <SelectTrigger id="class">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class11">Class 11</SelectItem>
                  <SelectItem value="class12">Class 12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batchSize">Batch Size (chapters)</Label>
              <Input
                id="batchSize"
                type="number"
                min={1}
                max={10}
                value={batchSize}
                onChange={(e) => setBatchSize(Number.parseInt(e.target.value) || 5)}
              />
              <p className="text-xs text-gray-500">
                Number of chapters to process in one batch (1-10). Higher values take longer.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Questions...
                </>
              ) : (
                "Generate Questions"
              )}
            </Button>
          </CardFooter>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Generation Results</CardTitle>
              <CardDescription>
                Processed {results.processed} chapters for {subject} - {classLevel}
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {results.results.map((result: any, index: number) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{result.chapterName}</h3>
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {result.success ? `Generated ${result.questionsGenerated} questions` : `Failed: ${result.error}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Source: {result.contentSource}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
