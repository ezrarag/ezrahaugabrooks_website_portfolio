#!/bin/bash

echo "Setting up Stripe integration for Ezra's portfolio website..."
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Backing up to .env.local.backup"
    cp .env.local .env.local.backup
fi

# Create .env.local with Stripe placeholder values
cat >> .env.local << EOF

# Stripe Configuration
# Get these from your Stripe Dashboard: https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

EOF

echo "✅ Added Stripe environment variables to .env.local"
echo ""
echo "📝 Next steps:"
echo "1. Sign up for a Stripe account at https://stripe.com"
echo "2. Go to your Stripe Dashboard: https://dashboard.stripe.com/apikeys"
echo "3. Copy your publishable key and secret key"
echo "4. Replace the placeholder values in .env.local"
echo "5. Install Stripe package: npm install stripe @stripe/stripe-js"
echo "6. Create API routes for payment processing"
echo ""
echo "🔗 Stripe Dashboard: https://dashboard.stripe.com"
echo "📚 Stripe Docs: https://stripe.com/docs" 