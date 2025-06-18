"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"

interface Project {
  id: string
  title: string
  subtitle?: string
  image: string
  type: "image" | "video" | "interactive"
  color?: string
}

interface MinimalProjectGridProps {
  projects: Project[]
}

export function MinimalProjectGrid({ projects }: MinimalProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="group cursor-pointer"
        >
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-900">
            {/* Background Image/Content */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${project.image})`,
                backgroundColor: project.color || "#1a1a1a",
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

            {/* Play Button for Videos */}
            {project.type === "video" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <Play className="w-4 h-4 text-white ml-0.5" />
              </motion.div>
            )}

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <motion.h3
                className="text-2xl font-light tracking-wide text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {project.title}
              </motion.h3>
              {project.subtitle && (
                <motion.p
                  className="text-sm text-white/70 mt-1 font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {project.subtitle}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
