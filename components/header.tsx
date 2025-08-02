"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, FileText, User, Menu } from "lucide-react"
import Link from "next/link"
import { DownloadModal } from "@/components/download-modal"

export function Header() {
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [downloadType, setDownloadType] = useState<"resume" | "cv">("resume")

  const handleDownloadResume = (type: "resume" | "cv") => {
    setDownloadType(type)
    setShowDownloadModal(true)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-6 py-6"
    >
      <div className="flex items-center justify-between">
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
          {/* Navigation Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <Menu className="w-5 h-5 text-white" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200">
              <DropdownMenuItem asChild>
                <Link href="/developer" className="cursor-pointer">
                  Developer
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/linguist" className="cursor-pointer">
                  Linguist
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/music" className="cursor-pointer">
                  Music
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/educator" className="cursor-pointer">
                  Educator
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Resume/CV Dropdown */}
          <DropdownMenu>
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
            <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200">
              <DropdownMenuItem onClick={() => handleDownloadResume("resume")} className="cursor-pointer">
                <FileText className="w-4 h-4 mr-2" />
                Download Resume
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadResume("cv")} className="cursor-pointer">
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
