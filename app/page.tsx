"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { ProfileSection } from "@/components/profile-section"
import { ContactSection } from "@/components/contact-section"
import { VideoPlayer } from "@/components/video-player"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Name and Contact */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-6xl md:text-8xl font-bold leading-none tracking-tight">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  YUME
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  YASKUMI
                </motion.div>
              </h1>
            </motion.div>

            <ContactSection />
          </div>

          {/* Right Column - Profile and Description */}
          <div className="space-y-8">
            <ProfileSection />
          </div>
        </div>
      </main>

      <VideoPlayer />
    </div>
  )
}
