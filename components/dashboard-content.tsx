"use client"

import { useState, useEffect } from "react"
import { X, FileText, Download, Calendar, MessageCircle, CreditCard, Settings, User, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DashboardContentProps {
  onClose: () => void
}

interface DashboardItem {
  id: string
  title: string
  type: "document" | "appointment" | "payment" | "message"
  status: "pending" | "completed" | "failed"
  date: string
  description: string
}

export function DashboardContent({ onClose }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([])

  // Mock data - replace with real data from Supabase
  useEffect(() => {
    setDashboardItems([
      {
        id: "1",
        title: "Resume Download",
        type: "document",
        status: "completed",
        date: "2024-01-15",
        description: "Your resume was downloaded successfully"
      },
      {
        id: "2",
        title: "Music Service Payment",
        type: "payment",
        status: "completed",
        date: "2024-01-14",
        description: "Payment for Compose service completed"
      },
      {
        id: "3",
        title: "Appointment Request",
        type: "appointment",
        status: "pending",
        date: "2024-01-13",
        description: "Meeting scheduled for next week"
      },
      {
        id: "4",
        title: "Chat Conversation",
        type: "message",
        status: "completed",
        date: "2024-01-12",
        description: "AI chat session completed"
      }
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300"
      case "pending":
        return "bg-yellow-500/20 text-yellow-300"
      case "failed":
        return "bg-red-500/20 text-red-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="w-4 h-4" />
      case "appointment":
        return <Calendar className="w-4 h-4" />
      case "payment":
        return <CreditCard className="w-4 h-4" />
      case "message":
        return <MessageCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: <User className="w-4 h-4" /> },
    { id: "documents", label: "Documents", icon: <FileText className="w-4 h-4" /> },
    { id: "appointments", label: "Appointments", icon: <Calendar className="w-4 h-4" /> },
    { id: "payments", label: "Payments", icon: <CreditCard className="w-4 h-4" /> },
    { id: "messages", label: "Messages", icon: <MessageCircle className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> }
  ]

  return (
    <div className="w-full bg-white/20 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/20">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-white/70 text-sm">Manage your materials and activities</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm">Documents</p>
                      <p className="text-2xl font-bold text-white">3</p>
                    </div>
                    <FileText className="w-8 h-8 text-white/70" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm">Appointments</p>
                      <p className="text-2xl font-bold text-white">1</p>
                    </div>
                    <Calendar className="w-8 h-8 text-white/70" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {dashboardItems.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                  >
                    <div className="text-white/70">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{item.title}</p>
                        <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-white/70 text-sm">{item.description}</p>
                      <p className="text-white/50 text-xs">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Your Documents</h3>
            <div className="space-y-3">
              {dashboardItems.filter(item => item.type === "document").map((item) => (
                <Card key={item.id} className="bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-white/70" />
                        <div>
                          <p className="text-white font-medium">{item.title}</p>
                          <p className="text-white/70 text-sm">{item.description}</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Appointments</h3>
            <div className="space-y-3">
              {dashboardItems.filter(item => item.type === "appointment").map((item) => (
                <Card key={item.id} className="bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-white/70" />
                        <div>
                          <p className="text-white font-medium">{item.title}</p>
                          <p className="text-white/70 text-sm">{item.description}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Payment History</h3>
            <div className="space-y-3">
              {dashboardItems.filter(item => item.type === "payment").map((item) => (
                <Card key={item.id} className="bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-white/70" />
                        <div>
                          <p className="text-white font-medium">{item.title}</p>
                          <p className="text-white/70 text-sm">{item.description}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Chat History</h3>
            <div className="space-y-3">
              {dashboardItems.filter(item => item.type === "message").map((item) => (
                <Card key={item.id} className="bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-white/70" />
                        <div>
                          <p className="text-white font-medium">{item.title}</p>
                          <p className="text-white/70 text-sm">{item.description}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Settings</h3>
            <div className="space-y-3">
              <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Notifications</p>
                      <p className="text-white/70 text-sm">Manage your notification preferences</p>
                    </div>
                    <Bell className="w-5 h-5 text-white/70" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Account</p>
                      <p className="text-white/70 text-sm">Update your account information</p>
                    </div>
                    <User className="w-5 h-5 text-white/70" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 