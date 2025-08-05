
"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { AiChatCenter } from "@/components/ai-chat-center"
import { Play, Square } from "lucide-react"

export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showVideo, setShowVideo] = useState(false)

  const handlePlayPause = () => {
    if (isPlaying) {
      // Stop video and show image
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
      setIsPlaying(false)
      setShowVideo(false)
    } else {
      // Start video
      setIsPlaying(true)
      setShowVideo(true)
      if (videoRef.current) {
        videoRef.current.play()
      }
    }
  }

  const handleVideoEnded = () => {
    setIsPlaying(false)
    setShowVideo(false)
  }

  return (
    <div className="h-screen bg-gray-50 text-white relative overflow-hidden landing-page">
      {/* Background Image/Video */}
      <div className="fixed inset-0 z-0">
        {showVideo ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover object-center"
            onEnded={handleVideoEnded}
            controls
            autoPlay
          >
            <source src="https://vybiefufnvfqvggaxcyy.supabase.co/storage/v1/object/public/media//MVI_7797%20cue%2011.32%20take%201.mov" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src="https://vybiefufnvfqvggaxcyy.supabase.co/storage/v1/object/public/avatars//IMG_7871.jpeg?height=200&width=200"
            alt="Background"
            className="w-full h-full object-cover object-center scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
      </div>


      
      <div className="text-white relative z-[60]">
        <Header isPlaying={isPlaying} onPlayPause={handlePlayPause} />
      </div>
      
      <main className="h-full relative z-10 flex items-center justify-center">
        {/* Main content area - cards removed */}
      </main>

      {/* Contact Section - fixed to bottom left, parallel to chat icon */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="fixed bottom-6 left-6 z-50 flex flex-col items-start"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 group cursor-pointer" tabIndex={0}>
            <span className="text-lg font-medium">info@עזרה.online</span>
            <div className="p-1 hover:bg-gray-100 rounded transition-colors" tabIndex={0}>
              {/* Copy icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy w-4 h-4 text-gray-600"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Chat Center replaces VideoPlayer */}
      <AiChatCenter />
    </div>
  )
}
