"use client"

import { motion } from "framer-motion"
import { DarkLayout } from "@/components/dark-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

export default function LinguistPage() {
  const projects = [
    {
      title: "Crypto Translation Protocol",
      description: "Blockchain-based decentralized translation network with token incentives",
      category: "Crypto Project",
      technologies: ["Solidity", "Web3", "IPFS", "React"],
      image: "/placeholder.svg?height=300&width=400",
      link: "#",
      status: "In Development",
    },
    {
      title: "Philosophy of Language Papers",
      description: "Published research on semantic theory and pragmatic inference",
      category: "Academic Research",
      technologies: ["LaTeX", "Research", "Peer Review"],
      image: "/placeholder.svg?height=300&width=400",
      link: "#",
      status: "Published",
    },
    {
      title: "Interactive Language Learning Game",
      description: "Gamified language acquisition platform with AI-powered conversations",
      category: "Educational Game",
      technologies: ["Unity", "C#", "AI/ML", "Natural Language Processing"],
      image: "/placeholder.svg?height=300&width=400",
      link: "#",
      status: "Beta Testing",
    },
  ]

  const languages = [
    { name: "English", level: "Native", flag: "🇺🇸" },
    { name: "Spanish", level: "Fluent", flag: "🇪🇸" },
    { name: "French", level: "Advanced", flag: "🇫🇷" },
    { name: "German", level: "Intermediate", flag: "🇩🇪" },
    { name: "Mandarin", level: "Beginner", flag: "🇨🇳" },
    { name: "Latin", level: "Academic", flag: "🏛️" },
  ]

  return (
    <DarkLayout
      title="LINGUIST"
      description="Exploring the intersection of language, philosophy, and technology through research, games, and innovative projects."
    >
      {/* Languages Section */}
      <section className="mb-16">
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-8"
        >
          Language Proficiency
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.05 }}
            >
              <Card className="bg-gray-900 border-gray-800 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl mb-2">{lang.flag}</div>
                  <h3 className="font-semibold text-white">{lang.name}</h3>
                  <p className="text-sm text-gray-400">{lang.level}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-3xl font-bold mb-8"
        >
          Featured Projects
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card className="bg-gray-900 border-gray-800 overflow-hidden h-full">
                <div className="aspect-video bg-gray-800 relative">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-white text-black">{project.category}</Badge>
                  <Badge
                    className="absolute top-4 right-4"
                    variant={project.status === "Published" ? "default" : "secondary"}
                  >
                    {project.status}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-white">{project.title}</CardTitle>
                  <CardDescription className="text-gray-400">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="border-gray-700 text-gray-300">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" className="bg-white text-black hover:bg-gray-200 w-full" asChild>
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Project
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </DarkLayout>
  )
}
