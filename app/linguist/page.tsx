"use client"

import { MinimalLayout } from "@/components/minimal-layout"
import { MinimalProjectGrid } from "@/components/minimal-project-grid"

export default function LinguistPage() {
  const projects = [
    {
      id: "1",
      title: "Crypto Translation Protocol",
      subtitle: "Blockchain • Web3 • IPFS",
      image: "/placeholder.svg?height=400&width=600&text=Crypto+Translation",
      type: "interactive" as const,
      color: "#2d1b69",
    },
    {
      id: "2",
      title: "Philosophy Papers",
      subtitle: "Semantic Theory • Research",
      image: "/placeholder.svg?height=400&width=600&text=Philosophy+Research",
      type: "image" as const,
      color: "#11998e",
    },
    {
      id: "3",
      title: "Language Learning Game",
      subtitle: "Unity • AI/ML • NLP",
      image: "/placeholder.svg?height=400&width=600&text=Language+Game",
      type: "video" as const,
      color: "#38ef7d",
    },
    {
      id: "4",
      title: "Multilingual Interface",
      subtitle: "React • i18n • Accessibility",
      image: "/placeholder.svg?height=400&width=600&text=Multilingual+UI",
      type: "interactive" as const,
      color: "#667eea",
    },
  ]

  return (
    <MinimalLayout title="language">
      <MinimalProjectGrid projects={projects} />
    </MinimalLayout>
  )
}
