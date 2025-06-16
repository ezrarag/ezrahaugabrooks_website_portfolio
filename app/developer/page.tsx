"use client"

import { motion } from "framer-motion"
import { DarkLayout } from "@/components/dark-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, ExternalLink } from "lucide-react"

export default function DeveloperPage() {
  const projects = [
    {
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution with React, Next.js, and Stripe integration",
      technologies: ["Next.js", "React", "TypeScript", "Stripe", "Tailwind CSS"],
      image: "/placeholder.svg?height=300&width=400",
      github: "#",
      demo: "#",
      category: "Web Application",
    },
    {
      title: "Mobile Banking App",
      description: "Cross-platform mobile application built with React Native",
      technologies: ["React Native", "TypeScript", "Redux", "Firebase"],
      image: "/placeholder.svg?height=300&width=400",
      github: "#",
      demo: "#",
      category: "Mobile App",
    },
    {
      title: "Real-time Analytics Dashboard",
      description: "Client dashboard with real-time data visualization and reporting",
      technologies: ["React", "D3.js", "WebSocket", "Node.js", "PostgreSQL"],
      image: "/placeholder.svg?height=300&width=400",
      github: "#",
      demo: "#",
      category: "Dashboard",
    },
    {
      title: "API Gateway Service",
      description: "Microservices architecture with API gateway and authentication",
      technologies: ["Node.js", "Express", "Docker", "Redis", "JWT"],
      image: "/placeholder.svg?height=300&width=400",
      github: "#",
      demo: "#",
      category: "Backend",
    },
  ]

  const skills = [
    { name: "Frontend", technologies: ["React", "Next.js", "Vue.js", "TypeScript", "Tailwind CSS"] },
    { name: "Backend", technologies: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Redis"] },
    { name: "Mobile", technologies: ["React Native", "Flutter", "iOS", "Android"] },
    { name: "DevOps", technologies: ["Docker", "AWS", "Vercel", "CI/CD", "Kubernetes"] },
  ]

  return (
    <DarkLayout
      title="DEVELOPER"
      description="Full-stack developer specializing in modern web applications, mobile development, and scalable backend systems."
    >
      {/* Skills Section */}
      <section className="mb-16">
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-8"
        >
          Technical Skills
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skillCategory, index) => (
            <motion.div
              key={skillCategory.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-gray-900 border-gray-800 h-full">
                <CardHeader>
                  <CardTitle className="text-white">{skillCategory.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="border-gray-700 text-gray-300">
                        {tech}
                      </Badge>
                    ))}
                  </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <div className="flex gap-3">
                    <Button size="sm" className="bg-white text-black hover:bg-gray-200" asChild>
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Demo
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      asChild
                    >
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-1" />
                        Code
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </DarkLayout>
  )
}
