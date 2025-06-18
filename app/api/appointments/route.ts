import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { conversationId, visitorName, visitorEmail, requestedDate, message } = await request.json()

    const { data: appointment, error } = await supabase
      .from("appointment_requests")
      .insert({
        conversation_id: conversationId,
        visitor_name: visitorName,
        visitor_email: visitorEmail,
        requested_date: requestedDate,
        message: message,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, appointment })
  } catch (error) {
    console.error("Appointment creation error:", error)
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data: appointments, error } = await supabase
      .from("appointment_requests")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error("Appointments fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}
