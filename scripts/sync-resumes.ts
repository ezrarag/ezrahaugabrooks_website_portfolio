#!/usr/bin/env tsx

import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import * as fs from "fs"
import * as path from "path"
import * as os from "os"

// Import types from existing supabase client
import { supabase as supabaseClient, type Resume, type ChatConversation, type DocumentAnalysis } from "../lib/supabase"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to analyze resume content with Grok
async function analyzeResume(filename: string, content: string): Promise<any> {
  console.log(`Analyzing resume: ${filename}`)
  
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

  try {
    return JSON.parse(analysis.text)
  } catch (parseError) {
    console.warn(`Failed to parse JSON for ${filename}, using raw text`)
    return {
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
      rawAnalysis: analysis.text
    }
  }
}

// Helper function to extract tags from analysis
function extractTags(analysis: any): string[] {
  const tags: string[] = []
  
  if (analysis.primaryField) {
    tags.push(analysis.primaryField)
  }
  
  if (analysis.experienceLevel) {
    tags.push(analysis.experienceLevel)
  }
  
  if (analysis.skills && Array.isArray(analysis.skills)) {
    tags.push(...analysis.skills.slice(0, 5)) // Top 5 skills
  }
  
  return tags
}

// Main sync function
async function syncResumes() {
  console.log("Starting resume sync...")
  
  try {
    // 1. List all files in the resumes bucket
    console.log("Listing files in resumes bucket...")
    const { data: files, error: listError } = await supabase.storage
      .from("resumes")
      .list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" }
      })

    if (listError) {
      throw new Error(`Failed to list files: ${listError.message}`)
    }

    if (!files || files.length === 0) {
      console.log("No files found in resumes bucket")
      return
    }

    console.log(`Found ${files.length} files in resumes bucket`)

    // 2. Process each file
    for (const file of files) {
      try {
        console.log(`Processing file: ${file.name}`)
        
        // Check if resume already exists in database
        const { data: existingResume } = await supabase
          .from("resumes")
          .select("id")
          .eq("filename", file.name)
          .single()

        if (existingResume) {
          console.log(`Resume ${file.name} already exists, skipping...`)
          continue
        }

        // Download the file
        const { data: fileData, error: downloadError } = await supabase.storage
          .from("resumes")
          .download(file.name)

        if (downloadError) {
          console.error(`Failed to download ${file.name}:`, downloadError)
          continue
        }

        // Convert file to text content
        let content = ""
        if (file.metadata?.mimetype === "text/plain") {
          content = await fileData.text()
        } else if (file.metadata?.mimetype === "application/pdf") {
          // For PDFs, we'll need to implement PDF parsing
          // For now, we'll skip PDFs or use a placeholder
          console.log(`PDF parsing not implemented for ${file.name}, skipping...`)
          continue
        } else if (file.metadata?.mimetype?.includes("word")) {
          // For DOCX files, we'll need to implement DOCX parsing
          console.log(`DOCX parsing not implemented for ${file.name}, skipping...`)
          continue
        } else {
          // Try to decode as text
          try {
            content = await fileData.text()
          } catch (e) {
            console.error(`Failed to read content from ${file.name}:`, e)
            continue
          }
        }

        // Analyze the resume content
        const analysis = await analyzeResume(file.name, content)

        // Generate public URL
        const { data: urlData } = supabase.storage
          .from("resumes")
          .getPublicUrl(file.name)

        const publicUrl = urlData.publicUrl

        // Extract tags from analysis
        const tags = extractTags(analysis)

        // Create resume record
        const { data: resume, error: resumeError } = await supabase
          .from("resumes")
          .insert({
            filename: file.name,
            url: publicUrl,
            analysis: analysis,
            metadata: {
              contentType: file.metadata?.mimetype || "unknown",
              tags: tags,
              fileSize: file.metadata?.size || 0,
              uploadedAt: file.created_at
            }
          })
          .select()
          .single()

        if (resumeError) {
          console.error(`Failed to insert resume ${file.name}:`, resumeError)
          continue
        }

        // Create a new chat conversation for this resume
        const { data: conversation, error: conversationError } = await supabase
          .from("chat_conversations")
          .insert({
            visitor_name: analysis.personalInfo?.name || "Resume Upload",
            status: "active"
          })
          .select()
          .single()

        if (conversationError) {
          console.error(`Failed to create conversation for ${file.name}:`, conversationError)
          continue
        }

        // Create document analysis record
        const { data: documentAnalysis, error: docAnalysisError } = await supabase
          .from("document_analyses")
          .insert({
            conversation_id: conversation.id,
            filename: file.name,
            file_content: content.substring(0, 10000), // Store first 10k chars
            analysis: analysis,
            purpose: "resume_analysis",
            metadata: {
              file_type: file.metadata?.mimetype || "unknown",
              file_size: file.metadata?.size || 0,
              processed_at: new Date().toISOString(),
              processing_type: "resume_sync",
              resume_id: resume.id
            }
          })
          .select()
          .single()

        if (docAnalysisError) {
          console.error(`Failed to create document analysis for ${file.name}:`, docAnalysisError)
          continue
        }

        console.log(`Successfully processed ${file.name}`)
        console.log(`  - Resume ID: ${resume.id}`)
        console.log(`  - Conversation ID: ${conversation.id}`)
        console.log(`  - Document Analysis ID: ${documentAnalysis.id}`)
        console.log(`  - Tags: ${tags.join(", ")}`)

      } catch (error) {
        console.error(`Error processing ${file.name}:`, error)
        continue
      }
    }

    console.log("Resume sync completed successfully!")

  } catch (error) {
    console.error("Resume sync failed:", error)
    process.exit(1)
  }
}

// Run the sync
if (require.main === module) {
  syncResumes()
    .then(() => {
      console.log("Script completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Script failed:", error)
      process.exit(1)
    })
} 