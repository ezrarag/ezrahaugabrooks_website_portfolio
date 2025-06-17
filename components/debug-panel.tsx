"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Eye, EyeOff } from "lucide-react"

export function DebugPanel() {
  const [showTokens, setShowTokens] = useState(false)

  const envVars = {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    SANITY_API_TOKEN_READ: process.env.SANITY_API_TOKEN_READ,
  }

  const getStatus = (value: string | undefined) => {
    if (!value) return "missing"
    if (value === "your-project-id" || value === "not set") return "placeholder"
    return "set"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "set":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "placeholder":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "missing":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "set":
        return "bg-green-100 text-green-800"
      case "placeholder":
        return "bg-yellow-100 text-yellow-800"
      case "missing":
        return "bg-red-100 text-red-800"
      default:
        return "bg-red-100 text-red-800"
    }
  }

  const maskValue = (value: string | undefined, key: string) => {
    if (!value) return "Not set"
    if (key.includes("TOKEN") && !showTokens) {
      return value.substring(0, 8) + "..." + value.substring(value.length - 4)
    }
    return value
  }

  const allSet = Object.values(envVars).every((val) => val && val !== "your-project-id" && val !== "not set")

  return (
    <Card className="bg-gray-900 border-gray-800 mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              Environment Variables Debug
              {allSet ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
            </CardTitle>
            <CardDescription className="text-gray-400">Check your Sanity integration configuration</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTokens(!showTokens)}
            className="border-gray-700 text-gray-300"
          >
            {showTokens ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(envVars).map(([key, value]) => {
          const status = getStatus(value)
          return (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(status)}
                <span className="text-white font-mono text-sm">{key}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(status)}>{status}</Badge>
                <span className="text-gray-400 font-mono text-xs max-w-xs truncate">{maskValue(value, key)}</span>
              </div>
            </div>
          )
        })}

        {!allSet && (
          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <h4 className="text-yellow-400 font-semibold mb-2">Setup Required</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>To use Sanity CMS integration, you need to:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>
                  Create a Sanity project at{" "}
                  <a href="https://sanity.io" className="text-blue-400 underline">
                    sanity.io
                  </a>
                </li>
                <li>Get your Project ID from the project dashboard</li>
                <li>Create an API token with read permissions</li>
                <li>Update your .env.local file with these values</li>
              </ol>
            </div>
          </div>
        )}

        {allSet && (
          <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <h4 className="text-green-400 font-semibold mb-2">Configuration Complete</h4>
            <p className="text-gray-300 text-sm">
              All environment variables are set. The Sanity integration should work properly.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
