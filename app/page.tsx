
"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ProfileSection } from "@/components/profile-section"
import { ContactSection } from "@/components/contact-section"
import { AiChatCenter } from "@/components/ai-chat-center"
import { portfolioHelpers, type DeveloperProject } from "@/lib/supabase"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

interface FeaturedProjectCarouselProps {
  projects: DeveloperProject[]
}

function FeaturedProjectCarousel({ projects }: FeaturedProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (projects.length <= 1) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % projects.length)
        setIsTransitioning(false)
      }, 300)
    }, 6000) // 6 seconds between transitions

    return () => clearInterval(interval)
  }, [projects.length])

  const handlePrevious = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
      setIsTransitioning(false)
    }, 300)
  }

  const handleNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length)
      setIsTransitioning(false)
    }, 300)
  }

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + "..."
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-64 flex items-center justify-center">
        <p className="text-gray-500">No featured projects available</p>
      </div>
    )
  }

  const currentProject = projects[currentIndex]

  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-64">
      {/* Background Image */}
      {currentProject.image_url && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ 
            backgroundImage: `url(${currentProject.image_url})`,
          }}
        />
      )}

      {/* Content */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? 20 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-10 p-6 h-full flex flex-col justify-between"
      >
        <div>
          <h3 className="text-2xl font-bold text-black mb-2">
            {currentProject.title}
          </h3>
          {currentProject.subtitle && (
            <p className="text-gray-600 text-sm mb-3">
              {currentProject.subtitle}
            </p>
          )}
          {currentProject.description && (
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {truncateText(currentProject.description)}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          {currentProject.live_url && (
            <button
              onClick={() => window.open(currentProject.live_url, '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Project
            </button>
          )}

          {/* Navigation Controls */}
          {projects.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={isTransitioning}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={isTransitioning}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      

      {/* Project Thumbnail */}
      {currentProject.image_url && (
        <div className="absolute top-4 right-4 w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-sm">
          <img
            src={currentProject.image_url}
            alt={currentProject.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<DeveloperProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedProjects() {
      try {
        const projects = await portfolioHelpers.getDeveloperProjects(true) // featured only
        setFeaturedProjects(projects || [])
      } catch (error) {
        console.error("Error fetching featured projects:", error)
        // Fallback to empty array - component will show "No featured projects" message
        setFeaturedProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProjects()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Featured Project and Contact */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {loading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-64 flex items-center justify-center">
                  <p className="text-gray-500">Loading featured project...</p>
                </div>
              ) : (
                <FeaturedProjectCarousel projects={featuredProjects} />
              )}
            </motion.div>

            <ContactSection />
          </div>

          {/* Right Column - Profile and Description */}
          <div className="space-y-8">
            <ProfileSection />
          </div>
        </div>
      </main>

      {/* AI Chat Center replaces VideoPlayer */}
      <AiChatCenter />
    </div>
  )
}
