"use client"

import { useEffect } from "react"
import { Project } from "./minimal-project-grid"

interface LightboxModalProps {
  project: Project
  onClose: () => void
}

export function LightboxModal({ project, onClose }: LightboxModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {project.type === "video" && project.mediaUrl ? (
          <video
            src={project.mediaUrl}
            controls
            autoPlay
            className="w-full h-auto rounded-lg shadow-lg"
          />
        ) : (
          <div className="text-white p-4">
            <p>No media available for this project.</p>
          </div>
        )}
      </div>
    </div>
  )
}
