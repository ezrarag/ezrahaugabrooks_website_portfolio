import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { content, filename } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 })
    }

    // For now, we'll return the HTML content as a downloadable file
    // In a production environment, you'd use a library like puppeteer or html-pdf
    // to convert HTML to PDF

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Generated CV</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; }
        h3 { color: #7f8c8d; }
        .section { margin-bottom: 25px; }
        .experience-item, .education-item { margin-bottom: 20px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill { background: #ecf0f1; padding: 4px 8px; border-radius: 4px; font-size: 14px; }
        ul { padding-left: 20px; }
        li { margin-bottom: 5px; }
    </style>
</head>
<body>
    ${content}
</body>
</html>`

    // Create a blob response
    const blob = new Blob([htmlContent], { type: "text/html" })

    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename || "cv.html"}"`,
      },
    })
  } catch (error) {
    console.error("CV download error:", error)
    return NextResponse.json({ error: "Failed to generate download" }, { status: 500 })
  }
}
