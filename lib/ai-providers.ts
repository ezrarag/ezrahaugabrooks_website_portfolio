
export interface AIProvider {
  name: string
  generateResponse(messages: any[], systemMessage: string): Promise<any>
}

export class OpenAIProvider implements AIProvider {
  name = 'openai'
  
  async generateResponse(messages: any[], systemMessage: string) {
    // Stub for OpenAI - will be implemented when API key is added
    throw new Error('OpenAI provider not configured. Please add OPENAI_API_KEY environment variable.')
  }
}

export class GrokProvider implements AIProvider {
  name = 'grok'
  
  async generateResponse(messages: any[], systemMessage: string) {
    // Import the existing xai integration
    const { streamText } = await import("ai")
    const { xai } = await import("@ai-sdk/xai")
    
    if (!process.env.XAI_API_KEY) {
      throw new Error('Grok provider not configured. Please add XAI_API_KEY environment variable.')
    }
    
    return await streamText({
      model: xai("grok-beta"),
      system: systemMessage,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })
  }
}

export class OpenRouterProvider implements AIProvider {
  name = 'openrouter'
  
  async generateResponse(messages: any[], systemMessage: string) {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      throw new Error('OpenRouter provider not configured. Please add OPENROUTER_API_KEY environment variable.')
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Ezra AI Assistant'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          { role: 'system', content: systemMessage },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: true
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
    }

    return response
  }
}

export class HuggingFaceProvider implements AIProvider {
  name = 'huggingface'
  
  async generateResponse(messages: any[], systemMessage: string) {
    const apiKey = process.env.HUGGINGFACE_API_KEY
    if (!apiKey) {
      throw new Error('Hugging Face provider not configured. Please add HUGGINGFACE_API_KEY environment variable.')
    }

    // Format messages for Hugging Face
    const prompt = [
      systemMessage,
      ...messages.map((m: any) => `${m.role}: ${m.content}`)
    ].join('\n\n')

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          return_full_text: false
        },
        stream: true
      })
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`)
    }

    return response
  }
}

export function getAIProvider(): AIProvider {
  const providerName = process.env.AI_PROVIDER || 'openrouter'
  
  console.log(`🤖 AI Provider: ${providerName}`)
  console.log(`🔑 Available Environment Variables:`, {
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    XAI_API_KEY: !!process.env.XAI_API_KEY,
    OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
    HUGGINGFACE_API_KEY: !!process.env.HUGGINGFACE_API_KEY
  })
  
  switch (providerName.toLowerCase()) {
    case 'openai':
      return new OpenAIProvider()
    case 'grok':
      return new GrokProvider()
    case 'openrouter':
      return new OpenRouterProvider()
    case 'huggingface':
      return new HuggingFaceProvider()
    default:
      console.warn(`Unknown AI provider: ${providerName}. Defaulting to OpenRouter.`)
      return new OpenRouterProvider()
  }
}

// Helper function to convert streaming responses to the format expected by the frontend
export async function createStreamResponse(provider: AIProvider, messages: any[], systemMessage: string) {
  const providerName = provider.name
  
  if (providerName === 'grok') {
    // Use existing streamText for Grok
    return await provider.generateResponse(messages, systemMessage)
  }
  
  // For other providers, we need to create a custom stream
  const response = await provider.generateResponse(messages, systemMessage)
  
  if (providerName === 'openrouter') {
    return createOpenRouterStream(response)
  }
  
  if (providerName === 'huggingface') {
    return createHuggingFaceStream(response)
  }
  
  throw new Error(`Unsupported provider for streaming: ${providerName}`)
}

async function createOpenRouterStream(response: Response) {
  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')

  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = new TextDecoder().decode(value)
          const lines = chunk.split('\n').filter(line => line.trim())
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              
              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`))
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } finally {
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}

async function createHuggingFaceStream(response: Response) {
  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          buffer += new TextDecoder().decode(value)
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              try {
                const parsed = JSON.parse(data)
                const content = parsed.generated_text || parsed.token?.text
                if (content) {
                  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`))
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } finally {
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}
