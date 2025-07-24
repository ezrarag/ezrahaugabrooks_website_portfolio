"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Download, FileText, User, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface SubcategoryOption {
  id: string
  name: string
}

interface AreaOption {
  id: string
  name: string
  description: string
  icon: string
  subcategories?: SubcategoryOption[]
}

const areaOptions: AreaOption[] = [
  {
    id: "developer",
    name: "Developer",
    description: "Software development, programming, and technical skills",
    icon: "💻",
    subcategories: [
      { id: "frontend", name: "Frontend" },
      { id: "backend", name: "Backend" },
      { id: "fullstack", name: "Full Stack" },
      { id: "devops", name: "DevOps" },
      { id: "cloud", name: "Cloud" },
      { id: "mobile", name: "Mobile" },
      { id: "data", name: "Data/AI" },
    ]
  },
  {
    id: "linguist",
    name: "Linguist",
    description: "Language expertise, translation, and linguistic analysis",
    icon: "🌐",
    subcategories: [
      { id: "translation", name: "Translation" },
      { id: "interpretation", name: "Interpretation" },
      { id: "research", name: "Research" },
      { id: "teaching", name: "Teaching" },
      { id: "editing", name: "Editing" },
      { id: "multilingual", name: "Multilingual" },
    ]
  },
  {
    id: "musician",
    name: "Musician",
    description: "Musical composition, performance, and audio production",
    icon: "🎵",
    subcategories: [
      { id: "viola", name: "Viola" },
      { id: "piano", name: "Piano" },
      { id: "composition", name: "Composition" },
      { id: "conducting", name: "Conducting" },
      { id: "singing", name: "Singing" },
      { id: "orchestration", name: "Orchestration" },
      { id: "recording", name: "Recording/Production" },
      { id: "arranging", name: "Arranging" },
    ]
  },
  {
    id: "educator",
    name: "Educator",
    description: "Teaching experience, curriculum development, and education",
    icon: "📚",
    subcategories: [
      { id: "k12", name: "K-12" },
      { id: "highered", name: "Higher Ed" },
      { id: "curriculum", name: "Curriculum Design" },
      { id: "workshops", name: "Workshops" },
      { id: "online", name: "Online Teaching" },
      { id: "mentoring", name: "Mentoring" },
    ]
  }
]

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  type: "resume" | "cv"
}

