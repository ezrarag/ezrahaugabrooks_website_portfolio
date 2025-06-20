// FileUploader.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface FileUploaderProps {
  category: string
  onClose: () => void
}

export function FileUploader({ category, onClose }: FileUploaderProps) {
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files)
  }

  const handleUpload = async () => {
    if (!files || files.length === 0) return
    setUploading(true)

    // Simulate upload
    await new Promise((res) => setTimeout(res, 2000))
    setUploading(false)
    setSuccess(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-zinc-900 text-white rounded-xl shadow-2xl w-full max-w-md p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:opacity-70"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold mb-4">
          Upload to {category.charAt(0).toUpperCase() + category.slice(1)}
        </h2>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        <button
          onClick={handleUpload}
          disabled={uploading || !files}
          className="bg-white text-black rounded px-4 py-2 w-full disabled:opacity-50"
        >
          {uploading ? "Uploading..." : success ? "Success!" : "Upload Files"}
        </button>
      </motion.div>
    </div>
  )
}


// --- SlugPage.tsx or SlugLayout.tsx ---

import Link from "next/link"

interface Section {
  title: string
  content: React.ReactNode
}

interface SlugPageProps {
  title: string
  sections: Section[]
}

export function SlugPage({ title, sections }: SlugPageProps) {
  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto">
      <header className="sticky top-0 z-20 bg-black/50 backdrop-blur-lg border-b border-white/10 p-6">
        <h1 className="text-2xl font-semibold tracking-wide">{title}</h1>
      </header>

      <main className="space-y-12 p-6">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {section.content}
            </div>
          </section>
        ))}

        {/* Upload area */}
        <div className="border-t border-white/10 pt-10">
          <h2 className="text-lg font-semibold mb-4">Upload Your Work</h2>
          {/* Mount FileUploader here when triggered */}
        </div>
      </main>
    </div>
  )
}
