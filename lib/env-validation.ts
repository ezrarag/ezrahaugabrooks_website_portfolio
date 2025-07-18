
export function validateChatEnv() {
  const required = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    XAI_API_KEY: process.env.XAI_API_KEY
  }

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  return required
}

export function getChatConfig() {
  try {
    return validateChatEnv()
  } catch (error) {
    console.error('Chat configuration error:', error)
    return null
  }
}
