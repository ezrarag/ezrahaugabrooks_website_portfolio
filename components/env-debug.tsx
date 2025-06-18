"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Eye, EyeOff, Copy, RefreshCw } from "lucide-react"

export function EnvDebug() {
  const [showValues, setShowValues] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  // Get ALL possible environment variables that might be relevant
  const allEnvVars = {
    // Sanity variables we're looking for
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    SANITY_API_TOKEN_READ: process.env.SANITY_API_TOKEN_READ,
    NEXT_PUBLIC_SANITY_STUDIO_URL: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,

    // Alternative names that might be used
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.SANITY_DATASET,
    SANITY_TOKEN: process.env.SANITY_TOKEN,
    SANITY_READ_TOKEN: process.env.SANITY_READ_TOKEN,

    // Check if any other Sanity-related vars exist
    ...Object.fromEntries(Object.entries(process.env).filter(([key]) => key.toLowerCase().includes("sanity"))),
  }

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const maskValue = (value: string | undefined) => {
    if (!value) return "undefined"
    if (!showValues && value.length > 8) {
      return value.substring(0, 4) + "..." + value.substring(value.length - 4)
    }
    return value
  }

  const getStatus = (value: string | undefined) => {
    if (!value) return "missing"
    if (value === "your-project-id" || value === "not set" || value === "undefined") return "placeholder"
    return "set"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "set":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "placeholder":
        return <XCircle className="w-4 h-4 text-yellow-500" />
      case "missing":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const requiredVars = ["NEXT_PUBLIC_SANITY_PROJECT_ID", "NEXT_PUBLIC_SANITY_DATASET", "SANITY_API_TOKEN"]

  const allRequiredSet = requiredVars.every((key) => {
    const value = allEnvVars[key as keyof typeof allEnvVars]
    return value && value !== "undefined" && value !== "your-project-id"
  })

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              Environment Variables Debug
              {allRequiredSet ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </CardTitle>
            <CardDescription className="text-gray-400">Complete environment variable analysis</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowValues(!showValues)}
              className="border-gray-700 text-gray-300"
            >
              {showValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="border-gray-700 text-gray-300"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Environment Detection */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold">Environment Detection</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600">{typeof window !== "undefined" ? "Client" : "Server"}</Badge>
              <span className="text-gray-300">Render Context</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={process.env.NODE_ENV === "production" ? "bg-red-600" : "bg-green-600"}>
                {process.env.NODE_ENV || "unknown"}
              </Badge>
              <span className="text-gray-300">Node Environment</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-600">{process.env.VERCEL ? "Vercel" : "Local"}</Badge>
              <span className="text-gray-300">Platform</span>
            </div>
          </div>
        </div>

        {/* Required Variables */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold">Required Variables</h4>
          {requiredVars.map((key) => {
            const value = allEnvVars[key as keyof typeof allEnvVars]
            const status = getStatus(value)
            return (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status)}
                  <span className="text-white font-mono text-sm">{key}</span>
                  {key === "NEXT_PUBLIC_SANITY_PROJECT_ID" && <Badge className="bg-blue-600 text-xs">Public</Badge>}
                  {key === "NEXT_PUBLIC_SANITY_DATASET" && <Badge className="bg-blue-600 text-xs">Public</Badge>}
                  {key === "SANITY_API_TOKEN" && <Badge className="bg-red-600 text-xs">Private</Badge>}
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      status === "set"
                        ? "bg-green-100 text-green-800"
                        : status === "placeholder"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {status}
                  </Badge>
                  <span className="text-gray-400 font-mono text-xs max-w-xs truncate">{maskValue(value)}</span>
                  {value && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(value, key)}
                      className="p-1 h-auto"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* All Sanity Variables */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold">All Sanity-Related Variables</h4>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {Object.entries(allEnvVars)
              .filter(([key]) => !requiredVars.includes(key))
              .map(([key, value]) => {
                const status = getStatus(value)
                return (
                  <div key={key} className="flex items-center justify-between p-2 bg-gray-800 rounded text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      <span className="text-gray-300 font-mono">{key}</span>
                    </div>
                    <span className="text-gray-500 font-mono text-xs">{maskValue(value)}</span>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold">Troubleshooting</h4>
          <div className="bg-gray-800 p-4 rounded-lg space-y-2 text-sm text-gray-300">
            {!allRequiredSet && (
              <div className="space-y-2">
                <p className="text-red-400 font-semibold">❌ Missing Required Variables</p>
                {requiredVars.map((key) => {
                  const value = allEnvVars[key as keyof typeof allEnvVars]
                  const status = getStatus(value)
                  if (status !== "set") {
                    return (
                      <p key={key} className="ml-4">
                        • <code className="bg-gray-700 px-1 rounded">{key}</code> is {status}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
            )}

            <div className="space-y-1">
              <p className="font-semibold">Common Issues:</p>
              <p>• Variable names must match exactly (case-sensitive)</p>
              <p>• NEXT_PUBLIC_ variables are visible in browser</p>
              <p>• Private variables (SANITY_API_TOKEN) only work server-side</p>
              <p>• Restart dev server after changing .env.local</p>
              <p>• Redeploy after changing Vercel environment variables</p>
            </div>

            <div className="space-y-1">
              <p className="font-semibold">Expected Values:</p>
              <p>• NEXT_PUBLIC_SANITY_PROJECT_ID: "abc123def" (your project ID)</p>
              <p>• NEXT_PUBLIC_SANITY_DATASET: "production" (or your dataset name)</p>
              <p>• SANITY_API_TOKEN: "sk..." (starts with sk, long string)</p>
            </div>
          </div>
        </div>

        {copied && <div className="text-green-400 text-sm">✅ Copied {copied} to clipboard</div>}
      </CardContent>
    </Card>
  )
}
