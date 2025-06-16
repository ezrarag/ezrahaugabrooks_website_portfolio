import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Music, BookOpen, Code, Languages } from "lucide-react"

interface SectionContentProps {
  section: string
}

export function SectionContent({ section }: SectionContentProps) {
  const content = {
    developer: {
      title: "Developer",
      icon: <Code className="w-6 h-6" />,
      description: "Full-stack development, web applications, and client solutions",
      items: [
        { title: "E-commerce Platform", description: "React/Next.js with Stripe integration", link: "#" },
        { title: "Mobile App", description: "React Native cross-platform solution", link: "#" },
        { title: "Client Dashboard", description: "Real-time analytics and reporting", link: "#" },
      ],
    },
    linguist: {
      title: "Linguist",
      icon: <Languages className="w-6 h-6" />,
      description: "Language research, philosophy, and innovative projects",
      items: [
        { title: "Crypto Language Project", description: "Blockchain-based translation protocol", link: "#" },
        { title: "Philosophy Papers", description: "Published research on linguistic theory", link: "#" },
        { title: "Language Games", description: "Interactive learning applications", link: "#" },
      ],
    },
    composer: {
      title: "Composer/Musician",
      icon: <Music className="w-6 h-6" />,
      description: "Musical compositions, recordings, and BEAM projects",
      items: [
        { title: "Symphony No. 1", description: "Original orchestral composition", link: "#" },
        { title: "BEAM Recordings", description: "Collaborative musical projects", link: "#" },
        { title: "Digital Scores", description: "Interactive sheet music platform", link: "#" },
      ],
    },
    educator: {
      title: "Educator",
      icon: <BookOpen className="w-6 h-6" />,
      description: "Teaching, research, and academic contributions",
      items: [
        { title: "Online Courses", description: "Programming and linguistics curriculum", link: "#" },
        { title: "Think Tank Research", description: "BEAM collaborative studies", link: "#" },
        { title: "University Lectures", description: "Guest speaking and workshops", link: "#" },
      ],
    },
  }

  const sectionData = content[section as keyof typeof content]

  if (!sectionData) return null

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-slate-800/50 border-gold-400/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gold-400">
            {sectionData.icon}
            {sectionData.title}
          </CardTitle>
          <CardDescription className="text-slate-300">{sectionData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sectionData.items.map((item, index) => (
              <Card key={index} className="bg-slate-700/30 border-slate-600 hover:border-gold-400/50 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">{item.title}</CardTitle>
                  <CardDescription className="text-slate-400">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-slate-900"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                      <Github className="w-4 h-4 mr-1" />
                      Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
