"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, RefreshCw, Database, AlertTriangle } from "lucide-react"
import { client } from "@/lib/sanity"
import { EnvDebug } from "./env-debug"

interface ConnectionTestResult {
  status: "testing" | "success" | "error"
  message: string
  details?: any
}

export function SanityConnectionTest() {
  const [testResult, setTestResult] = useState<ConnectionTestResult>({
    status: "testing",
    message: "Initializing connection test...",
  })
  const [showEnvDebug, setShowEnvDebug] = useState(false)

  const runConnectionTest = async () => {
    setTestResult({ status: "testing", message: "Testing Sanity connection..." })

    try {
      // First check if we have the basic requirements
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
      const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN_READ

      console.log("Environment check:", {
        projectId: projectId ? "set" : "missing",
        dataset: dataset ? "set" : "missing",
        token: token ? "set" : "missing",
        nodeEnv: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL,
      })

      if (!projectId) {
        throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is missing")
      }
      if (!dataset) {
        throw new Error("NEXT_PUBLIC_SANITY_DATASET is missing")
      }

      // Test basic connection
      console.log("Testing basic Sanity connection...")
      const basicTest = await client.fetch('*[_type == "musicianWork"] | order(_createdAt desc) [0...1]')
      console.log("Basic connection test result:", basicTest)

      // Count documents
      console.log("Counting documents...")
      const count = await client.fetch('count(*[_type == "musicianWork"])')
      console.log("Document count:", count)

      setTestResult({
        status: "success",
        message: `✅ Connection successful! Found ${count} music works in your Sanity dataset.`,
        details: {
          documentCount: count,
          hasDocuments: count > 0,
          projectId: projectId,
          dataset: dataset,
          hasToken: !!token,
        },
      })
    } catch (error) {
      console.error("Sanity connection test failed:", error)

      let errorMessage = "Connection failed"
      const details: any = { error: error }

      if (error instanceof Error) {
        if (error.message.includes("NEXT_PUBLIC_SANITY_PROJECT_ID")) {
          errorMessage = "❌ NEXT_PUBLIC_SANITY_PROJECT_ID is missing or invalid"
        } else if (error.message.includes("NEXT_PUBLIC_SANITY_DATASET")) {
          errorMessage = "❌ NEXT_PUBLIC_SANITY_DATASET is missing or invalid"
        } else if (error.message.includes("projectId")) {
          errorMessage = "❌ Invalid Project ID - Check your Sanity project settings"
        } else if (error.message.includes("dataset")) {
          errorMessage = "❌ Invalid Dataset - Check your dataset name"
        } else if (error.message.includes("token") || error.message.includes("Unauthorized")) {
          errorMessage = "❌ API Token issue - Check token permissions"
        } else if (error.message.includes("Not found")) {
          errorMessage = "❌ Project or dataset not found"
        } else {
          errorMessage = `❌ ${error.message}`
        }

        details.errorType = error.name
        details.errorMessage = error.message
      }

      setTestResult({
        status: "error",
        message: errorMessage,
        details,
      })
    }
  }

  useEffect(() => {
    runConnectionTest()
  }, [])

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-5 h-5" />
            Sanity Connection Test
            {testResult.status === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
            {testResult.status === "error" && <XCircle className="w-5 h-5 text-red-500" />}
            {testResult.status === "testing" && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
          </CardTitle>
          <CardDescription className="text-gray-400">Testing connection to your Sanity CMS project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge
                className={
                  testResult.status === "success"
                    ? "bg-green-600"
                    : testResult.status === "error"
                      ? "bg-red-600"
                      : "bg-blue-600"
                }
              >
                {testResult.status === "success" ? "Connected" : testResult.status === "error" ? "Failed" : "Testing"}
              </Badge>
              {testResult.details?.documentCount !== undefined && (
                <Badge className="bg-gray-600">{testResult.details.documentCount} documents</Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEnvDebug(!showEnvDebug)}
                className="border-gray-700 text-gray-300"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                {showEnvDebug ? "Hide" : "Show"} Debug
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={runConnectionTest}
                disabled={testResult.status === "testing"}
                className="border-gray-700 text-gray-300"
              >
                {testResult.status === "testing" ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {testResult.status === "testing" ? "Testing..." : "Retest"}
              </Button>
            </div>
          </div>

          {/* Test Result */}
          <div
            className={`p-4 rounded-lg border ${
              testResult.status === "success"
                ? "bg-green-900/20 border-green-500/30"
                : testResult.status === "error"
                  ? "bg-red-900/20 border-red-500/30"
                  : "bg-blue-900/20 border-blue-500/30"
            }`}
          >
            <p
              className={`font-medium ${
                testResult.status === "success"
                  ? "text-green-400"
                  : testResult.status === "error"
                    ? "text-red-400"
                    : "text-blue-400"
              }`}
            >
              {testResult.message}
            </p>

            {testResult.details && testResult.status === "error" && (
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-red-300">Error Details:</p>
                <div className="bg-gray-800 p-2 rounded text-xs">
                  <p>
                    <strong>Type:</strong> {testResult.details.errorType}
                  </p>
                  <p>
                    <strong>Message:</strong> {testResult.details.errorMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Environment Debug Panel */}
      {showEnvDebug && <EnvDebug />}
    </div>
  )
}
