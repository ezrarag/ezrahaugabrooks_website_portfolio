"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

interface SchedulingFormProps {
  conversationId?: string
  onScheduleComplete?: () => void
}

interface TimeSlot {
  time: string
  available: boolean
}

interface Topic {
  id: string
  name: string
  description: string
  duration: number
  requiresDeposit: boolean
  depositAmount?: number
  icon: string
}

const topics: Topic[] = [
  {
    id: "consultation",
    name: "General Consultation",
    description: "Discuss your project needs and explore collaboration opportunities",
    duration: 30,
    requiresDeposit: false,
    icon: "💬"
  },
  {
    id: "development",
    name: "Development Project",
    description: "Software development, web applications, and technical solutions",
    duration: 60,
    requiresDeposit: true,
    depositAmount: 100,
    icon: "💻"
  },
  {
    id: "music",
    name: "Music Collaboration",
    description: "Musical composition, production, and performance projects",
    duration: 60,
    requiresDeposit: true,
    depositAmount: 150,
    icon: "🎵"
  },
  {
    id: "education",
    name: "Educational Content",
    description: "Curriculum development, teaching, and educational consulting",
    duration: 45,
    requiresDeposit: false,
    icon: "📚"
  },
  {
    id: "linguistics",
    name: "Linguistic Services",
    description: "Translation, interpretation, and language analysis",
    duration: 45,
    requiresDeposit: true,
    depositAmount: 75,
    icon: "🌐"
  }
]

const timeSlots: TimeSlot[] = [
  { time: "09:00", available: true },
  { time: "10:00", available: true },
  { time: "11:00", available: true },
  { time: "12:00", available: false },
  { time: "13:00", available: true },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "17:00", available: false },
  { time: "18:00", available: true },
]

