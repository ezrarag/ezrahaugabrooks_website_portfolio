"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageCircle,
  X,
  Send,
  Paperclip,
  Calendar,
  User,
  Bot,
  Loader2,
  Bell,
  CheckCircle,
  ImageIcon,
} from "lucide-react"
import { useChat } from "ai/react"
import { toast } from "sonner"

interface Notification {
  id: string
  type: "appointment" | "inquiry" | "document"
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export function AiChatCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // AI Chat hook with Grok
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: "/api/chat",
    body: {
      conversationId,
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Hello! I'm Ezra's AI assistant. I can help you with:

• **Portfolio Discussion** - Ask about Ezra's work, skills, and projects
• **Document Analysis** - Upload your resume for personalized feedback  
• **Appointment Scheduling** - Set up meetings and consultations
• **Project Inquiries** - Discuss potential collaborations

What would you like to know about Ezra's work, or how can I assist you today?`,
      },
    ],
    onResponse: (response) => {
      // Get conversation ID from response headers
      const newConversationId = response.headers.get("x-conversation-id")
      if (newConversationId && !conversationId) {
        setConversationId(newConversationId)
      }

      // Handle special AI responses
      const actionType = response.headers.get("x-action-type")
      if (actionType) {
        handleAiAction(actionType)
      }
    },
  })

  const handleAiAction = (actionType: string) => {
    switch (actionType) {
      case "appointment":
        addNotification({
          type: "appointment",
          title: "Appointment Discussion",
          message: "I'm helping you schedule a meeting with Ezra",
        })
        break
      case "inquiry":
        addNotification({
          type: "inquiry",
          title: "Project Discussion",
          message: "We're discussing your project needs",
        })
        break
    }
  }

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])

    // Show toast
    toast(notification.title, {
      description: notification.message,
      action: {
        label: "View",
        onClick: () => {
          setActiveTab("notifications")
          setIsOpen(true)
        },
      },
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      if (conversationId) {
        formData.append("conversationId", conversationId)
      }

      const response = await fetch("/api/upload-document", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const result = await response.json()

      // Send the analysis to the chat
      await append({
        role: "assistant",
        content: `I've analyzed your document "${file.name}". Here's my detailed feedback:

${result.analysis}

Would you like to discuss any specific aspects of this analysis, or do you have questions about how your background might align with potential projects?`,
      })

      addNotification({
        type: "document",
        title: "Document Analyzed",
        message: `${file.name} has been processed and analyzed`,
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Upload failed", {
        description: "Please try again or contact support",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <>
      {/* Chat Trigger Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageCircle className="w-6 h-6" />

          {/* Notification Badge */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
            >
              {unreadCount}
            </motion.div>
          )}

          {/* Pulse Animation for New Notifications */}
          {unreadCount > 0 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="absolute inset-0 bg-red-500 rounded-full opacity-20"
            />
          )}
        </motion.button>
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ezra's AI Assistant</h3>
                    <p className="text-sm text-gray-500">
                      {conversationId ? `Connected • ID: ${conversationId.slice(0, 8)}...` : "Connecting..."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-4 bg-gray-50">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Activity
                    {unreadCount > 0 && <Badge className="bg-red-500 text-white text-xs">{unreadCount}</Badge>}
                  </TabsTrigger>
                  <TabsTrigger value="appointments" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Schedule
                  </TabsTrigger>
                  <TabsTrigger value="media" className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Media
                  </TabsTrigger>
                </TabsList>

                {/* Chat Tab */}
                <TabsContent value="chat" className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.role === "assistant" && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                            {message.role === "user" && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4" />
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm text-gray-600">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="border-t border-gray-200 p-4">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          value={input}
                          onChange={handleInputChange}
                          placeholder="Ask about Ezra's work, upload documents, or schedule a meeting..."
                          className="pr-10"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Paperclip className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <Button type="submit" disabled={isLoading || !input.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <p className="text-xs text-gray-500 mt-2">
                      💡 Try: "Tell me about Ezra's development work" or "I'd like to schedule a meeting"
                    </p>
                  </div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="flex-1 p-4">
                  <div className="space-y-3">
                    {notifications.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No activity yet</p>
                        <p className="text-sm">Start a conversation to see updates here</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <Card key={notification.id} className={`${!notification.read ? "border-blue-500" : ""}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge
                                    className={
                                      notification.type === "appointment"
                                        ? "bg-green-100 text-green-800"
                                        : notification.type === "inquiry"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-purple-100 text-purple-800"
                                    }
                                  >
                                    {notification.type}
                                  </Badge>
                                  {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                                </div>
                                <h4 className="font-semibold">{notification.title}</h4>
                                <p className="text-sm text-gray-600">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{notification.timestamp.toLocaleString()}</p>
                              </div>
                              {!notification.read && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setNotifications((prev) =>
                                      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
                                    )
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/* Appointments Tab */}
                <TabsContent value="appointments" className="flex-1 p-4">
                  <div className="text-center text-gray-500 py-8">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Schedule meetings through chat</p>
                    <p className="text-sm">Ask the AI assistant to help you set up an appointment with Ezra</p>
                    <Button
                      className="mt-4"
                      onClick={() => {
                        setActiveTab("chat")
                      }}
                    >
                      Start Scheduling
                    </Button>
                  </div>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="flex-1 p-4">
                  <div className="text-center text-gray-500 py-8">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Media Gallery</p>
                    <p className="text-sm">Portfolio images, videos, and media content will appear here</p>
                    <div className="mt-4 text-xs text-gray-400">
                      <p>Connected to Sanity CMS</p>
                      <p>Media content will be populated from your portfolio</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
