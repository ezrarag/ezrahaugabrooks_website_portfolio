"use client"

import { motion } from "framer-motion"
import { DarkLayout } from "@/components/dark-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Download } from "lucide-react"
import { MusicianPortfolio } from "@/components/musician-portfolio"
import { ResumeGenerator } from "@/components/resume-generator"

export default function MusicPage() {
  const compositions = [
    {
      title: "Symphony No. 1 in D Minor",
      description: "A four-movement orchestral work exploring themes of transformation and renewal",
      duration: "42:30",
      instrumentation: "Full Orchestra",
      image: "/placeholder.svg?height=300&width=400",
      audioUrl: "#",
      scoreUrl: "#",
      year: "2023",
      category: "Classical",
    },
    {
      title: "Digital Soundscapes",
      description: "Electronic composition blending organic and synthetic textures",
      duration: "28:15",
      instrumentation: "Electronic/Digital",
      image: "/placeholder.svg?height=300&width=400",
      audioUrl: "#",
      scoreUrl: "#",
      year: "2024",
      category: "Electronic",
    },
    {
      title: "Chamber Quartet in A",
      description: "Intimate piece for string quartet with contemporary harmonies",
      duration: "18:45",
      instrumentation: "String Quartet",
      image: "/placeholder.svg?height=300&width=400",
      audioUrl: "#",
      scoreUrl: "#",
      year: "2023",
      category: "Chamber Music",
    },
  ]

  return (
    <DarkLayout
      title="MUSIC"
      description="Creating original compositions that bridge classical traditions with contemporary innovation and collaborative exploration."
    >
      {/* Resume Generator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <ResumeGenerator />
      </motion.div>

      {/* Musician Portfolio */}
      <MusicianPortfolio />

      {/* Compositions Section */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-8"
        >
          Featured Compositions
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {compositions.map((piece, index) => (
            <motion.div
              key={piece.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card className="bg-gray-900 border-gray-800 overflow-hidden h-full">
                <div className="aspect-video bg-gray-800 relative">
                  <img
                    src={piece.image || "/placeholder.svg"}
                    alt={piece.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-white text-black">{piece.category}</Badge>
                  <Badge className="absolute top-4 right-4 bg-gray-900/80 text-white">{piece.year}</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-white">{piece.title}</CardTitle>
                  <CardDescription className="text-gray-400">{piece.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white ml-2">{piece.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Instrumentation:</span>
                      <span className="text-white ml-2">{piece.instrumentation}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button size="sm" className="bg-white text-black hover:bg-gray-200 flex-1" asChild>
                      <a href={piece.audioUrl} target="_blank" rel="noopener noreferrer">
                        <Play className="w-4 h-4 mr-1" />
                        Listen
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      asChild
                    >
                      <a href={piece.scoreUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-1" />
                        Score
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </DarkLayout>
  )
}
