"use client"

import { MinimalLayout } from "@/components/minimal-layout"
import { MinimalProjectGrid } from "@/components/minimal-project-grid"
import { MusicianPortfolio } from "@/components/musician-portfolio"
import { motion } from "framer-motion"

export default function MusicPage() {
  const featuredProjects = [
    {
      id: "1",
      title: "Symphony No. 1",
      subtitle: "Orchestral • 42:30",
      image: "/placeholder.svg?height=400&width=600&text=Symphony",
      type: "video" as const,
      color: "#667eea",
    },
    {
      id: "2",
      title: "Digital Soundscapes",
      subtitle: "Electronic • Experimental",
      image: "/placeholder.svg?height=400&width=600&text=Digital+Audio",
      type: "video" as const,
      color: "#764ba2",
    },
    {
      id: "3",
      title: "BEAM Collaborative Suite",
      subtitle: "Mixed Ensemble • Think Tank",
      image: "/placeholder.svg?height=400&width=600&text=BEAM+Project",
      type: "interactive" as const,
      color: "#f093fb",
    },
    {
      id: "4",
      title: "Chamber Quartet",
      subtitle: "String Quartet • Contemporary",
      image: "/placeholder.svg?height=400&width=600&text=Chamber+Music",
      type: "video" as const,
      color: "#4facfe",
    },
  ]

  return (
    <MinimalLayout title="music">
      {/* Featured Projects Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <MinimalProjectGrid projects={featuredProjects} />
      </motion.div>

      {/* Full Portfolio Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="border-t border-gray-800 pt-16"
      >
        <h2 className="text-sm font-light tracking-wide text-gray-400 mb-8 uppercase">Complete Portfolio</h2>
        <MusicianPortfolio />
      </motion.div>
    </MinimalLayout>
  )
}
