import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Music, Play, Download } from "lucide-react"
import Link from "next/link"

export default function ComposerPage() {
  const compositions = [
    {
      title: "Symphony No. 1 in D Minor",
      description: "A four-movement orchestral work exploring themes of transformation and renewal",
      duration: "42:30",
      instrumentation: "Full Orchestra",
      image: "/placeholder.svg?height=200&width=300",
      audioUrl: "#",
      scoreUrl: "#",
      year: "2023",
      category: "Classical",
    },
    {
      title: "Digital Soundscapes",
      description: "Electronic composition blending organic and synthetic textures",
      duration: "28:15",
      instrumentation: "Electronic/Digital",
      image: "/placeholder.svg?height=200&width=300",
      audioUrl: "#",
      scoreUrl: "#",
      year: "2024",
      category: "Electronic",
    },
    {
      title: "Chamber Quartet in A",
      description: "Intimate piece for string quartet with contemporary harmonies",
      duration: "18:45",
      instrumentation: "String Quartet",
      image: "/placeholder.svg?height=200&width=300",
      audioUrl: "#",
      scoreUrl: "#",
      year: "2023",
      category: "Chamber Music",
    },
    {
      title: "BEAM Collaborative Suite",
      description: "Multi-movement work created through BEAM Think Tank collaboration",
      duration: "35:20",
      instrumentation: "Mixed Ensemble",
      image: "/placeholder.svg?height=200&width=300",
      audioUrl: "#",
      scoreUrl: "#",
      year: "2024",
      category: "Collaborative",
    },
  ]

  const beamProjects = [
    {
      title: "Algorithmic Composition Engine",
      description: "AI-assisted composition tool developed with BEAM researchers",
      technologies: ["Python", "TensorFlow", "Music21", "MIDI"],
      status: "Active Development",
    },
    {
      title: "Interactive Performance Platform",
      description: "Real-time collaborative music creation system",
      technologies: ["Web Audio API", "WebRTC", "Node.js", "React"],
      status: "Beta Testing",
    },
    {
      title: "Sonic Data Visualization",
      description: "Converting research data into musical compositions",
      technologies: ["D3.js", "Web Audio", "Data Analysis"],
      status: "Published",
    },
  ]

  const skills = [
    "Orchestral Composition",
    "Electronic Music Production",
    "Music Theory & Analysis",
    "Digital Audio Workstations",
    "Sound Design",
    "Music Technology",
    "Collaborative Creation",
    "Performance Direction",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="text-gold-400 hover:text-gold-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Music className="w-8 h-8 text-gold-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gold-400 to-amber-300 bg-clip-text text-transparent">
              Composer Portfolio
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl">
            Creating original compositions that bridge classical traditions with contemporary innovation and
            collaborative exploration.
          </p>
        </div>

        {/* Skills Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold-400 mb-6">Musical Expertise</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="border-gold-400 text-gold-400 px-4 py-2 text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </section>

        {/* Compositions Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold-400 mb-6">Featured Compositions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {compositions.map((piece, index) => (
              <Card key={index} className="bg-slate-800/50 border-gold-400/30 overflow-hidden">
                <div className="aspect-video bg-slate-700 relative">
                  <img
                    src={piece.image || "/placeholder.svg"}
                    alt={piece.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-gold-400 text-slate-900">{piece.category}</Badge>
                  <Badge className="absolute top-4 right-4 bg-slate-900/80 text-white">{piece.year}</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-white">{piece.title}</CardTitle>
                  <CardDescription className="text-slate-400">{piece.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-400">Duration:</span>
                      <span className="text-white ml-2">{piece.duration}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Instrumentation:</span>
                      <span className="text-white ml-2">{piece.instrumentation}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-slate-900"
                      asChild
                    >
                      <a href={piece.audioUrl} target="_blank" rel="noopener noreferrer">
                        <Play className="w-4 h-4 mr-1" />
                        Listen
                      </a>
                    </Button>
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white" asChild>
                      <a href={piece.scoreUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-1" />
                        Score
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* BEAM Projects Section */}
        <section>
          <h2 className="text-2xl font-bold text-gold-400 mb-6">BEAM Think Tank Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {beamProjects.map((project, index) => (
              <Card key={index} className="bg-slate-800/50 border-gold-400/30">
                <CardHeader>
                  <CardTitle className="text-white">{project.title}</CardTitle>
                  <CardDescription className="text-slate-400">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="border-slate-600 text-slate-300">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Badge
                    variant={project.status === "Published" ? "default" : "secondary"}
                    className="w-full justify-center"
                  >
                    {project.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
