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

export interface DeveloperProject {
  id: string
  title: string
  subtitle?: string
  description?: string
  image_url?: string
  project_url?: string
  github_url?: string
  technologies: string[]
  status: string
  featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface LinguistProject {
  id: string
  title: string
  subtitle?: string
  description?: string
  image_url?: string
  project_url?: string
  languages: string[]
  project_type?: string
  status: string
  featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface MusicProject {
  id: string
  title: string
  subtitle?: string
  description?: string
  media_url?: string
  media_type: string
  role?: string
  composer?: string
  duration?: string
  date?: string
  location?: string
  event?: string
  instruments?: string[]
  genre?: string
  featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface EducatorProject {
  id: string
  title: string
  subtitle?: string
  description?: string
  image_url?: string
  course_url?: string
  institution?: string
  student_count?: number
  rating?: number
  duration?: string
  level?: string
  topics: string[]
  status: string
  featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  filename: string
  url: string
  analysis: any
  created_at: string
  updated_at: string
  metadata: {
    contentType: string
    tags?: string[]
    fileSize?: number
    uploadedAt?: string
  }
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

// Helper functions for portfolio operations
export const portfolioHelpers = {
  // Developer Projects
  async getDeveloperProjects(featuredOnly = false) {
    let query = supabase.from("developer_projects").select("*")
    
    if (featuredOnly) {
      query = query.eq("featured", true)
    }
    
    const { data, error } = await query.order("sort_order", { ascending: true })
    
    if (error) throw error
    return data
  },

  async createDeveloperProject(project: Partial<DeveloperProject>) {
    const { data, error } = await supabase
      .from("developer_projects")
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Linguist Projects
  async getLinguistProjects(featuredOnly = false) {
    let query = supabase.from("linguist_projects").select("*")
    
    if (featuredOnly) {
      query = query.eq("featured", true)
    }
    
    const { data, error } = await query.order("sort_order", { ascending: true })
    
    if (error) throw error
    return data
  },

  async createLinguistProject(project: Partial<LinguistProject>) {
    const { data, error } = await supabase
      .from("linguist_projects")
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Music Projects
  async getMusicProjects(featuredOnly = false) {
    let query = supabase.from("music_projects").select("*")
    
    if (featuredOnly) {
      query = query.eq("featured", true)
    }
    
    const { data, error } = await query.order("sort_order", { ascending: true })
    
    if (error) throw error
    return data
  },

  async createMusicProject(project: Partial<MusicProject>) {
    const { data, error } = await supabase
      .from("music_projects")
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Educator Projects
  async getEducatorProjects(featuredOnly = false) {
    let query = supabase.from("educator_projects").select("*")
    
    if (featuredOnly) {
      query = query.eq("featured", true)
    }
    
    const { data, error } = await query.order("sort_order", { ascending: true })
    
    if (error) throw error
    return data
  },

  async createEducatorProject(project: Partial<EducatorProject>) {
    const { data, error } = await supabase
      .from("educator_projects")
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data
  },
}
