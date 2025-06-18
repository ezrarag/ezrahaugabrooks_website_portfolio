import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { documentAnalysisHelpers } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string
    const conversationId = formData.get("conversationId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Read file content
    const buffer = await file.arrayBuffer()
    let content = ""

    // Parse different file types
    if (file.type === "application/pdf") {
      // For PDF files, we'll need a PDF parser
      // For now, we'll use a simple text extraction
      content = "PDF parsing would be implemented here with pdf-parse library"
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword"
    ) {
      // For DOCX files, we'll need mammoth or similar
      content = "DOCX parsing would be implemented here with mammoth library"
    } else if (file.type === "text/plain") {
      content = new TextDecoder().decode(buffer)
    } else {
      // Fallback: try to decode as text
      content = new TextDecoder().decode(buffer)
    }

    // Use AI to analyze and structure the resume
    const analysis = await generateText({
      model: xai("grok-beta"),
      prompt: `Analyze this resume/CV content and extract structured information. Return a JSON object with the following structure:

{
  "personalInfo": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "phone number",
    "location": "city, country",
    "linkedin": "linkedin url",
    "website": "personal website"
  },
  "summary": "Professional summary or objective",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start - End",
      "description": "Job description and achievements"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "School Name",
      "year": "Graduation Year",
      "details": "Additional details"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["tech1", "tech2"]
    }
  ],
  "certifications": ["cert1", "cert2"],
  "languages": ["language1", "language2"],
  "experienceLevel": "entry/mid/senior",
  "primaryField": "software development/design/marketing/etc"
}

Resume Content:
${content}

Please extract as much relevant information as possible and structure it properly. If information is missing, use null or empty arrays.`,
      temperature: 0.3,
      maxTokens: 2000,
    })

    let structuredData
    try {
      // Try to parse the AI response as JSON
      structuredData = JSON.parse(analysis.text)
    } catch (parseError) {
      // If JSON parsing fails, create a basic structure
      structuredData = {
        personalInfo: { name: "Unknown" },
        summary: analysis.text.substring(0, 500),
        skills: [],
        experience: [],
        education: [],
        projects: [],
        certifications: [],
        languages: [],
        experienceLevel: "unknown",
        primaryField: "unknown",
      }
    }

    // Store the analysis in the database using our helper
    const documentAnalysis = await documentAnalysisHelpers.create({
      conversation_id: conversationId || null,
      filename: file.name,
      file_content: content.substring(0, 10000), // Store first 10k chars
      analysis: structuredData, // Store as JSONB object
      metadata: {
        file_type: file.type,
        file_size: file.size,
        processed_at: new Date().toISOString(),
        processing_type: type || "resume_analysis",
      },
    })

    return NextResponse.json({
      success: true,
      filename: file.name,
      analysis: structuredData,
      documentId: documentAnalysis.id,
    })
  } catch (error) {
    console.error("Resume parsing error:", error)
    return NextResponse.json(
      {
        error: "Failed to parse resume",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
