"use client"

import { useState, useEffect } from "react"
import { MinimalLayout } from "@/components/minimal-layout"
import { MinimalProjectGrid } from "@/components/minimal-project-grid"
import { LightboxModal } from "@/components/LightBoxModal"
import { motion } from "framer-motion"
import type { Project } from "@/components/minimal-project-grid"
import { FileUploader } from "@/components/FileUploader"
import { portfolioHelpers, type MusicProject } from "@/lib/supabase"

export default function MusicPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showUploader, setShowUploader] = useState(false)
  const [activeRole, setActiveRole] = useState<string | null>(null)
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const roles = [
    "Compose", "Mix/Master", "Track a Project",
    "Conduct", "Sing", "Accompany (Piano)", "Section Viola"
  ]

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await portfolioHelpers.getMusicProjects(true) // Get featured projects only
        
        // Transform database data to match the Project interface
        const transformedProjects: Project[] = data.map((project: MusicProject) => ({
          id: project.id,
          title: project.title,
          subtitle: project.subtitle || project.duration,
          type: project.media_type === "video" ? "video" : project.media_type === "audio" ? "interactive" : "video",
          role: project.role as any,
          composer: project.composer,
          date: project.date,
          location: project.location,
          event: project.event,
          mediaUrl: project.media_url,
          color: getProjectColor(project.id),
        }))
        
        setFeaturedProjects(transformedProjects.reverse()) // Reverse to match original order
      } catch (error) {
        console.error("Error fetching music projects:", error)
        // Fallback to static data if database fails
        setFeaturedProjects([
          {
            id: "1",
            title: "Symphony No. V",
            subtitle: "Movement IV • 5:33",
            type: "video",
            role: "conductor",
            composer: "Ludwig van Beethoven",
            date: "2020-06-15",
            location: "Atlanta, GA",
            event: "AUCSO - CAU Board Meeting",
            mediaUrl: "https://vybiefufnvfqvggaxcyy.supabase.co/storage/v1/object/public/media/AUCSO%20-%20CAU%20Board%20Meeting%20-Beethoven%205%20IV%20-%2002_21_20.MOV",
            color: "#667eea",
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

  const handleOpen = (project: Project) => setSelectedProject(project)
  const handleClose = () => setSelectedProject(null)

  if (loading) {
    return (
      <MinimalLayout title="music">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white">Loading music projects...</div>
        </div>
      </MinimalLayout>
    )
  }

  return (
    <MinimalLayout title="music">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <MinimalProjectGrid projects={featuredProjects} onOpen={handleOpen} />
      </motion.div>

      {selectedProject && (
        <LightboxModal project={selectedProject} onClose={handleClose} />
      )}

      {/* Upload Section (removed as per request) */}
      {/* <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4 text-white">Upload Your Music Stems</h2>
        <button
          onClick={() => setShowUploader(true)}
          className="bg-white text-black rounded px-4 py-2"
        >
          Upload Stems
        </button>

        {showUploader && (
          <FileUploader
            category="music"
            onClose={() => setShowUploader(false)}
          />
        )}
      </div> */}

      {/* Role Selection Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4 text-white">Explore Music Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className="bg-zinc-800 rounded-xl p-4 text-white hover:bg-zinc-700 transition text-center"
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Role Modal */}
      {activeRole && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl max-w-sm text-white relative">
            <button
              className="absolute top-3 right-3 text-white"
              onClick={() => setActiveRole(null)}
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-2">{activeRole}</h3>
            {/* Mini explainer video placeholder for every modal */}
            <div className="mb-4">
              <div className="aspect-video w-full rounded overflow-hidden bg-black/40 flex items-center justify-center">
                {/* Replace src with your explainer video URL for each service */}
                <video
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  controls
                  className="w-full h-full object-cover"
                  poster="https://via.placeholder.com/320x180?text=Explainer+Video"
                >
                  Sorry, your browser does not support embedded videos.
                </video>
              </div>
            </div>
            {activeRole === "Mix/Master" && (
              <div>
                <h4 className="text-lg font-semibold mb-4">Upload Stems for Mixing or Mastering</h4>
                {/* Upload button (reuse your FileUploader) */}
                {!showUploader && (
                  <button
                    onClick={() => setShowUploader(true)}
                    className="bg-white text-black rounded px-4 py-2 mb-4"
                  >
                    Upload Stems
                  </button>
                )}
                {showUploader && (
                  <FileUploader
                    category="mix-master"
                    onClose={() => setShowUploader(false)}
                  />
                )}
                {/* Fake file browser UI (can be upgraded later) */}
                <div className="mt-4 border border-white/20 rounded p-4 bg-zinc-800">
                  <p className="text-sm text-gray-300 mb-2">Uploaded Files:</p>
                  <ul className="text-sm text-white space-y-1">
                    <li>• kick.wav</li>
                    <li>• vocals-lead.wav</li>
                    <li>• pad-track.mp3</li>
                  </ul>
                </div>
              </div>
            )}
            {activeRole === "Compose" && (
              <p className="text-sm text-gray-300">
                Let's collaborate on a commissioned composition. Upload lyrics, briefs, or scores and I'll compose original music to match your vision.
              </p>
            )}
            {activeRole === "Track a Project" && (
              <p className="text-sm text-gray-300">
                Need piano, synths, or orchestral instruments tracked? Upload a reference file and I'll return stems ready to mix.
              </p>
            )}
            {activeRole === "Conduct" && (
              <p className="text-sm text-gray-300">
                Available for both in-person and virtual conducting gigs. Upload a concert program or video request to begin.
              </p>
            )}
            {activeRole === "Sing" && (
              <p className="text-sm text-gray-300">
                For vocal performances or studio features, upload sheet music or your guide track and I'll provide layered vocals as needed.
              </p>
            )}
            {activeRole === "Accompany (Piano)" && (
              <p className="text-sm text-gray-300">
                Send your solo part or rehearsal footage and I'll record high-quality piano accompaniment tailored to your tempo and expression.
              </p>
            )}
            {activeRole === "Section Viola" && (
              <p className="text-sm text-gray-300">
                Need orchestral viola support? I provide remote section recording or in-person performances depending on location.
              </p>
            )}
          </div>
        </div>
      )}
    </MinimalLayout>
  )
}
