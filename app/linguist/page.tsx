
"use client"

import { useState, useEffect } from "react"
import { MinimalLayout } from "@/components/minimal-layout"
import { MinimalProjectGrid } from "@/components/minimal-project-grid"
import { portfolioHelpers, type LinguistProject } from "@/lib/supabase"
import type { Project } from "@/components/minimal-project-grid"

export default function LinguistPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await portfolioHelpers.getLinguistProjects(true) // Get featured projects only
        
        // Transform database data to match the Project interface
        const transformedProjects: Project[] = data.map((project: LinguistProject) => ({
          id: project.id,
          title: project.title,
          subtitle: project.subtitle || project.languages.join(" • "),
          image: project.image_url || "/placeholder.svg?height=400&width=600&text=" + encodeURIComponent(project.title),
          type: project.project_type === "application" ? "video" : project.project_type === "protocol" ? "interactive" : "image",
          color: getProjectColor(project.id),
        }))
        
        setProjects(transformedProjects)
      } catch (error) {
        console.error("Error fetching linguist projects:", error)
        // Fallback to static data if database fails
        setProjects([
          {
            id: "1",
            title: "Crypto Translation Protocol",
            subtitle: "Blockchain • Web3 • IPFS",
            image: "/placeholder.svg?height=400&width=600&text=Crypto+Translation",
            type: "interactive" as const,
            color: "#2d1b69",
          },
          {
            id: "2",
            title: "Philosophy Papers",
            subtitle: "Semantic Theory • Research",
            image: "/placeholder.svg?height=400&width=600&text=Philosophy+Research",
            type: "image" as const,
            color: "#11998e",
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
    const colors = ["#2d1b69", "#11998e", "#38ef7d", "#667eea", "#764ba2", "#f093fb"]
    const index = parseInt(id.slice(-1), 16) % colors.length
    return colors[index]
  }

  if (loading) {
    return (
      <MinimalLayout title="language">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white">Loading language projects...</div>
        </div>
      </MinimalLayout>
    )
  }

  const handleOpen = (project: Project) => {
    // Handle project opening logic here
    console.log("Opening project:", project)
  }

  return (
    <MinimalLayout title="language">
      <MinimalProjectGrid projects={projects} onOpen={handleOpen} />
    </MinimalLayout>
  )
}
