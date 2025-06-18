"use client"

import { MinimalLayout } from "@/components/minimal-layout"
import { MinimalProjectGrid } from "@/components/minimal-project-grid"
import { MusicianPortfolio } from "@/components/musician-portfolio"
import { motion } from "framer-motion"

export default function MusicPage() {
  const featuredProjects = [
    {
      id: "1",
      title: "Symphony No. V",
      subtitle: "Movement IV • 5:33",
      type: "video",
      role: "conductor",
      composer: "Ludwig van Beethoven",
      mediaUrl: "https://vybiefufnvfqvggaxcyy.supabase.co/storage/v1/object/public/media/AUCSO%20-%20CAU%20Board%20Meeting%20-Beethoven%205%20IV%20-%2002_21_20.MOV",
      color: "#667eea",
    },
    {
      id: "2",
      title: "Digital Soundscapes",
      subtitle: "Electronic • Experimental",
      type: "video",
      role: "composer",
      composer: "Ezra Haugabrooks",
      image: "/placeholder.svg?height=400&width=600&text=Digital+Audio",
      color: "#764ba2",
    },
    {
      id: "3",
      title: "BEAM Collaborative Suite",
      subtitle: "Mixed Ensemble • Think Tank",
      type: "interactive",
      role: "composer",
      composer: "Ezra Haugabrooks",
      image: "/placeholder.svg?height=400&width=600&text=BEAM+Project",
      color: "#f093fb",
    },
    {
      id: "4",
      title: "Chamber Quartet",
      subtitle: "String Quartet • Contemporary",
      type: "video",
      role: "composer",
      composer: "Ezra Haugabrooks",
      image: "/placeholder.svg?height=400&width=600&text=Chamber+Music",
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
