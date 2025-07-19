
"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Link from "next/link"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Featured Project */}
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
          </div>

          {/* Right Column - Profile Card */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-64"
            >
              {/* Avatar Background with Gradient Overlay */}
              <div className="absolute inset-0">
                <img 
                  src="https://vybiefufnvfqvggaxcyy.supabase.co/storage/v1/object/public/avatars//IMG_7871.jpeg?height=200&width=200" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-xl font-bold mb-3"
                  >
                    Hi, I'm a creative technologist
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-sm leading-relaxed mb-4 text-gray-100"
                  >
                    Independent designer based in Atlanta, Georgia — blending minimal design with thoughtful interaction.
                  </motion.p>
                </div>

                {/* Expertise Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="grid grid-cols-2 gap-2"
                >
                  <Link href="/developer" className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-xs font-medium text-white hover:bg-white/30 transition-colors text-center">
                    Developer
                  </Link>
                  <Link href="/linguist" className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-xs font-medium text-white hover:bg-white/30 transition-colors text-center">
                    Linguist
                  </Link>
                  <Link href="/music" className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-xs font-medium text-white hover:bg-white/30 transition-colors text-center">
                    Musician
                  </Link>
                  <Link href="/educator" className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-xs font-medium text-white hover:bg-white/30 transition-colors text-center">
                    Educator
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contact Section - Below the two cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12"
        >
          <ContactSection />
        </motion.div>
      </main>

      {/* AI Chat Center replaces VideoPlayer */}
      <AiChatCenter />
    </div>
  )
}
