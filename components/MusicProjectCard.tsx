"use client"

import { Play } from "lucide-react"
import { motion } from "framer-motion"
import clsx from "clsx"

interface MusicProject {
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

interface Props {
  project: MusicProject
  index: number
}

export function MusicProjectCard({ project, index }: Props) {
  const {
    title,
    subtitle,
    type,
    mediaUrl,
    image,
    color = "#1a1a1a",
    role,
    composer,
  } = project

  const isVideo = type === "video" && mediaUrl?.endsWith(".mp4" || ".mov")
  const isAudio = type === "video" && mediaUrl?.endsWith(".mp3")

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-900">
        {/* Media */}
        {mediaUrl ? (
          isVideo ? (
            <video
              src={mediaUrl}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              loop
              playsInline
            />
          ) : isAudio ? (
            <div className="flex items-center justify-center h-full bg-black/80 text-white text-sm px-4 text-center">
              Audio only: press play to listen.
              <audio controls src={mediaUrl} className="mt-2 w-full" />
            </div>
          ) : null
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${image})`,
              backgroundColor: color,
            }}
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

        {/* Play Button */}
        {type === "video" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <Play className="w-4 h-4 text-white ml-0.5" />
          </motion.div>
        )}

        {/* Title & Role Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.h3
            className="text-2xl font-light tracking-wide text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            {title}
          </motion.h3>

          {subtitle && (
            <motion.p
              className="text-sm text-white/70 mt-1 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              {subtitle}
            </motion.p>
          )}

          {(role || composer) && (
            <div className="text-xs text-white/50 mt-2">
              {role && <span className="uppercase">{role}</span>}
              {composer && composer !== "Ezra Haugabrooks" && (
                <span className="ml-2 italic">by {composer}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
