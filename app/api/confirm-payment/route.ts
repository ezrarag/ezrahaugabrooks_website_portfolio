import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

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

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, appointmentData } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment intent ID is required" },
        { status: 400 }
      )
    }

    // Retrieve the payment intent to check its status
    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === "succeeded") {
      // Payment was successful, create the appointment
      try {
        const appointmentResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/appointments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...appointmentData,
            paymentIntentId,
            paymentStatus: "succeeded",
          }),
        })

        if (!appointmentResponse.ok) {
          throw new Error("Failed to create appointment")
        }

        const appointment = await appointmentResponse.json()

        return NextResponse.json({
          success: true,
          appointment,
          paymentIntent,
        })
      } catch (error) {
        console.error("Appointment creation error:", error)
        return NextResponse.json(
          { error: "Payment succeeded but failed to create appointment" },
          { status: 500 }
        )
      }
    } else {
      return NextResponse.json(
        { error: "Payment not completed", status: paymentIntent.status },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Payment confirmation error:", error)
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    )
  }
} 