"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, FileText, User, Menu, Play, Square } from "lucide-react"
import Link from "next/link"
import { DownloadModal } from "@/components/download-modal"

interface HeaderProps {
  isPlaying?: boolean
  onPlayPause?: () => void
}

export function Header({ isPlaying = false, onPlayPause }: HeaderProps) {
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [downloadType, setDownloadType] = useState<"resume" | "cv">("resume")
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleDownloadResume = (type: "resume" | "cv") => {
    setDownloadType(type)
    setShowDownloadModal(true)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full px-6 py-6 relative z-[60] pointer-events-auto bg-black/20 backdrop-blur-sm"
    >
      <div className="w-full flex items-center justify-between px-6">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl font-bold text-white"
            style={{ direction: "rtl" }}
          >
            עזרה
          </motion.div>
        </Link>

        <div className="flex items-center gap-4">
          {/* Play/Stop Button */}
          {onPlayPause && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onPlayPause}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              {isPlaying ? (
                <Square className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </motion.button>
          )}

          {/* Navigation Menu */}
          <DropdownMenu open={openDropdown === "nav"} onOpenChange={(open) => setOpenDropdown(open ? "nav" : null)}>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <Menu className="w-5 h-5 text-white" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white/20 backdrop-blur-sm border border-white/20 z-[70]">
              <DropdownMenuItem asChild disabled>
                <Link href="#" className="cursor-not-allowed text-white/50 hover:text-white/50">
                  Developer
                  <span className="ml-auto text-xs text-white/30">Coming Soon</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild disabled>
                <Link href="#" className="cursor-not-allowed text-white/50 hover:text-white/50">
                  Linguist
                  <span className="ml-auto text-xs text-white/30">Coming Soon</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/music" className="cursor-pointer text-white hover:text-white">
                  Music
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/educator" className="cursor-pointer text-white hover:text-white">
                  Educator
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Resume/CV Dropdown */}
          <DropdownMenu open={openDropdown === "resume"} onOpenChange={(open) => setOpenDropdown(open ? "resume" : null)}>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <motion.span
                  animate={{ rotate: [0, -20, 20, -10, 0] }}
                  transition={{
                    times: [0, 0.15, 0.3, 0.45, 1],
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 44,
                    ease: "easeInOut"
                  }}
                  style={{ display: 'inline-block' }}
                >
                  <MoreHorizontal className="w-5 h-5 text-white" />
                </motion.span>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white/20 backdrop-blur-sm border border-white/20 z-[70]">
              <DropdownMenuItem onClick={() => handleDownloadResume("resume")} className="cursor-pointer text-white hover:text-white">
                <FileText className="w-4 h-4 mr-2" />
                Download Resume
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadResume("cv")} className="cursor-pointer text-white hover:text-white">
                <User className="w-4 h-4 mr-2" />
                Download CV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Download Modal */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        type={downloadType}
      />
    </motion.header>
  )
}