export function DownloadModal({ isOpen, onClose, type }: DownloadModalProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  // New: subcategory selection state
  const [selectedSubcategories, setSelectedSubcategories] = useState<Record<string, string[]>>({})
  const [isGenerating, setIsGenerating] = useState(false)

  const handleAreaToggle = (areaId: string) => {
    setSelectedAreas(prev =>
      prev.includes(areaId)
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    )
    // If deselecting, clear subcategories for that area
    setSelectedSubcategories(prev => {
      if (selectedAreas.includes(areaId)) {
        const { [areaId]: _, ...rest } = prev
        return rest
      } else {
        return { ...prev, [areaId]: [] }
      }
    })
  }

  const handleSelectAll = () => {
    setSelectedAreas(areaOptions.map(area => area.id))
    // Select all subcategories for all areas
    const allSubs: Record<string, string[]> = {}
    areaOptions.forEach(area => {
      if (area.subcategories) {
        allSubs[area.id] = area.subcategories.map(sub => sub.id)
      }
    })
    setSelectedSubcategories(allSubs)
  }

  const handleClearAll = () => {
    setSelectedAreas([])
    setSelectedSubcategories({})
  }

  // Subcategory selection handlers
  const handleSubcategoryToggle = (areaId: string, subId: string) => {
    setSelectedSubcategories(prev => {
      const current = prev[areaId] || []
      return {
        ...prev,
        [areaId]: current.includes(subId)
          ? current.filter(id => id !== subId)
          : [...current, subId]
      }
    })
  }

  const handleSelectAllSubcategories = (areaId: string) => {
    const area = areaOptions.find(a => a.id === areaId)
    if (!area?.subcategories) return
    setSelectedSubcategories(prev => ({
      ...prev,
      [areaId]: area.subcategories!.map(sub => sub.id)
    }))
  }

  const handleClearAllSubcategories = (areaId: string) => {
    setSelectedSubcategories(prev => ({
      ...prev,
      [areaId]: []
    }))
  }

  const handleDownload = async () => {
    if (selectedAreas.length === 0) {
      toast.error("Please select at least one area", {
        description: "Choose the areas you'd like to include in your document"
      })
      return
    }
    // New: check for at least one subcategory if area has subcategories
    for (const areaId of selectedAreas) {
      const area = areaOptions.find(a => a.id === areaId)
      if (area?.subcategories && (!selectedSubcategories[areaId] || selectedSubcategories[areaId].length === 0)) {
        toast.error(`Please select at least one subcategory for ${area.name}`)
        return
      }
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          areas: selectedAreas,
          subcategories: selectedSubcategories,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate document")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type}-${selectedAreas.join("-")}-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`${type.toUpperCase()} downloaded successfully!`, {
        description: `Your ${type} with ${selectedAreas.length} area(s) has been saved`
      })

      onClose()
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Download failed", {
        description: "Please try again or contact support"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-lg overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {type === "resume" ? (
                  <FileText className="w-6 h-6 text-blue-600" />
                ) : (
                  <User className="w-6 h-6 text-green-600" />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Download {type.toUpperCase()}
                  </h2>
                  <p className="text-gray-600">
                    Customize your {type} by selecting the areas you'd like to include
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Area Selection */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Select Areas</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        className="text-xs"
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearAll}
                        className="text-xs"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {areaOptions.map((area) => {
                      const isSelected = selectedAreas.includes(area.id)
                      return (
                        <Card
                          key={area.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "ring-2 ring-blue-500 bg-blue-50"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => handleAreaToggle(area.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{area.icon}</div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{area.name}</h4>
                                <p className="text-sm text-gray-600">{area.description}</p>
                              </div>
                              {isSelected && (
                                <Check className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            {/* Subcategory selection UI */}
                            {isSelected && area.subcategories && (
                              <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700">Subcategories</span>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={e => { e.stopPropagation(); handleSelectAllSubcategories(area.id) }}
                                      className="text-xs px-2 py-1"
                                    >
                                      All
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={e => { e.stopPropagation(); handleClearAllSubcategories(area.id) }}
                                      className="text-xs px-2 py-1"
                                    >
                                      None
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {area.subcategories.map(sub => (
                                    <label
                                      key={sub.id}
                                      className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer border text-xs ${
                                        selectedSubcategories[area.id]?.includes(sub.id)
                                          ? "bg-blue-200 border-blue-400 text-blue-900"
                                          : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-blue-50"
                                      }`}
                                      onClick={e => e.stopPropagation()}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedSubcategories[area.id]?.includes(sub.id) || false}
                                        onChange={() => handleSubcategoryToggle(area.id, sub.id)}
                                        className="accent-blue-600"
                                      />
                                      {sub.name}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                {/* Selection Summary */}
                {selectedAreas.length > 0 && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">Selected Areas & Subcategories</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedAreas.map(areaId => {
                          const area = areaOptions.find(a => a.id === areaId)
                          if (!area) return null
                          const subs = selectedSubcategories[areaId] || []
                          return (
                            <span key={areaId} className="inline-flex items-center gap-1">
                              <Badge className="bg-blue-100 text-blue-800">
                                {area.icon} {area.name}
                              </Badge>
                              {subs.length > 0 && (
                                <span className="flex gap-1">
                                  {subs.map(subId => {
                                    const sub = area.subcategories?.find(s => s.id === subId)
                                    return sub ? (
                                      <Badge key={subId} className="bg-blue-200 text-blue-900">
                                        {sub.name}
                                      </Badge>
                                    ) : null
                                  })}
                                </span>
                              )}
                            </span>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Type-specific Information */}
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      About {type.toUpperCase()}s
                    </h4>
                    {type === "resume" ? (
                      <p className="text-sm text-gray-600">
                        Resumes are concise, targeted documents focused on specific job opportunities. 
                        They highlight relevant skills and achievements for the selected areas.
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        CVs are comprehensive documents that provide a complete overview of your 
                        academic and professional background across all selected areas.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {selectedAreas.length > 0 ? (
                    <span>Ready to download {type} with {selectedAreas.length} area(s)</span>
                  ) : (
                    <span>Please select at least one area to continue</span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDownload}
                    disabled={selectedAreas.length === 0 || isGenerating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download {type.toUpperCase()}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 