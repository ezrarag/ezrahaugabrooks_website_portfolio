
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getChatConfig } from '@/lib/env-validation'

export async function GET() {
  const checks = {
    environment: getChatConfig() ? 'configured' : 'missing_vars',
    database: 'unknown',
    timestamp: new Date().toISOString()
  }

  try {
    // Test Supabase connection
    const { error } = await supabase.from('chat_conversations').select('count').limit(1)
    checks.database = error ? 'error' : 'connected'
  } catch (error) {
    checks.database = 'unreachable'
  }

  const isHealthy = checks.environment === 'configured' && checks.database === 'connected'

  return NextResponse.json(checks, { 
    status: isHealthy ? 200 : 503 
  })
}
