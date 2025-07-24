
export function validateChatEnv() {
  const required = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  return required
}

export function validateAIProvider() {
  const provider = process.env.AI_PROVIDER || 'openrouter'
  const providerConfigs = {
    openai: process.env.OPENAI_API_KEY,
    grok: process.env.XAI_API_KEY,
    openrouter: process.env.OPENROUTER_API_KEY,
    huggingface: process.env.HUGGINGFACE_API_KEY
  }

  const apiKey = providerConfigs[provider as keyof typeof providerConfigs]
  
  return {
    provider,
    configured: !!apiKey,
    availableProviders: Object.entries(providerConfigs)
      .filter(([_, key]) => !!key)
      .map(([name]) => name)
  }
}

export function getChatConfig() {
  try {
    const baseConfig = validateChatEnv()
    const aiConfig = validateAIProvider()
    return { ...baseConfig, ai: aiConfig }
  } catch (error) {
    console.error('Chat configuration error:', error)
    return null
  }
}
