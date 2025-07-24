"use client"

import { MusicProjectCard } from "./MusicProjectCard"

export interface Project {
  id: string
  title: string
  subtitle?: string
  image?: string
  mediaUrl?: string
  type: "image" | "video" | "interactive"
  color?: string
  role?: "composer" | "performer" | "conductor" | "pianist"
  composer?: string
  date?: string
  location?: string
  event?: string
}

interface MinimalProjectGridProps {
  projects: Project[]
  onOpen: (project: Project) => void
}

export function MinimalProjectGrid({ projects, onOpen }: MinimalProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project, index) => (
        <div
          key={project.id}
          onClick={() => onOpen(project)}
          className="cursor-pointer"
        >
          <MusicProjectCard project={project} index={index} />
        </div>
      ))}
    </div>
  )
}
