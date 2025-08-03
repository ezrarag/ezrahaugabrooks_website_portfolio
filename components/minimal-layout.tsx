"use client"

import { ReactNode, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { AiChatCenter } from "@/components/ai-chat-center"
import { ButtonDropdown } from "@/components/button-dropdown"

// Add DropdownItem type
export type DropdownItem = {
  icon: string
  label: string
  onClick?: () => void
  href?: string
}

// Add DropdownSection type
export type DropdownSection = {
  title: string
  items: DropdownItem[]
}

type MinimalLayoutProps = {
  title: string
  children: ReactNode
  musicServices?: { name: string; description: string }[]
  onServiceSelect?: (service: string) => void
}

export function MinimalLayout({ title, children, musicServices, onServiceSelect }: MinimalLayoutProps) {
  const [showResumeGenerator, setShowResumeGenerator] = useState(false)

  // Use DropdownSection[] for type safety
  const dropdownSections: DropdownSection[] = [
    {
      title: "Contact",
      items: [
        {
          icon: "✉️",
          label: "Email",
          href: "mailto:your@email.com",
        },
        {
          icon: "🔗",
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/your-profile",
        },
        {
          icon: "📄",
          label: "Resume Generator",
          onClick: () => setShowResumeGenerator(true),
        },
      ],
    },
  ]

  // Add music services dropdown if provided
  if (musicServices && onServiceSelect) {
    dropdownSections.unshift({
      title: "Music Services",
      items: musicServices.map(service => ({
        icon: "🎵",
        label: service.name,
        onClick: () => onServiceSelect(service.name),
      }))
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/0 container mx-auto px-6 py-4"
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

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="container mx-auto px-6 pb-20"
      >
        {children}
      </motion.main>

      {/* Resume Generator Modal (optional) */}
      {showResumeGenerator && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-zinc-900 text-white p-6 rounded-xl relative max-w-md">
            <button className="absolute top-3 right-3" onClick={() => setShowResumeGenerator(false)}>
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-2">Resume Generator</h3>
            <p>This is a placeholder for your resume generator modal.</p>
          </div>
        </div>
      )}

      {/* AI Chat Center */}
      <div data-chat-trigger>
        <AiChatCenter />
      </div>
    </div>
  )
}
