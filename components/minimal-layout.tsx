"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ButtonDropdown } from "./button-dropdown"
import { useState } from "react"
import { ResumeGenerator } from "./resume-generator"
import { AiChatCenter } from "./ai-chat-center"
import type { ReactNode } from "react"

interface MinimalLayoutProps {
  children: ReactNode
  title: string
}

export function MinimalLayout({ children, title }: MinimalLayoutProps) {
  const [showResumeGenerator, setShowResumeGenerator] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const openScheduler = () => {
    // This will open the AI chat center and start a scheduling conversation
    const chatButton = document.querySelector("[data-chat-trigger]") as HTMLButtonElement
    if (chatButton) {
      chatButton.click()
      // You could also auto-send a scheduling message here
    }
  }

  const openCVAI = () => {
    setShowResumeGenerator(true)
  }

  const openSearch = () => {
    setShowSearch(true)
  }

  const dropdownSections = [
    {
      title: "Connect",
      items: [
        { icon: "📅", label: "Schedule Appointment", onClick: openScheduler },
        { icon: "💬", label: "Submit Inquiry", href: "/inquiry" },
      ],
    },
    {
      title: "Documents",
      items: [
        { icon: "📄", label: "Download Resume", href: "/resume.pdf" },
        { icon: "🧠", label: "Generate Custom CV", onClick: openCVAI },
      ],
    },
    {
      title: "Explore",
      items: [
        { icon: "🔍", label: "Search", onClick: openSearch },
        { icon: "🧭", label: "Developer", href: "/developer" },
        { icon: "🎵", label: "Music", href: "/music" },
        { icon: "🗣️", label: "Linguist", href: "/linguist" },
        { icon: "🎓", label: "Educator", href: "/educator" },
        { icon: "🎞️", label: "Media", href: "/media" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Minimal Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 py-8"
      >
        <div className="flex items-center justify-between">
          <Link href="/">
            <motion.div whileHover={{ opacity: 0.7 }} className="text-xl font-light tracking-wide">
              {title.toLowerCase()}.
            </motion.div>
          </Link>

          <ButtonDropdown label="Get in Touch" sections={dropdownSections} />
        </div>
      </motion.header>

      {/* Content */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="container mx-auto px-6 pb-20"
      >
        {children}
      </motion.main>

      {/* Resume Generator Modal */}
      {showResumeGenerator && <ResumeGenerator onClose={() => setShowResumeGenerator(false)} />}

      {/* AI Chat Center with data attribute for targeting */}
      <div data-chat-trigger>
        <AiChatCenter />
      </div>
    </div>
  )
}
