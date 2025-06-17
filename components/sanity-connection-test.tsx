"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, RefreshCw, Database } from "lucide-react"
import { client } from "@/lib/sanity"

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
  const [isManualTest, setIsManualTest] = useState(false)

  const runConnectionTest = async () => {
    setTestResult({ status: "testing", message: "Testing Sanity connection..." })
    setIsManualTest(true)

    try {
      // Test 1: Basic connection
      console.log("Testing basic Sanity connection...")
      const basicTest = await client.fetch('*[_type == "musicianWork"] | order(_createdAt desc) [0...1]')
      console.log("Basic connection test result:", basicTest)

      // Test 2: Count documents
      console.log("Counting documents...")
      const count = await client.fetch('count(*[_type == "musicianWork"])')
      console.log("Document count:", count)

      // Test 3: Test schema structure
      console.log("Testing schema structure...")
      const schemaTest = await client.fetch(`
        *[_type == "musicianWork"] [0] {
          _id,
          title,
          description,
          type,
          mediaType,
          "hasMediaFile": defined(mediaFile),
          "hasExternalUrl": defined(externalVideoUrl),
          "hasThumbnail": defined(thumbnail),
          tags,
          dateCompleted,
          featured,
          cvInclude
        }
      `)
      console.log("Schema test result:", schemaTest)

      // Test 4: Asset URL generation
      if (schemaTest && (schemaTest.hasMediaFile || schemaTest.hasThumbnail)) {
        console.log("Testing asset URL generation...")
        const assetTest = await client.fetch(`
          *[_type == "musicianWork" && (defined(mediaFile) || defined(thumbnail))] [0] {
            "mediaUrl": select(
              mediaFile.asset != null => mediaFile.asset->url,
              externalVideoUrl != null => externalVideoUrl,
              null
            ),
            "thumbnailUrl": select(
              thumbnail.asset != null => thumbnail.asset->url,
              null
            )
          }
        `)
        console.log("Asset URL test result:", assetTest)
      }

      setTestResult({
        status: "success",
        message: `✅ Connection successful! Found ${count} music works in your Sanity dataset.`,
        details: {
          documentCount: count,
          hasDocuments: count > 0,
          sampleDocument: schemaTest,
          basicConnection: true,
        },
      })
    } catch (error) {
      console.error("Sanity connection test failed:", error)

      let errorMessage = "Connection failed"
      const details: any = { error: error }

      if (error instanceof Error) {
        if (error.message.includes("projectId")) {
          errorMessage = "❌ Invalid Project ID - Check NEXT_PUBLIC_SANITY_PROJECT_ID"
        } else if (error.message.includes("dataset")) {
          errorMessage = "❌ Invalid Dataset - Check NEXT_PUBLIC_SANITY_DATASET"
        } else if (error.message.includes("token")) {
          errorMessage = "❌ Invalid API Token - Check SANITY_API_TOKEN"
        } else if (error.message.includes("Unauthorized")) {
          errorMessage = "❌ Unauthorized - Check your API token permissions"
        } else if (error.message.includes("Not found")) {
          errorMessage = "❌ Project or dataset not found - Verify your credentials"
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

  // Auto-run test on component mount
  useEffect(() => {
    if (!isManualTest) {
      runConnectionTest()
    }
  }, [])

  const envVars = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    hasToken: !!process.env.SANITY_API_TOKEN,
    hasReadToken: !!process.env.SANITY_API_TOKEN_READ,
  }

  return (
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
        {/* Environment Variables Status */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold">Environment Variables</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              {envVars.projectId ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm text-gray-300">Project ID: {envVars.projectId || "Missing"}</span>
            </div>
            <div className="flex items-center gap-2">
              {envVars.dataset ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm text-gray-300">Dataset: {envVars.dataset || "Missing"}</span>
            </div>
            <div className="flex items-center gap-2">
              {envVars.hasToken ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm text-gray-300">API Token: {envVars.hasToken ? "Set" : "Missing"}</span>
            </div>
            <div className="flex items-center gap-2">
              {envVars.hasReadToken ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm text-gray-300">Read Token: {envVars.hasReadToken ? "Set" : "Missing"}</span>
            </div>
          </div>
        </div>

        {/* Connection Test Result */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-semibold">Connection Test</h4>
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

            {testResult.details && testResult.status === "success" && (
              <div className="mt-3 space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">Documents: {testResult.details.documentCount}</Badge>
                  {testResult.details.hasDocuments && <Badge className="bg-blue-600">Schema: Valid</Badge>}
                </div>
                {testResult.details.sampleDocument && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-gray-400 hover:text-white">
                      View sample document structure
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-800 rounded text-xs overflow-auto">
                      {JSON.stringify(testResult.details.sampleDocument, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}

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
        </div>

        {/* Quick Actions */}
        {testResult.status === "error" && (
          <div className="space-y-3">
            <h4 className="text-white font-semibold">Quick Fixes</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• Check your .env.local file is in the project root</p>
              <p>• Restart your development server after changing environment variables</p>
              <p>• Verify your Sanity project is published and accessible</p>
              <p>• Ensure your API token has "Viewer" permissions</p>
              <p>• Check that your dataset name is correct (usually "production")</p>
            </div>
          </div>
        )}

        {testResult.status === "success" && testResult.details?.documentCount === 0 && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-400 font-semibold mb-2">No Content Found</h4>
            <p className="text-gray-300 text-sm">
              Your Sanity connection is working, but no music works were found. Add some content to your Sanity Studio
              to see it here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
