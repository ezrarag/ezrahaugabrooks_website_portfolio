import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { conversationId, visitorName, visitorEmail, projectType, budgetRange, timeline, description } =
      await request.json()

    const { data: inquiry, error } = await supabase
      .from("work_inquiries")
      .insert({
        conversation_id: conversationId,
        visitor_name: visitorName,
        visitor_email: visitorEmail,
        project_type: projectType,
        budget_range: budgetRange,
        timeline: timeline,
        description: description,
        status: "new",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, inquiry })
  } catch (error) {
    console.error("Inquiry creation error:", error)
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data: inquiries, error } = await supabase
      .from("work_inquiries")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error("Inquiries fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
  }
}
