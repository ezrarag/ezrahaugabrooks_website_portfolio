#!/bin/bash

echo "🔗 Setting up Stripe Webhook for Ezra's portfolio website..."
echo ""

# Check if stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI is not installed."
    echo "📥 Install it from: https://stripe.com/docs/stripe-cli"
    echo ""
    echo "After installation, run this script again."
    exit 1
fi

echo "✅ Stripe CLI found"
echo ""

# Login to Stripe
echo "🔐 Please login to your Stripe account..."
stripe login

echo ""
echo "🎯 Setting up webhook endpoint..."
echo ""

# Create webhook endpoint
WEBHOOK_URL="https://your-domain.com/api/stripe-webhook"

echo "📝 Webhook URL: $WEBHOOK_URL"
echo "⚠️  Update the URL above to your actual domain"
echo ""

# List available events
echo "📋 Available webhook events:"
echo "- payment_intent.succeeded"
echo "- payment_intent.payment_failed"
echo "- charge.succeeded"
echo "- charge.failed"
echo "- customer.subscription.created"
echo "- customer.subscription.updated"
echo "- customer.subscription.deleted"
echo "- invoice.payment_succeeded"
echo "- invoice.payment_failed"
echo ""

echo "🔧 To create the webhook endpoint, run:"
echo "stripe listen --forward-to $WEBHOOK_URL"
echo ""
echo "📋 Or manually create it in your Stripe Dashboard:"
echo "1. Go to https://dashboard.stripe.com/webhooks"
echo "2. Click 'Add endpoint'"
echo "3. Enter your webhook URL: $WEBHOOK_URL"
echo "4. Select the events listed above"
echo "5. Copy the webhook signing secret"
echo ""
echo "🔑 Add the webhook secret to your environment variables:"
echo "STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here"
echo ""
echo "🌐 For Vercel deployment, add the webhook secret to:"
echo "Vercel Dashboard → Settings → Environment Variables"
echo ""
echo "✅ Webhook setup complete!" 