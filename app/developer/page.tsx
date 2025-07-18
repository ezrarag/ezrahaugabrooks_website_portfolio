
"use client"

import { useState, useEffect } from "react"
import { MinimalLayout } from "@/components/minimal-layout"
import { portfolioHelpers, type DeveloperProject } from "@/lib/supabase"
import { motion } from "framer-motion"
import { ExternalLink, Github, Play } from "lucide-react"

export default function DeveloperPage() {
  const [projects, setProjects] = useState<DeveloperProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await portfolioHelpers.getDeveloperProjects(true) // Get featured projects only
        setProjects(data)
      } catch (error) {
        console.error("Error fetching developer projects:", error)
        // Fallback to static data if database fails
        setProjects([
          {
            id: "1",
            title: "E-commerce Platform",
            subtitle: "Next.js • TypeScript • Stripe",
            description: "Full-stack e-commerce solution with payment processing",
            technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
            image_url: "/placeholder.svg?height=400&width=600&text=E-commerce+Platform",
            featured: true,
            sort_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Real-time Dashboard",
            subtitle: "React • WebSocket • D3.js",
            description: "Interactive analytics dashboard with real-time data visualization",
            technologies: ["React", "WebSocket", "D3.js", "Node.js"],
            image_url: "/placeholder.svg?height=400&width=600&text=Analytics+Dashboard",
            featured: true,
            sort_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
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

  // Helper function to check if URL is a video
  function isVideoUrl(url: string): boolean {
    return /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url) || 
           url.includes('youtube.com') || 
           url.includes('youtu.be') || 
           url.includes('vimeo.com')
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

  return (
    <MinimalLayout title="work">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300"
            style={{ backgroundColor: getProjectColor(project.id) + "20" }}
          >
            {/* Project Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={project.image_url || "/placeholder.svg?height=400&width=600&text=" + encodeURIComponent(project.title)}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Project Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
              <p className="text-gray-300 text-sm mb-3">{project.subtitle}</p>
              
              {project.description && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
              )}

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 4).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-800/60 text-gray-300 text-xs rounded-full"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="px-2 py-1 bg-gray-800/60 text-gray-300 text-xs rounded-full">
                    +{project.technologies.length - 4} more
                  </span>
                )}
              </div>

              {/* Video Player */}
              {project.live_url && isVideoUrl(project.live_url) && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Demo Video</span>
                  </div>
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <video
                      src={project.live_url}
                      controls
                      className="absolute inset-0 w-full h-full rounded-lg"
                      style={{ objectFit: 'cover' }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                {project.live_url && !isVideoUrl(project.live_url) && (
                  <button
                    onClick={() => window.open(project.live_url, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </button>
                )}
                
                {project.github_url && (
                  <button
                    onClick={() => window.open(project.github_url, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    Code
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </MinimalLayout>
  )
}
