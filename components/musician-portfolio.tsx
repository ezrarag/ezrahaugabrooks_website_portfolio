"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Download, FileText, Video, Music, Star, Loader2, AlertCircle, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { client, musicWorksQuery, uniqueTagsQuery, healthCheckQuery } from "@/lib/sanity"
import { DebugPanel } from "./debug-panel"

interface MusicWork {
  _id: string
  title: string
  description: string
  type: "Recording" | "Score" | "Live Performance" | "Experimental" | "Commissioned"
  mediaType: "audio" | "video" | "document"
  mediaUrl?: string | null
  thumbnailUrl?: string | null
  tags: string[]
  dateCompleted: string
  collaborators: string[]
  featured: boolean
  cvInclude: boolean
  duration?: string
  instrumentation?: string
}

// Fallback demo data when Sanity isn't configured
const demoWorks: MusicWork[] = [
  {
    _id: "demo-1",
    title: "Symphony No. 1 in D Minor",
    description: "A four-movement orchestral work exploring themes of transformation and renewal",
    type: "Recording",
    mediaType: "audio",
    mediaUrl: null,
    thumbnailUrl: null,
    tags: ["classical", "orchestra", "symphony"],
    dateCompleted: "2023-06-15",
    collaborators: ["City Symphony Orchestra"],
    featured: true,
    cvInclude: true,
    duration: "42:30",
    instrumentation: "Full Orchestra",
  },
  {
    _id: "demo-2",
    title: "Digital Soundscapes",
    description: "Electronic composition blending organic and synthetic textures",
    type: "Experimental",
    mediaType: "audio",
    mediaUrl: null,
    thumbnailUrl: null,
    tags: ["electronic", "experimental", "digital"],
    dateCompleted: "2024-01-20",
    collaborators: [],
    featured: true,
    cvInclude: true,
    duration: "28:15",
    instrumentation: "Electronic/Digital",
  },
  {
    _id: "demo-3",
    title: "BEAM Collaborative Suite",
    description: "Multi-movement work created through BEAM Think Tank collaboration",
    type: "Commissioned",
    mediaType: "document",
    mediaUrl: null,
    thumbnailUrl: null,
    tags: ["collaborative", "BEAM Think Tank", "commissioned"],
    dateCompleted: "2024-03-10",
    collaborators: ["BEAM Think Tank", "Various Artists"],
    featured: false,
    cvInclude: true,
    duration: "35:20",
    instrumentation: "Mixed Ensemble",
  },
]

