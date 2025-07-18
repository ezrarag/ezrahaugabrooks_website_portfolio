
"use client"

import { useState, useEffect } from "react"
import { MinimalLayout } from "@/components/minimal-layout"
import { MinimalProjectGrid } from "@/components/minimal-project-grid"
import { portfolioHelpers, type EducatorProject } from "@/lib/supabase"
import type { Project } from "@/components/minimal-project-grid"

export default function EducatorPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await portfolioHelpers.getEducatorProjects(true) // Get featured projects only
        
        // Transform database data to match the Project interface
        const transformedProjects: Project[] = data.map((project: EducatorProject) => ({
          id: project.id,
          title: project.title,
          subtitle: project.subtitle || `${project.student_count} students • ${project.rating}★`,
          image: project.image_url || "/placeholder.svg?height=400&width=600&text=" + encodeURIComponent(project.title),
          type: project.topics.includes("Research") ? "interactive" : "video",
          color: getProjectColor(project.id),
        }))
        
        setProjects(transformedProjects)
      } catch (error) {
        console.error("Error fetching educator projects:", error)
        // Fallback to static data if database fails
        setProjects([
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
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Helper function to generate consistent colors for projects
  function getProjectColor(id: string): string {
    const colors = ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#11998e", "#38ef7d"]
    const index = parseInt(id.slice(-1), 16) % colors.length
    return colors[index]
  }

  if (loading) {
    return (
      <MinimalLayout title="education">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white">Loading education projects...</div>
        </div>
      </MinimalLayout>
    )
  }

  const handleOpen = (project: Project) => {
    // Handle project opening logic here
    console.log("Opening project:", project)
  }

  return (
    <MinimalLayout title="education">
      <MinimalProjectGrid projects={projects} onOpen={handleOpen} />
    </MinimalLayout>
  )
}
