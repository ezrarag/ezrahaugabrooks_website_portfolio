"use client"

import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, FileText, User, Menu } from "lucide-react"
import Link from "next/link"

export function Header() {
  const handleDownloadResume = (type: "resume" | "cv") => {
    console.log(`Downloading ${type}...`)
    alert(`${type.toUpperCase()} download will be implemented with backend integration`)
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
            className="text-2xl font-bold"
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
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Menu className="w-5 h-5" />
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
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
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
    </motion.header>
  )
}