export function SchedulingForm({ conversationId, onScheduleComplete }: SchedulingFormProps) {
  const [currentStep, setCurrentStep] = useState<"date" | "time" | "topic" | "details" | "payment" | "confirmation">("date")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [visitorName, setVisitorName] = useState("")
  const [visitorEmail, setVisitorEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calendar navigation
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    
    // Add empty days for padding
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i)
      days.push(dayDate)
    }
    
    return days
  }

  const isDateAvailable = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  }

  const isDateSelected = (date: Date) => {
    return selectedDate && 
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear()
  }

  const handleDateSelect = (date: Date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date)
      setCurrentStep("time")
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setCurrentStep("topic")
  }

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic)
    setCurrentStep("details")
  }

  const handleNext = () => {
    if (currentStep === "details") {
      if (!visitorName.trim() || !visitorEmail.trim()) {
        toast.error("Please fill in all required fields")
        return
      }
      
      if (selectedTopic?.requiresDeposit) {
        setCurrentStep("payment")
      } else {
        handleSubmit()
      }
    }
  }

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedTopic || !visitorName || !visitorEmail) {
      toast.error("Please complete all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          visitorName: visitorName.trim(),
          visitorEmail: visitorEmail.trim(),
          requestedDate: selectedDate.toISOString(),
          requestedTime: selectedTime,
          topic: selectedTopic.id,
          duration: selectedTopic.duration,
          message: message.trim(),
          requiresDeposit: selectedTopic.requiresDeposit,
          depositAmount: selectedTopic.depositAmount,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to schedule appointment")
      }

      setCurrentStep("confirmation")
      onScheduleComplete?.()
      
      toast.success("Appointment scheduled successfully!", {
        description: `Your meeting with Ezra is confirmed for ${selectedDate.toLocaleDateString()} at ${selectedTime}`
      })
    } catch (error) {
      console.error("Scheduling error:", error)
      toast.error("Failed to schedule appointment", {
        description: "Please try again or contact support"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setCurrentStep("date")
    setSelectedDate(null)
    setSelectedTime("")
    setSelectedTopic(null)
    setVisitorName("")
    setVisitorEmail("")
    setMessage("")
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "date":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Select Date</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium">
                  {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="p-2 font-medium text-gray-500">{day}</div>
              ))}
              
              {getDaysInMonth(currentMonth).map((date, index) => (
                <div key={index} className="p-2">
                  {date ? (
                    <button
                      onClick={() => handleDateSelect(date)}
                      disabled={!isDateAvailable(date)}
                      className={`w-8 h-8 rounded-full text-sm transition-colors ${
                        isDateSelected(date)
                          ? "bg-blue-600 text-white"
                          : isDateAvailable(date)
                            ? "hover:bg-gray-100 text-gray-900"
                            : "text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  ) : (
                    <div className="w-8 h-8" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case "time":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Time</h3>
            <p className="text-sm text-gray-600">
              Available times for {selectedDate?.toLocaleDateString()}
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    selectedTime === slot.time
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : slot.available
                        ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{slot.time}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case "topic":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Topic</h3>
            <p className="text-sm text-gray-600">
              Choose the type of meeting you'd like to schedule
            </p>
            
            <div className="space-y-3">
              {topics.map((topic) => (
                <Card
                  key={topic.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedTopic?.id === topic.id
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleTopicSelect(topic)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{topic.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{topic.name}</h4>
                          <Badge variant="outline">{topic.duration}min</Badge>
                          {topic.requiresDeposit && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              ${topic.depositAmount} deposit
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{topic.description}</p>
                      </div>
                      {selectedTopic?.id === topic.id && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "details":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Meeting Details</h3>
            <p className="text-sm text-gray-600">
              {selectedDate?.toLocaleDateString()} at {selectedTime} • {selectedTopic?.name}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <Input
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Message
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project or any specific topics you'd like to discuss..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        )

      case "payment":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Required</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Deposit Required</span>
              </div>
              <p className="text-sm text-yellow-700">
                This meeting requires a ${selectedTopic?.depositAmount} deposit to secure your appointment and prepare materials.
              </p>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Meeting Type:</span>
                  <span className="font-medium">{selectedTopic?.name}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="font-medium">{selectedTopic?.duration} minutes</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Date & Time:</span>
                  <span className="font-medium">
                    {selectedDate?.toLocaleDateString()} at {selectedTime}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Deposit Amount:</span>
                    <span className="font-bold text-lg">${selectedTopic?.depositAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center text-sm text-gray-600">
              <p>Payment processing will be handled securely after scheduling.</p>
            </div>
          </div>
        )

      case "confirmation":
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Appointment Confirmed!</h3>
            <p className="text-sm text-gray-600">
              Your meeting with Ezra has been scheduled successfully.
            </p>
            
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Topic:</span>
                    <span className="font-medium">{selectedTopic?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedTopic?.duration} minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <p className="text-xs text-gray-500">
              You will receive a confirmation email with meeting details and any payment instructions.
            </p>
          </div>
        )
    }
  }

  const renderStepIndicator = () => {
    const steps = [
      { key: "date", label: "Date", icon: Calendar },
      { key: "time", label: "Time", icon: Clock },
      { key: "topic", label: "Topic", icon: MessageSquare },
      { key: "details", label: "Details", icon: MessageSquare },
    ]
    
    if (selectedTopic?.requiresDeposit) {
      steps.push({ key: "payment", label: "Payment", icon: CreditCard })
    }
    
    return (
      <div className="flex items-center justify-center mb-6">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === step.key
          const isCompleted = steps.findIndex(s => s.key === currentStep) > index
          
          return (
            <div key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : isCompleted
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-px mx-2 ${
                  isCompleted ? "bg-green-600" : "bg-gray-200"
                }`} />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {currentStep !== "confirmation" && renderStepIndicator()}
      
      {renderStepContent()}
      
      {currentStep !== "confirmation" && (
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              if (currentStep === "time") setCurrentStep("date")
              else if (currentStep === "topic") setCurrentStep("time")
              else if (currentStep === "details") setCurrentStep("topic")
              else if (currentStep === "payment") setCurrentStep("details")
            }}
            disabled={currentStep === "date"}
          >
            Back
          </Button>
          
          <div className="flex gap-2">
            {currentStep === "payment" && (
              <Button variant="outline" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  "Schedule Without Payment"
                )}
              </Button>
            )}
            
            {(currentStep === "details" || currentStep === "payment") && (
              <Button onClick={handleNext} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scheduling...
                  </>
                ) : currentStep === "payment" ? (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay & Schedule
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            )}
          </div>
        </div>
      )}
      
      {currentStep === "confirmation" && (
        <div className="text-center">
          <Button onClick={resetForm} variant="outline">
            Schedule Another Meeting
          </Button>
        </div>
      )}
    </div>
  )
} 