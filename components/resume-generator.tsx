"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, FileText, Download, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface ResumeGeneratorProps {
  onClose: () => void
}

interface AnalysisResult {
  filename: string
  analysis: any
  documentId: string
}

interface GeneratedCV {
  content: string
  preview: string
  summary?: string
}

export function ResumeGenerator({ onClose }: ResumeGeneratorProps) {
  const [step, setStep] = useState<"upload" | "analyze" | "generate" | "preview">("upload")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [purpose, setPurpose] = useState("")
  const [generatedCV, setGeneratedCV] = useState<GeneratedCV | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/plain",
      ]

      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        setError(null)
      } else {
        toast.error("Invalid file type", {
          description: "Please upload a PDF, DOCX, DOC, or TXT file",
        })
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "resume_analysis")

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Upload failed")
      }

      setAnalysisResult(result)
      setStep("analyze")

      toast.success("Resume uploaded successfully!", {
        description: "Your resume has been analyzed and structured",
      })
    } catch (error) {
      console.error("Upload error:", error)
      const errorMessage = error instanceof Error ? error.message : "Upload failed"
      setError(errorMessage)
      toast.error("Upload failed", {
        description: errorMessage,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleGenerate = async () => {
    if (!analysisResult || !purpose.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: analysisResult.documentId,
          purpose: purpose.trim(),
          analysisData: analysisResult.analysis,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Generation failed")
      }

      setGeneratedCV(result)
      setStep("preview")

      toast.success("CV generated successfully!", {
        description: "Your tailored CV is ready for preview and download",
      })
    } catch (error) {
      console.error("Generation error:", error)
      const errorMessage = error instanceof Error ? error.message : "Generation failed"
      setError(errorMessage)
      toast.error("Generation failed", {
        description: errorMessage,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedCV) return

    try {
      const response = await fetch("/api/download-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: generatedCV.content,
          filename: `cv-${purpose.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.html`,
        }),
      })

      if (!response.ok) throw new Error("Download failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `cv-${purpose.toLowerCase().replace(/\s+/g, "-")}.html`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("CV downloaded!", {
        description: "Your tailored CV has been saved to your downloads",
      })
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Download failed", {
        description: "Please try again or contact support",
      })
    }
  }

  const resetToUpload = () => {
    setStep("upload")
    setFile(null)
    setAnalysisResult(null)
    setPurpose("")
    setGeneratedCV(null)
    setError(null)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Smart CV Generator</h2>
              <p className="text-gray-600">Upload your resume and generate tailored CVs with AI</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-800 font-medium">Error</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              {[
                { key: "upload", label: "Upload", icon: Upload },
                { key: "analyze", label: "Analyze", icon: FileText },
                { key: "generate", label: "Generate", icon: CheckCircle },
                { key: "preview", label: "Preview", icon: Download },
              ].map((stepItem, index) => {
                const isActive = step === stepItem.key
                const isCompleted = ["upload", "analyze", "generate", "preview"].indexOf(step) > index
                const Icon = stepItem.icon

                return (
                  <div key={stepItem.key} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive
                          ? "bg-black text-white"
                          : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`ml-2 text-sm ${
                        isActive ? "text-black font-medium" : isCompleted ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {stepItem.label}
                    </span>
                    {index < 3 && <div className="w-8 h-px bg-gray-300 mx-4" />}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Upload Step */}
            {step === "upload" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
                  <p className="text-gray-600 mb-6">Upload your current resume in PDF, DOCX, DOC, or TXT format</p>
                </div>

                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-gray-500">PDF, DOCX, DOC, or TXT files up to 10MB</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {file && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-blue-500" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button onClick={handleUpload} disabled={isUploading}>
                          {isUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            "Upload & Analyze"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {/* Analysis Step */}
            {step === "analyze" && analysisResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Resume Analyzed Successfully!</h3>
                  <p className="text-gray-600">
                    Your resume has been parsed and structured. Now specify the purpose for your CV.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Summary</CardTitle>
                    <CardDescription>Key information extracted from your resume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Skills Identified</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.analysis.skills?.slice(0, 6).map((skill: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          )) || <p className="text-gray-500">No skills extracted</p>}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Experience Level</h4>
                        <p className="text-gray-700">{analysisResult.analysis.experienceLevel || "Not determined"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 mb-2 block">
                      What is the purpose of this CV? *
                    </span>
                    <Textarea
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="e.g., Frontend Engineer position at a tech startup, Artist residency application, Academic research position..."
                      className="min-h-[100px]"
                    />
                  </label>
                  <p className="text-sm text-gray-500">
                    Be specific about the role, industry, or opportunity you're targeting. This helps the AI tailor your
                    CV accordingly.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={!purpose.trim() || isGenerating}
                    className="flex-1"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating CV...
                      </>
                    ) : (
                      "Generate Tailored CV"
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetToUpload}>
                    Start Over
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Preview Step */}
            {step === "preview" && generatedCV && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">CV Generated Successfully!</h3>
                  <p className="text-gray-600">
                    Your tailored CV is ready. Preview it below and download when satisfied.
                  </p>
                  {generatedCV.summary && <p className="text-sm text-gray-500 mt-2 italic">{generatedCV.summary}</p>}
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={handleDownload} size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Download HTML
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep("analyze")
                      setPurpose("")
                      setGeneratedCV(null)
                    }}
                  >
                    Generate Another
                  </Button>
                  <Button variant="outline" onClick={resetToUpload}>
                    Upload New Resume
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>CV Preview</CardTitle>
                    <CardDescription>Tailored for: {purpose}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-6 rounded-lg max-h-96 overflow-y-auto">
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: generatedCV.preview }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