export function MusicianPortfolio() {
  const [musicWorks, setMusicWorks] = useState<MusicWork[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error" | "demo">("checking")
  const [showDebug, setShowDebug] = useState(false)

  // Check if Sanity is properly configured
  const isSanityConfigured = () => {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

    return (
      (projectId && dataset && projectId !== "your-project-id" && dataset !== "production") || dataset === "production"
    ) // production is valid
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if Sanity is configured
        if (!isSanityConfigured()) {
          console.log("Sanity not configured, using demo data")
          setConnectionStatus("demo")
          setMusicWorks(demoWorks)
          setAvailableTags(["classical", "electronic", "experimental", "collaborative", "commissioned"])
          setError("Using demo data. Configure Sanity CMS to load your actual music portfolio.")
          return
        }

        // Test the connection
        console.log("Testing Sanity connection...")
        const healthCheck = await client.fetch(healthCheckQuery)
        console.log(`Sanity connection successful. Found ${healthCheck} music works.`)
        setConnectionStatus("connected")

        if (healthCheck === 0) {
          // No works found, but connection is working
          setMusicWorks(demoWorks)
          setAvailableTags(["classical", "electronic", "experimental"])
          setError("No music works found in your Sanity dataset. Using demo data for now.")
          return
        }

        // Fetch both works and available tags
        console.log("Fetching music works and tags...")
        const [works, tags] = await Promise.all([
          client.fetch(musicWorksQuery).catch((err) => {
            console.error("Error fetching works:", err)
            return []
          }),
          client.fetch(uniqueTagsQuery).catch((err) => {
            console.error("Error fetching tags:", err)
            return []
          }),
        ])

        console.log("Fetched works:", works)
        console.log("Fetched tags:", tags)

        // Filter out works with critical missing data
        const validWorks = (works || []).filter((work: MusicWork) => {
          if (!work.title || !work.description) {
            console.warn(`Skipping work with missing title/description:`, work)
            return false
          }
          return true
        })

        setMusicWorks(validWorks.length > 0 ? validWorks : demoWorks)
        setAvailableTags(tags && tags.length > 0 ? tags : ["classical", "electronic", "experimental"])
        setError(null)
      } catch (err) {
        console.error("Error fetching music works:", err)
        setConnectionStatus("error")

        // Fallback to demo data
        setMusicWorks(demoWorks)
        setAvailableTags(["classical", "electronic", "experimental"])

        // Provide more specific error messages
        if (err instanceof Error) {
          if (err.message.includes("projectId")) {
            setError("Sanity project ID is missing or invalid. Using demo data.")
          } else if (err.message.includes("dataset")) {
            setError("Sanity dataset not found. Using demo data.")
          } else if (err.message.includes("token")) {
            setError("Sanity API token is invalid. Using demo data.")
          } else {
            setError(`Connection error: ${err.message}. Using demo data.`)
          }
        } else {
          setError("Failed to connect to Sanity. Using demo data.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredWorks = musicWorks.filter((work) => {
    if (filter === "all") return true
    if (filter === "featured") return work.featured
    return work.tags.includes(filter)
  })

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "audio":
        return <Music className="w-5 h-5" />
      case "video":
        return <Video className="w-5 h-5" />
      case "document":
        return <FileText className="w-5 h-5" />
      default:
        return <Music className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Recording":
        return "bg-blue-600"
      case "Score":
        return "bg-green-600"
      case "Live Performance":
        return "bg-purple-600"
      case "Experimental":
        return "bg-orange-600"
      case "Commissioned":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  // Generate filter options dynamically based on available tags
  const filterOptions = [
    { value: "all", label: "All Works" },
    { value: "featured", label: "Featured" },
    ...availableTags.map((tag) => ({
      value: tag,
      label: tag.charAt(0).toUpperCase() + tag.slice(1),
    })),
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <span className="ml-3 text-white">Loading portfolio...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Debug Panel Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Badge
            className={
              connectionStatus === "connected"
                ? "bg-green-600"
                : connectionStatus === "demo"
                  ? "bg-yellow-600"
                  : "bg-red-600"
            }
          >
            {connectionStatus === "connected"
              ? "Sanity Connected"
              : connectionStatus === "demo"
                ? "Demo Mode"
                : "Connection Error"}
          </Badge>
          {error && connectionStatus !== "connected" && (
            <span className="text-yellow-400 text-sm">Using demo data</span>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDebug(!showDebug)}
          className="border-gray-700 text-gray-300"
        >
          <Settings className="w-4 h-4 mr-2" />
          {showDebug ? "Hide" : "Show"} Debug
        </Button>
      </div>

      {/* Debug Panel */}
      {showDebug && <DebugPanel />}

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Notice</span>
          </div>
          <p className="text-gray-300">{error}</p>
        </div>
      )}

      {/* Filter Tabs */}
      {availableTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap gap-3"
        >
          {filterOptions.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === option.value ? "bg-white text-black" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {option.label}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Works Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredWorks.map((work, index) => (
          <motion.div
            key={work._id}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <Card className="bg-gray-900 border-gray-800 overflow-hidden h-full">
              <div className="aspect-video bg-gray-800 relative">
                {work.thumbnailUrl ? (
                  <img
                    src={work.thumbnailUrl || "/placeholder.svg"}
                    alt={work.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.warn(`Failed to load thumbnail for ${work.title}:`, work.thumbnailUrl)
                      e.currentTarget.style.display = "none"
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    {getMediaIcon(work.mediaType)}
                  </div>
                )}

                {/* Demo Badge */}
                {connectionStatus === "demo" && (
                  <Badge className="absolute top-4 left-4 bg-yellow-600 text-black">Demo</Badge>
                )}

                {/* Media Type Icon */}
                <div className="absolute top-4 right-4 bg-black/80 p-2 rounded-full text-white">
                  {getMediaIcon(work.mediaType)}
                </div>

                {/* Featured Badge */}
                {work.featured && (
                  <div className="absolute bottom-4 right-4 bg-yellow-500 p-1 rounded-full">
                    <Star className="w-4 h-4 text-black" />
                  </div>
                )}

                {/* Type Badge */}
                <Badge className={`absolute bottom-4 left-4 ${getTypeColor(work.type)} text-white`}>{work.type}</Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-white">{work.title}</CardTitle>
                <CardDescription className="text-gray-400">{work.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white ml-2">{new Date(work.dateCompleted).toLocaleDateString()}</span>
                  </div>
                  {work.duration && (
                    <div>
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white ml-2">{work.duration}</span>
                    </div>
                  )}
                  {work.instrumentation && (
                    <div className="col-span-2">
                      <span className="text-gray-400">Instrumentation:</span>
                      <span className="text-white ml-2">{work.instrumentation}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {work.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="border-gray-700 text-gray-300 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Collaborators */}
                {work.collaborators && work.collaborators.length > 0 && (
                  <div>
                    <span className="text-gray-400 text-sm">Collaborators:</span>
                    <p className="text-white text-sm mt-1">{work.collaborators.join(", ")}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-gray-200 flex-1"
                    disabled={!work.mediaUrl || connectionStatus === "demo"}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    {connectionStatus === "demo" ? "Demo" : work.mediaType === "document" ? "View" : "Play"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    disabled={!work.mediaUrl || connectionStatus === "demo"}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Portfolio Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-gray-800"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{musicWorks.length}</div>
          <div className="text-sm text-gray-400">Total Works</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{musicWorks.filter((work) => work.featured).length}</div>
          <div className="text-sm text-gray-400">Featured</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{musicWorks.filter((work) => work.cvInclude).length}</div>
          <div className="text-sm text-gray-400">CV Ready</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{availableTags.length}</div>
          <div className="text-sm text-gray-400">Categories</div>
        </div>
      </motion.div>
    </div>
  )
}
