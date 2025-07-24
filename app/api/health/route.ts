
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getChatConfig, validateAIProvider } from '@/lib/env-validation'

export async function GET() {
  const config = getChatConfig()
  const aiStatus = validateAIProvider()
  
  const checks = {
    environment: config ? 'configured' : 'missing_vars',
    database: 'unknown',
    ai_provider: {
      active: aiStatus.provider,
      configured: aiStatus.configured,
      available: aiStatus.availableProviders
    },
    timestamp: new Date().toISOString()
  }

  try {
    // Test Supabase connection
    const { error } = await supabase.from('chat_conversations').select('count').limit(1)
    checks.database = error ? 'error' : 'connected'
  } catch (error) {
    checks.database = 'unreachable'
  }

  const isHealthy = checks.environment === 'configured' && 
                   checks.database === 'connected' && 
                   checks.ai_provider.configured

  return NextResponse.json(checks, { 
    status: isHealthy ? 200 : 503 
  })
}
