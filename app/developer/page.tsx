"use client"
import { MinimalLayout } from "@/components/minimal-layout"
import { MinimalProjectGrid } from "@/components/minimal-project-grid"

export default function DeveloperPage() {
  const projects = [
    {
      id: "1",
      title: "E-commerce Platform",
      subtitle: "Next.js • TypeScript • Stripe",
      image: "/placeholder.svg?height=400&width=600&text=E-commerce+Platform",
      type: "image" as const,
      color: "#1a1a2e",
    },
    {
      id: "2",
      title: "Real-time Dashboard",
      subtitle: "React • WebSocket • D3.js",
      image: "/placeholder.svg?height=400&width=600&text=Analytics+Dashboard",
      type: "interactive" as const,
      color: "#16213e",
    },
    {
      id: "3",
      title: "Mobile Banking App",
      subtitle: "React Native • Firebase",
      image: "/placeholder.svg?height=400&width=600&text=Mobile+App",
      type: "video" as const,
      color: "#0f3460",
    },
    {
      id: "4",
      title: "API Gateway Service",
      subtitle: "Node.js • Docker • Redis",
      image: "/placeholder.svg?height=400&width=600&text=API+Gateway",
      type: "image" as const,
      color: "#533483",
    },
  ]

  const skills = [
    { name: "Frontend", technologies: ["React", "Next.js", "Vue.js", "TypeScript", "Tailwind CSS"] },
    { name: "Backend", technologies: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Redis"] },
    { name: "Mobile", technologies: ["React Native", "Flutter", "iOS", "Android"] },
    { name: "DevOps", technologies: ["Docker", "AWS", "Vercel", "CI/CD", "Kubernetes"] },
  ]

  return (
    <MinimalLayout title="work">
      <MinimalProjectGrid projects={projects} />
    </MinimalLayout>
  )
}
