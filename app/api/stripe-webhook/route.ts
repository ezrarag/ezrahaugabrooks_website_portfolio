import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase"

// Initialize Stripe only when needed to avoid build-time issues
function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }
  return new Stripe(secretKey, {
    apiVersion: "2024-12-18.acacia",
  })
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = headers().get("stripe-signature")!

    let event: Stripe.Event

    try {
      const stripe = getStripe()
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("🔔 Webhook received:", event.type)

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case "charge.succeeded":
        await handleChargeSucceeded(event.data.object as Stripe.Charge)
        break

      case "charge.failed":
        await handleChargeFailed(event.data.object as Stripe.Charge)
        break

      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("💰 Payment succeeded:", paymentIntent.id)
  
  try {
    // Update appointment status in Supabase
    const { error } = await supabase
      .from("appointment_requests")
      .update({ 
        status: "confirmed",
        payment_status: "paid",
        stripe_payment_intent_id: paymentIntent.id,
        updated_at: new Date().toISOString()
      })
      .eq("stripe_payment_intent_id", paymentIntent.id)

    if (error) {
      console.error("Error updating appointment:", error)
    } else {
      console.log("✅ Appointment updated successfully")
    }

    // Send confirmation email (implement your email service)
    // await sendConfirmationEmail(paymentIntent.metadata)
  } catch (error) {
    console.error("Error handling payment success:", error)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("❌ Payment failed:", paymentIntent.id)
  
  try {
    // Update appointment status in Supabase
    const { error } = await supabase
      .from("appointment_requests")
      .update({ 
        status: "payment_failed",
        payment_status: "failed",
        updated_at: new Date().toISOString()
      })
      .eq("stripe_payment_intent_id", paymentIntent.id)

    if (error) {
      console.error("Error updating failed payment:", error)
    } else {
      console.log("✅ Failed payment updated successfully")
    }

    // Send failure notification email
    // await sendFailureEmail(paymentIntent.metadata)
  } catch (error) {
    console.error("Error handling payment failure:", error)
  }
}

async function handleChargeSucceeded(charge: Stripe.Charge) {
  console.log("💳 Charge succeeded:", charge.id)
  // Additional charge-specific logic if needed
}

async function handleChargeFailed(charge: Stripe.Charge) {
  console.log("💳 Charge failed:", charge.id)
  // Additional charge-specific logic if needed
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("📅 Subscription created:", subscription.id)
  // Handle subscription creation
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("📅 Subscription updated:", subscription.id)
  // Handle subscription updates
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("📅 Subscription deleted:", subscription.id)
  // Handle subscription deletion
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("📄 Invoice payment succeeded:", invoice.id)
  // Handle invoice payment success
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("📄 Invoice payment failed:", invoice.id)
  // Handle invoice payment failure
} 