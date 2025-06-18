import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import { client } from "@/lib/sanity"
import { supabase } from "@/lib/supabase"
import type { NextRequest } from "next/server"

// System prompt that makes the AI act as Ezra's assistant
const SYSTEM_PROMPT = `You are Ezra Haugabrooks' AI assistant. You represent Ezra professionally and help visitors with:

**About Ezra:**
- Full-stack developer specializing in React, Next.js, TypeScript, and modern web technologies
- Linguist with expertise in language philosophy, translation, and crypto language projects  
- Composer/Musician creating orchestral, electronic, and collaborative works
- Educator teaching programming, linguistics, and music technology
- Based in Tokyo, Japan
- Works with BEAM Think Tank on collaborative projects

**Your Capabilities:**
1. **Portfolio Discussion** - Answer questions about Ezra's work, skills, and projects
2. **Document Analysis** - When users upload resumes/documents, provide detailed feedback
3. **Appointment Scheduling** - Help schedule meetings and consultations
4. **Project Inquiries** - Discuss potential collaborations and work opportunities

**Special Instructions:**
- When someone wants to schedule a meeting, ask for their name, email, and preferred time
- When someone inquires about work, ask about project type, timeline, and budget
- Always be professional but approachable
- Speak as Ezra's representative with confidence about his capabilities

**Appointment Scheduling Process:**
1. Ask for visitor's name and email
2. Ask for preferred date/time and timezone
3. Ask what they'd like to discuss
4. Confirm the details and let them know Ezra will follow up

**Work Inquiry Process:**
1. Ask about the type of project (development, music, linguistics, education)
2. Ask about timeline and budget range
3. Ask for their contact information
4. Provide relevant examples of Ezra's work
5. Confirm next steps

Remember: You ARE Ezra's representative. Be helpful and professional.`

export async function POST(req: NextRequest) {
  try {
    const { messages, conversationId } = await req.json()

    // Create or get conversation
    let conversation_id = conversationId
    if (!conversation_id) {
      const { data: newConversation, error } = await supabase
        .from("chat_conversations")
        .insert({
          status: "active",
        })
        .select()
        .single()

      if (error) throw error
      conversation_id = newConversation.id
    }

    // Get latest portfolio content from Sanity for context
    const portfolioContext = await client
      .fetch(`
      {
        "musicWorks": *[_type == "musicianWork" && featured == true][0...3] {
          title,
          description,
          type,
          tags
        },
        "totalWorks": count(*[_type == "musicianWork"]),
        "recentWork": *[_type == "musicianWork"] | order(dateCompleted desc)[0] {
          title,
          description,
          dateCompleted
        }
      }
    `)
      .catch(() => null)

    // Enhanced system message with current portfolio context
    const systemMessage = `${SYSTEM_PROMPT}

**Current Portfolio Context:**
${
  portfolioContext
    ? `
- Total musical works: ${portfolioContext.totalWorks}
- Recent work: "${portfolioContext.recentWork?.title}" (${portfolioContext.recentWork?.dateCompleted})
- Featured works: ${portfolioContext.musicWorks?.map((w: any) => w.title).join(", ")}
`
    : "Portfolio data loading..."
}

Current date: ${new Date().toLocaleDateString()}
Conversation ID: ${conversation_id}`

    const result = await streamText({
      model: xai("grok-beta"),
      system: systemMessage,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Store the conversation messages
    const lastMessage = messages[messages.length - 1]
    if (lastMessage) {
      await supabase.from("chat_messages").insert({
        conversation_id,
        role: lastMessage.role,
        content: lastMessage.content,
      })
    }

    // Analyze the conversation for special actions
    const conversationText = messages
      .map((m: any) => m.content)
      .join(" ")
      .toLowerCase()

    const isAppointment =
      conversationText.includes("meeting") ||
      conversationText.includes("schedule") ||
      conversationText.includes("appointment") ||
      conversationText.includes("call") ||
      conversationText.includes("zoom")

    const isInquiry =
      conversationText.includes("project") ||
      conversationText.includes("work") ||
      conversationText.includes("hire") ||
      conversationText.includes("collaborate") ||
      conversationText.includes("build") ||
      conversationText.includes("develop")

    const headers = new Headers()
    headers.set("x-conversation-id", conversation_id)

    if (isAppointment) {
      headers.set("x-action-type", "appointment")
    } else if (isInquiry) {
      headers.set("x-action-type", "inquiry")
    }

    return result.toDataStreamResponse({ headers })
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Error processing chat request", { status: 500 })
  }
}
