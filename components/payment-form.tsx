"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard, CheckCircle } from "lucide-react"
import { toast } from "sonner"

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

interface PaymentFormProps {
  amount: number
  appointmentData: any
  onSuccess: (appointment: any) => void
  onCancel: () => void
}

function PaymentFormContent({ amount, appointmentData, onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || "Payment failed")
        return
      }

      // Confirm the payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      })

      if (confirmError) {
        setError(confirmError.message || "Payment confirmation failed")
        return
      }

      // If we get here, payment was successful
      toast.success("Payment successful! Creating your appointment...")
      
      // Create appointment with payment confirmation
      const response = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: appointmentData.paymentIntentId,
          appointmentData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create appointment")
      }

      const result = await response.json()
      onSuccess(result.appointment)
      
    } catch (error) {
      console.error("Payment error:", error)
      setError("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Payment Details</h3>
          <div className="text-right">
            <p className="text-sm text-white/70">Total Amount</p>
            <p className="text-xl font-bold text-white">${amount.toFixed(2)}</p>
          </div>
        </div>
        
        <PaymentElement 
          options={{
            layout: "tabs",
            defaultValues: {
              billingDetails: {
                name: appointmentData.visitorName,
                email: appointmentData.visitorEmail,
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ${amount.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export function PaymentForm(props: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  // Check if Stripe is configured
  if (!stripePromise) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-yellow-200 text-sm">
          ⚠️ Stripe is not configured. Please set up your Stripe environment variables.
        </p>
      </div>
    )
  }

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: props.amount,
            metadata: {
              appointmentType: props.appointmentData.topic,
              visitorName: props.appointmentData.visitorName,
              visitorEmail: props.appointmentData.visitorEmail,
            },
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to create payment intent")
        }

        const { clientSecret, paymentIntentId } = await response.json()
        setClientSecret(clientSecret)
        
        // Store payment intent ID for later use
        props.appointmentData.paymentIntentId = paymentIntentId
      } catch (error) {
        console.error("Payment intent creation error:", error)
        toast.error("Failed to initialize payment")
      }
    }

    createPaymentIntent()
  }, [props.amount, props.appointmentData])

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-white" />
        <span className="ml-2 text-white">Initializing payment...</span>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentFormContent {...props} />
    </Elements>
  )
} 