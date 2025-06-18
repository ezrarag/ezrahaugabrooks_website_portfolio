import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on our updated schema
export interface ChatConversation {
  id: string
  visitor_id?: string
  visitor_email?: string
  visitor_name?: string
  status: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  conversation_id: string
  role: "user" | "assistant" | "system"
  content: string
  metadata?: any
  created_at: string
}

export interface DocumentAnalysis {
  id: string
  conversation_id?: string
  filename: string
  file_content?: string
  analysis?: string | any // Can be JSON object or text
  purpose?: string // New field for CV purpose
  output?: string // New field for generated CV
  metadata?: any // New JSONB field for additional data
  created_at: string
}

export interface AppointmentRequest {
  id: string
  conversation_id: string
  visitor_name?: string
  visitor_email?: string
  requested_date?: string
  message?: string
  status: string
  created_at: string
}

export interface WorkInquiry {
  id: string
  conversation_id: string
  visitor_name?: string
  visitor_email?: string
  project_type?: string
  budget_range?: string
  timeline?: string
  description?: string
  status: string
  created_at: string
}

// Helper functions for document analysis operations
export const documentAnalysisHelpers = {
  // Create a new document analysis
  async create(data: Partial<DocumentAnalysis>) {
    const { data: result, error } = await supabase.from("document_analyses").insert(data).select().single()

    if (error) throw error
    return result
  },

  // Update an existing document analysis
  async update(id: string, data: Partial<DocumentAnalysis>) {
    const { data: result, error } = await supabase.from("document_analyses").update(data).eq("id", id).select().single()

    if (error) throw error
    return result
  },

  // Get document analysis by ID
  async getById(id: string) {
    const { data, error } = await supabase.from("document_analyses").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  // Get all document analyses for a conversation
  async getByConversation(conversationId: string) {
    const { data, error } = await supabase
      .from("document_analyses")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  // Get recent document analyses
  async getRecent(limit = 10) {
    const { data, error } = await supabase
      .from("document_analyses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },
}
