import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { documentAnalysisHelpers } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { documentId, purpose, analysisData } = await request.json()

    if (!documentId || !purpose || !analysisData) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Generate tailored CV content using AI
    const cvGeneration = await generateText({
      model: xai("grok-beta"),
      prompt: `You are an expert CV writer. Create a tailored CV based on the following:

**Purpose/Target:** ${purpose}

**Candidate Data:**
${JSON.stringify(analysisData, null, 2)}

**Instructions:**
1. Tailor the CV specifically for the stated purpose
2. Highlight relevant skills and experience
3. Reorder sections to emphasize what's most important for this role
4. Rewrite descriptions to match the target opportunity
5. Use industry-appropriate keywords
6. Keep it professional and concise
7. Format as clean HTML that can be converted to PDF

**Output Format:**
Return a JSON object with:
{
  "content": "Full CV content as clean HTML",
  "preview": "HTML preview with styling for display",
  "summary": "Brief summary of changes made for this purpose"
}

Make sure the HTML is well-structured with proper headings, sections, and formatting.`,
      temperature: 0.4,
      maxTokens: 3000,
    })

    let generatedCV
    try {
      generatedCV = JSON.parse(cvGeneration.text)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      generatedCV = {
        content: cvGeneration.text,
        preview: `<div class="cv-preview">${cvGeneration.text}</div>`,
        summary: "CV generated successfully",
      }
    }

    // Update the document analysis with the generated CV using our helper
    await documentAnalysisHelpers.update(documentId, {
      purpose,
      output: generatedCV.content,
      metadata: {
        purpose,
        generated_cv: generatedCV,
        generated_at: new Date().toISOString(),
        generation_summary: generatedCV.summary,
      },
    })

    return NextResponse.json({
      success: true,
      content: generatedCV.content,
      preview: generatedCV.preview,
      summary: generatedCV.summary,
    })
  } catch (error) {
    console.error("CV generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate CV",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
