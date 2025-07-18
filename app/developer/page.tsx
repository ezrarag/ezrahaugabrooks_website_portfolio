
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
          image: project.live_url 
            ? `https://api.screenshotone.com/take?url=${encodeURIComponent(project.live_url)}&viewport_width=1200&viewport_height=800&device_scale_factor=1&format=png&block_ads=true&delay=3`
            : project.image_url || "/placeholder.svg?height=400&width=600&text=" + encodeURIComponent(project.title),
          mediaUrl: project.live_url, // Add live URL for iframe
          type: project.live_url ? "interactive" as const : "image" as const,
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
    // Open live URL in new tab if available, otherwise show lightbox
    if (project.type === "interactive" && project.mediaUrl) {
      window.open(project.mediaUrl, '_blank')
    } else {
      // Handle other project types (could open a lightbox)
      console.log("Opening project:", project)
    }
  }

  return (
    <MinimalLayout title="work">
      <MinimalProjectGrid projects={projects} onOpen={handleOpen} />
    </MinimalLayout>
  )
}
