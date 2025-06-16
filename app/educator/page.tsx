"use client"

import { motion } from "framer-motion"
import { DarkLayout } from "@/components/dark-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, ExternalLink } from "lucide-react"

export default function EducatorPage() {
  const courses = [
    {
      title: "Advanced Web Development",
      description: "Comprehensive course covering modern web technologies and best practices",
      platform: "Online Academy",
      students: 1250,
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=400",
      topics: ["React", "Next.js", "TypeScript", "Node.js", "Database Design"],
      link: "#",
    },
    {
      title: "Computational Linguistics Fundamentals",
      description: "Introduction to natural language processing and computational methods",
      platform: "University Extension",
      students: 85,
      rating: 4.9,
      image: "/placeholder.svg?height=300&width=400",
      topics: ["NLP", "Python", "Machine Learning", "Syntax Analysis", "Semantics"],
      link: "#",
    },
    {
      title: "Music Technology Workshop",
      description: "Hands-on exploration of digital audio workstations and composition tools",
      platform: "Creative Institute",
      students: 45,
      rating: 4.7,
      image: "/placeholder.svg?height=300&width=400",
      topics: ["DAW", "MIDI", "Audio Processing", "Sound Design", "Composition"],
      link: "#",
    },
  ]

  return (
    <DarkLayout
      title="EDUCATOR"
      description="Passionate about interdisciplinary education, combining technology, linguistics, and creative arts to inspire learning."
    >
      {/* Courses Section */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-8"
        >
          Online Courses
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card className="bg-gray-900 border-gray-800 overflow-hidden h-full">
                <div className="aspect-video bg-gray-800">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-white">{course.title}</CardTitle>
                  <CardDescription className="text-gray-400">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-white" />
                      <span className="text-gray-300">{course.students} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-300">{course.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.topics.slice(0, 3).map((topic, topicIndex) => (
                      <Badge key={topicIndex} variant="outline" className="border-gray-700 text-gray-300 text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {course.topics.length > 3 && (
                      <Badge variant="outline" className="border-gray-700 text-gray-300 text-xs">
                        +{course.topics.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <Button size="sm" className="bg-white text-black hover:bg-gray-200 w-full" asChild>
                    <a href={course.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Course
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
