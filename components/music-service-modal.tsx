"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, FileText, CreditCard, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PaymentForm } from "@/components/payment-form"

interface MusicServiceModalProps {
  service: string
  description: string
  isOpen: boolean
  onClose: () => void
}

const servicePricing = {
  "Compose": 150,
  "Mix/Master": 200,
  "Track a Project": 100,
  "Conduct": 300,
  "Sing": 120,
  "Accompany (Piano)": 80,
  "Section Viola": 90
}

export function MusicServiceModal({ service, description, isOpen, onClose }: MusicServiceModalProps) {
  const [step, setStep] = useState<"form" | "payment">("form")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectDescription: "",
    timeline: "",
    budget: "",
    documentUrl: ""
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 100)

    try {
      // Here you would implement actual file upload to your storage
      // For now, we'll simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setFormData(prev => ({
        ...prev,
        documentUrl: `https://example.com/uploads/${file.name}`
      }))
      setUploadProgress(100)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setStep("payment")
  }

  const handlePaymentSuccess = (appointment: any) => {
    console.log("Payment successful, appointment created:", appointment)
    onClose()
    setStep("form")
    setFormData({
      name: "",
      email: "",
      phone: "",
      projectDescription: "",
      timeline: "",
      budget: "",
      documentUrl: ""
    })
  }

  const handlePaymentCancel = () => {
    setStep("form")
  }

  const price = servicePricing[service as keyof typeof servicePricing] || 100

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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/20 backdrop-blur-lg border border-white/20 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div>
                <h2 className="text-2xl font-bold text-white">{service}</h2>
                <p className="text-white/70 mt-1">{description}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === "form" ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Name *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Email *
                      </label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* Project Details */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Project Description *
                    </label>
                    <Textarea
                      required
                      value={formData.projectDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectDescription: e.target.value }))}
                      className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50 min-h-[100px]"
                      placeholder="Describe your project requirements, goals, and any specific details..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Timeline
                      </label>
                      <Input
                        value={formData.timeline}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                        className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50"
                        placeholder="e.g., 2 weeks, 1 month"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Budget Range
                      </label>
                      <Input
                        value={formData.budget}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                        className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50"
                        placeholder="e.g., $500-1000"
                      />
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Upload Documents (PDF, DOC, etc.)
                    </label>
                    <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        {isUploading ? (
                          <div className="space-y-2">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-white" />
                            <p className="text-white/70">Uploading... {uploadProgress}%</p>
                          </div>
                        ) : formData.documentUrl ? (
                          <div className="space-y-2">
                            <FileText className="w-8 h-8 mx-auto text-green-400" />
                            <p className="text-white">Document uploaded successfully!</p>
                            <p className="text-white/70 text-sm">Click to upload a different file</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-8 h-8 mx-auto text-white/70" />
                            <p className="text-white">Click to upload documents</p>
                            <p className="text-white/70 text-sm">PDF, DOC, DOCX, TXT files accepted</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Service Summary */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{service}</h3>
                        <p className="text-white/70 text-sm">{description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/70 text-sm">Service Fee</p>
                        <p className="text-2xl font-bold text-white">${price}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceed to Payment
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <h3 className="text-white font-semibold mb-2">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70">Service:</span>
                        <span className="text-white">{service}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Name:</span>
                        <span className="text-white">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Email:</span>
                        <span className="text-white">{formData.email}</span>
                      </div>
                      <div className="border-t border-white/20 pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-white">Total:</span>
                          <span className="text-white">${price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <PaymentForm
                    amount={price}
                    appointmentData={{
                      service,
                      visitorName: formData.name,
                      visitorEmail: formData.email,
                      visitorPhone: formData.phone,
                      projectDescription: formData.projectDescription,
                      timeline: formData.timeline,
                      budget: formData.budget,
                      documentUrl: formData.documentUrl,
                      topic: `Music Service: ${service}`
                    }}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 