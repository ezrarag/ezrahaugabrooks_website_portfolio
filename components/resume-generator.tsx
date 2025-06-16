"use client"

import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Download, Music, GraduationCap, Film, Settings } from "lucide-react"

export function ResumeGenerator() {
  const handleGenerateCV = async (type: string) => {
    console.log(`Generating ${type} CV...`)

    // This would call your backend API
    try {
      const response = await fetch(`/api/generate-cv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          includeOnlyCV: true, // Filter for works with cvInclude: true
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `ezra-haugabrooks-${type.toLowerCase().replace(/\s+/g, "-")}-cv.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error generating CV:", error)
      alert("CV generation will be implemented with backend integration")
    }
  }

  const cvTypes = [
    {
      type: "Full Artistic CV",
      description: "Complete portfolio including all musical works",
      icon: <Music className="w-4 h-4" />,
      tags: ["all"],
    },
    {
      type: "Teaching CV (Orchestra)",
      description: "Focus on orchestral and educational works",
      icon: <GraduationCap className="w-4 h-4" />,
      tags: ["orchestra", "choral", "educational"],
    },
    {
      type: "Film Composer CV",
      description: "Emphasis on film scores and commissioned works",
      icon: <Film className="w-4 h-4" />,
      tags: ["film", "commissioned", "score"],
    },
    {
      type: "Custom",
      description: "Select specific tags and criteria",
      icon: <Settings className="w-4 h-4" />,
      tags: ["custom"],
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900 border border-gray-800 rounded-lg p-6"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Resume Generator</h3>
          <p className="text-gray-400">Generate tailored CVs from your musical portfolio</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-white text-black hover:bg-gray-200">
                <Download className="w-4 h-4 mr-2" />
                Generate CV
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-gray-800 border-gray-700">
            {cvTypes.map((cv, index) => (
              <DropdownMenuItem
                key={cv.type}
                onClick={() => handleGenerateCV(cv.type)}
                className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{cv.icon}</div>
                  <div>
                    <div className="font-medium">{cv.type}</div>
                    <div className="text-sm text-gray-400 mt-1">{cv.description}</div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-white">6</div>
          <div className="text-sm text-gray-400">Total Works</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">4</div>
          <div className="text-sm text-gray-400">Featured</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">5</div>
          <div className="text-sm text-gray-400">CV Ready</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">3</div>
          <div className="text-sm text-gray-400">Collaborations</div>
        </div>
      </motion.div>
    </motion.div>
  )
}
