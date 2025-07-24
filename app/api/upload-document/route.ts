import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const conversationId = formData.get("conversationId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Read file content (for text files, PDFs would need additional processing)
    const buffer = await file.arrayBuffer()
    const content = new TextDecoder().decode(buffer)

    // Use AI to analyze the document
    const analysis = await generateText({
      model: xai("grok-beta"),
      prompt: `Analyze this document (likely a resume/CV) and provide detailed, constructive feedback as Ezra Haugabrooks' AI assistant:

Document: ${file.name}
Content: ${content}

Please provide:
1. **Document Overview** - What type of document this is and its structure
2. **Key Strengths** - Skills, experience, and qualifications that stand out
3. **Technical Skills Analysis** - How their skills align with modern development/creative work
4. **Areas for Improvement** - Specific suggestions for better presentation
5. **Collaboration Potential** - How this person might work with Ezra on projects
6. **Next Steps** - Recommendations for the candidate

Be encouraging, specific, and professional. Focus on actionable feedback.`,
      temperature: 0.3,
      maxTokens: 1000,
    })

    // Store the document analysis in the database
    const { data: documentAnalysis, error } = await supabase
      .from("document_analyses")
      .insert({
        conversation_id: conversationId,
        filename: file.name,
        file_content: content.substring(0, 5000), // Store first 5000 chars
        analysis: analysis.text,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      analysis: analysis.text,
      documentId: documentAnalysis?.id,
    })
  } catch (error) {
    console.error("Document upload error:", error)
    return NextResponse.json({ error: "Failed to process document" }, { status: 500 })
  }
}
