"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Download, FileText, Video, Music, Star, Loader2, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { client, musicWorksQuery, uniqueTagsQuery, healthCheckQuery } from "@/lib/sanity"

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

export function MusicianPortfolio() {
  const [musicWorks, setMusicWorks] = useState<MusicWork[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error">("checking")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // First, test the connection
        console.log("Testing Sanity connection...")
        const healthCheck = await client.fetch(healthCheckQuery)
        console.log(`Sanity connection successful. Found ${healthCheck} music works.`)
        setConnectionStatus("connected")

        if (healthCheck === 0) {
          // No works found, but connection is working
          setMusicWorks([])
          setAvailableTags([])
          setError("No music works found in your Sanity dataset. Add some works to get started!")
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

        setMusicWorks(validWorks)
        setAvailableTags(tags || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching music works:", err)
        setConnectionStatus("error")

        // Provide more specific error messages
        if (err instanceof Error) {
          if (err.message.includes("projectId")) {
            setError("Sanity project ID is missing or invalid. Please check your environment variables.")
          } else if (err.message.includes("dataset")) {
            setError("Sanity dataset not found. Please check your dataset name in environment variables.")
          } else if (err.message.includes("token")) {
            setError("Sanity API token is invalid. Please check your token permissions.")
          } else {
            setError(`Connection error: ${err.message}`)
          }
        } else {
          setError("Failed to connect to Sanity. Please check your configuration.")
        }

        // Fallback to empty arrays
        setMusicWorks([])
        setAvailableTags([])
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

  if (error) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <div className="text-gray-400 space-y-2">
          <p>
            Connection Status:{" "}
            <span className={connectionStatus === "connected" ? "text-green-400" : "text-red-400"}>
              {connectionStatus}
            </span>
          </p>
          <p>Make sure your Sanity project is set up and environment variables are configured:</p>
          <div className="text-sm bg-gray-800 p-4 rounded-lg mt-4 text-left max-w-md mx-auto">
            <p>NEXT_PUBLIC_SANITY_PROJECT_ID={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "not set"}</p>
            <p>NEXT_PUBLIC_SANITY_DATASET={process.env.NEXT_PUBLIC_SANITY_DATASET || "not set"}</p>
            <p>SANITY_API_TOKEN={process.env.SANITY_API_TOKEN ? "set" : "not set"}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Filter Tabs - Only show if we have tags */}
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
      {filteredWorks.length > 0 ? (
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

                  {/* Media Type Icon */}
                  <div className="absolute top-4 left-4 bg-black/80 p-2 rounded-full text-white">
                    {getMediaIcon(work.mediaType)}
                  </div>

                  {/* Featured Badge */}
                  {work.featured && (
                    <div className="absolute top-4 right-4 bg-yellow-500 p-1 rounded-full">
                      <Star className="w-4 h-4 text-black" />
                    </div>
                  )}

                  {/* Type Badge */}
                  <Badge className={`absolute bottom-4 left-4 ${getTypeColor(work.type)} text-white`}>
                    {work.type}
                  </Badge>

                  {/* CV Include Indicator */}
                  {work.cvInclude && <Badge className="absolute bottom-4 right-4 bg-green-600 text-white">CV</Badge>}
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
                      asChild
                      disabled={!work.mediaUrl}
                    >
                      <a href={work.mediaUrl || "#"} target="_blank" rel="noopener noreferrer">
                        <Play className="w-4 h-4 mr-1" />
                        {work.mediaType === "document" ? "View" : "Play"}
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      asChild
                      disabled={!work.mediaUrl}
                    >
                      <a href={work.mediaUrl || "#"} download>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {musicWorks.length === 0
              ? "No music works found. Add some works to your Sanity CMS to get started!"
              : "No works found for the selected filter."}
          </p>
        </motion.div>
      )}

      {/* Portfolio Stats */}
      {musicWorks.length > 0 && (
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
      )}
    </div>
  )
}
