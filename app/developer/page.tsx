
"use client"

import { useState, useEffect } from "react"
import { MinimalLayout } from "@/components/minimal-layout"
import { MinimalProjectGrid } from "@/components/minimal-project-grid"
import { portfolioHelpers, type DeveloperProject } from "@/lib/supabase"
import type { Project } from "@/components/minimal-project-grid"

export default function DeveloperPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await portfolioHelpers.getDeveloperProjects(true) // Get featured projects only
        
        // Transform database data to match the Project interface
        const transformedProjects: Project[] = data.map((project: DeveloperProject) => ({
          id: project.id,
          title: project.title,
          subtitle: project.subtitle || project.technologies.join(" • "),
          image: project.image_url || "/placeholder.svg?height=400&width=600&text=" + encodeURIComponent(project.title),
          type: "image" as const,
          color: getProjectColor(project.id),
        }))
        
        setProjects(transformedProjects)
      } catch (error) {
        console.error("Error fetching developer projects:", error)
        // Fallback to static data if database fails
        setProjects([
          {
            id: "1",
            title: "E-commerce Platform",
            subtitle: "Next.js • TypeScript • Stripe",
            image: "/placeholder.svg?height=400&width=600&text=E-commerce+Platform",
            type: "image" as const,
            color: "#1a1a2e",
          },
          {
            id: "2",
            title: "Real-time Dashboard",
            subtitle: "React • WebSocket • D3.js",
            image: "/placeholder.svg?height=400&width=600&text=Analytics+Dashboard",
            type: "interactive" as const,
            color: "#16213e",
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
    const colors = ["#1a1a2e", "#16213e", "#0f3460", "#533483", "#2d1b69", "#11998e"]
    const index = parseInt(id.slice(-1), 16) % colors.length
    return colors[index]
  }

  if (loading) {
    return (
      <MinimalLayout title="work">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white">Loading projects...</div>
        </div>
      </MinimalLayout>
    )
  }

  const handleOpen = (project: Project) => {
    // Handle project opening logic here
    console.log("Opening project:", project)
  }

  return (
    <MinimalLayout title="work">
      <MinimalProjectGrid projects={projects} onOpen={handleOpen} />
    </MinimalLayout>
  )
}
