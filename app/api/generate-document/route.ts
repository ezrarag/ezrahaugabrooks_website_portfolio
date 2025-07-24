import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

interface AreaData {
  developer: {
    skills: string[]
    experience: string[]
    projects: string[]
  }
  linguist: {
    languages: string[]
    expertise: string[]
    certifications: string[]
  }
  musician: {
    instruments: string[]
    compositions: string[]
    performances: string[]
  }
  educator: {
    subjects: string[]
    teachingExperience: string[]
    curriculum: string[]
  }
}

// Mock data for each area - in a real implementation, this would come from a database
const areaData: AreaData = {
  developer: {
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "PostgreSQL", "AWS", "Docker"],
    experience: [
      "Full-stack development with modern frameworks",
      "API design and implementation",
      "Database design and optimization",
      "Cloud infrastructure management"
    ],
    projects: [
      "Portfolio website with AI integration",
      "E-commerce platform with payment processing",
      "Real-time chat application",
      "Data visualization dashboard"
    ]
  },
  linguist: {
    languages: ["English", "Spanish", "French", "Arabic", "Hebrew", "Latin"],
    expertise: [
      "Translation and interpretation",
      "Linguistic analysis and research",
      "Language teaching and curriculum development",
      "Cross-cultural communication"
    ],
    certifications: [
      "Certified Translator (English-Spanish)",
      "TESOL Certification",
      "Linguistic Research Methods"
    ]
  },
  musician: {
    instruments: ["Piano", "Guitar", "Violin", "Voice", "Digital Audio Workstations"],
    compositions: [
      "Symphony No. 1 in D Minor",
      "Digital Soundscapes (Electronic)",
      "Chamber Quartet in A",
      "BEAM Collaborative Suite"
    ],
    performances: [
      "Solo piano recitals",
      "Chamber music ensembles",
      "Electronic music performances",
      "Collaborative projects with BEAM Think Tank"
    ]
  },
  educator: {
    subjects: ["Computer Science", "Music Theory", "Language Arts", "Mathematics"],
    teachingExperience: [
      "University-level computer science instruction",
      "Music theory and composition workshops",
      "Language learning programs",
      "STEM education curriculum development"
    ],
    curriculum: [
      "Interactive programming courses",
      "Music technology integration",
      "Multilingual education programs",
      "Project-based learning frameworks"
    ]
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, areas } = await request.json()

    if (!type || !areas || !Array.isArray(areas) || areas.length === 0) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Collect data for selected areas
    const selectedData = areas.map(area => ({
      area,
      data: areaData[area as keyof AreaData]
    })).filter(item => item.data)

    // Generate document content using AI
    const documentGeneration = await generateText({
      model: xai("grok-beta") as any,
      prompt: `You are an expert document writer. Create a ${type.toUpperCase()} based on the following areas and data:

**Document Type:** ${type.toUpperCase()}
**Selected Areas:** ${areas.join(", ")}

**Area Data:**
${JSON.stringify(selectedData, null, 2)}

**Instructions:**
1. Create a professional ${type} that highlights the selected areas
2. For RESUME: Focus on concise, targeted content for job applications
3. For CV: Provide comprehensive academic and professional background
4. Use industry-standard formatting and structure
5. Include relevant skills, experience, and achievements
6. Make it visually appealing and well-organized
7. Format as clean HTML that can be converted to PDF

**Output Format:**
Return a JSON object with:
{
  "content": "Full document content as clean HTML",
  "summary": "Brief summary of the document content"
}

Make sure the HTML is well-structured with proper headings, sections, and professional styling.`,
      temperature: 0.3,
    })

    let generatedDocument
    try {
      generatedDocument = JSON.parse(documentGeneration.text)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      generatedDocument = {
        content: documentGeneration.text,
        summary: `${type.toUpperCase()} generated successfully`,
      }
    }

    // Create HTML document with styling
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${type.toUpperCase()} - Ezra Haugabrooks</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #1e40af;
            font-size: 2.5em;
            margin: 0;
            font-weight: 700;
        }
        .header p {
            color: #6b7280;
            font-size: 1.1em;
            margin: 5px 0;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #1e40af;
            border-bottom: 2px solid #dbeafe;
            padding-bottom: 8px;
            margin-bottom: 15px;
            font-size: 1.4em;
        }
        .section h3 {
            color: #374151;
            margin-bottom: 8px;
            font-size: 1.2em;
        }
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }
        .skill {
            background: #dbeafe;
            color: #1e40af;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
        }
        .experience-item, .project-item {
            margin-bottom: 15px;
            padding-left: 20px;
            border-left: 3px solid #e5e7eb;
        }
        .experience-item h4, .project-item h4 {
            color: #374151;
            margin: 0 0 5px 0;
            font-weight: 600;
        }
        .experience-item p, .project-item p {
            color: #6b7280;
            margin: 0;
            font-size: 14px;
        }
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 15px;
            font-size: 14px;
            color: #6b7280;
        }
        .contact-info a {
            color: #2563eb;
            text-decoration: none;
        }
        .contact-info a:hover {
            text-decoration: underline;
        }
        ul {
            padding-left: 20px;
        }
        li {
            margin-bottom: 5px;
        }
        .area-badge {
            display: inline-block;
            background: #fef3c7;
            color: #92400e;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Ezra Haugabrooks</h1>
        <p>${type === "resume" ? "Professional Resume" : "Curriculum Vitae"}</p>
        <div class="contact-info">
            <span>📧 ezra@example.com</span>
            <span>📱 +1 (555) 123-4567</span>
            <span>🌐 linkedin.com/in/ezrahaugabrooks</span>
        </div>
    </div>
    
    ${generatedDocument.content}
    
    <div class="section">
        <h2>Selected Areas</h2>
        <div class="skills">
            ${areas.map(area => `<span class="area-badge">${area}</span>`).join("")}
        </div>
    </div>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
        <p>Generated on ${new Date().toLocaleDateString()} | ${type.toUpperCase()} - Ezra Haugabrooks</p>
    </div>
</body>
</html>`

    // For now, return HTML content
    // In a production environment, you'd use a library like puppeteer or html-pdf to convert to PDF
    const blob = new Blob([htmlContent], { type: "text/html" })

    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${type}-${areas.join("-")}-${Date.now()}.html"`,
      },
    })
  } catch (error) {
    console.error("Document generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate document",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
} 