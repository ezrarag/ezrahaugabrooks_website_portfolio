
import { streamText } from "ai"
import { openrouter } from "@openrouter/ai-sdk-provider"

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
    // Use the official OpenRouter provider for the Vercel AI SDK
    return await streamText({
      model: openrouter.chat('mistralai/mistral-7b-instruct'),
      system: systemMessage,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })
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
  
  // All providers now use streamText except Grok (which already does)
  return await provider.generateResponse(messages, systemMessage)
}
