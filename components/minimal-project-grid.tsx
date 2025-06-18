"use client"

import { MusicProjectCard } from "./MusicProjectCard"

interface Project {
  id: string
  title: string
  subtitle?: string
  image?: string
  mediaUrl?: string
  type: "image" | "video" | "interactive"
  color?: string
  role?: "composer" | "performer" | "conductor"
  composer?: string
}

interface MinimalProjectGridProps {
  projects: Project[]
}

export function MinimalProjectGrid({ projects }: MinimalProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project, index) => (
        <MusicProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  )
}
