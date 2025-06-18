"use client"

import { MinimalLayout } from "@/components/minimal-layout"
import { MinimalProjectGrid } from "@/components/minimal-project-grid"

export default function EducatorPage() {
  const projects = [
    {
      id: "1",
      title: "Advanced Web Development",
      subtitle: "1,250 students • 4.8★",
      image: "/placeholder.svg?height=400&width=600&text=Web+Development+Course",
      type: "video" as const,
      color: "#667eea",
    },
    {
      id: "2",
      title: "Computational Linguistics",
      subtitle: "University Extension • NLP",
      image: "/placeholder.svg?height=400&width=600&text=Linguistics+Course",
      type: "interactive" as const,
      color: "#764ba2",
    },
    {
      id: "3",
      title: "Music Technology Workshop",
      subtitle: "Creative Institute • DAW",
      image: "/placeholder.svg?height=400&width=600&text=Music+Tech",
      type: "video" as const,
      color: "#f093fb",
    },
    {
      id: "4",
      title: "BEAM Think Tank",
      subtitle: "Research • Collaboration",
      image: "/placeholder.svg?height=400&width=600&text=Think+Tank",
      type: "interactive" as const,
      color: "#4facfe",
    },
  ]

  return (
    <MinimalLayout title="education">
      <MinimalProjectGrid projects={projects} />
    </MinimalLayout>
  )
}
