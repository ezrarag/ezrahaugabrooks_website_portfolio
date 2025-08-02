#!/bin/bash

echo "Setting up environment variables for Ezra's portfolio website..."
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Backing up to .env.local.backup"
    cp .env.local .env.local.backup
fi

# Create .env.local with placeholder values
cat > .env.local << EOF
# Supabase Configuration
# Replace these with your actual Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# AI Provider Configuration (if needed)
# OPENAI_API_KEY=your_openai_api_key_here
EOF

echo "✅ Created .env.local with placeholder values"
echo ""
echo "📝 Next steps:"
echo "1. Get your Supabase credentials from your Supabase dashboard"
echo "2. Replace the placeholder values in .env.local with your actual credentials"
echo "3. Restart your development server"
echo ""
echo "🔗 Supabase Dashboard: https://supabase.com/dashboard" 