'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'details' | 'waiting' | 'success'>('details')
  const [orderId, setOrderId] = useState('')
  const router = useRouter()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
  setMounted(true)
  }, [])

  async function handleCheckout() {
    if (!phone || !name || !address) {
      setError('Please fill in all fields')
      return
    }

    if (!phone.match(/^(?:254|\+254|0)[17]\d{8}$/)) {
      setError('Please enter a valid Kenyan phone number e.g. 0712345678')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/payments/mpesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          items,
          total: total(),
          shippingAddress: { name, address },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Payment failed. Please try again.')
        setLoading(false)
        return
      }

      setOrderId(data.orderId)
      setStep('waiting')

      // Poll for payment confirmation every 3 seconds
      const interval = setInterval(async () => {
        const statusRes = await fetch(
          `/api/payments/mpesa/status?orderId=${data.orderId}`
        )
        const statusData = await statusRes.json()

        if (statusData.status === 'paid') {
          clearInterval(interval)
          clearCart()
          setStep('success')
        } else if (statusData.status === 'cancelled') {
          clearInterval(interval)
          setError('Payment was cancelled. Please try again.')
          setStep('details')
          setLoading(false)
        }
      }, 3000)

      // Stop polling after 2 minutes
      setTimeout(() => {
        clearInterval(interval)
        setError('Payment timed out. Please try again.')
        setStep('details')
        setLoading(false)
      }, 120000)

    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <main className="min-h-screen bg-void text-bone flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-green-400 text-4xl mb-6">✓</p>
          <h1 className="font-heading text-3xl tracking-wider mb-4">
            ORDER CONFIRMED
          </h1>
          <p className="text-muted text-sm mb-2">
            Your payment was received.
          </p>
          <p className="text-muted text-xs mb-8">
            Order ID: {orderId}
          </p>
          <Link
            href="/shop"
            className="bg-crimson hover:bg-crimson-light text-bone px-8 py-3 text-sm tracking-widest transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </main>
    )
  }

  if (step === 'waiting') {
    return (
      <main className="min-h-screen bg-void text-bone flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 border-2 border-crimson border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h1 className="font-heading text-2xl tracking-wider mb-4">
            CHECK YOUR PHONE
          </h1>
          <p className="text-muted text-sm mb-2">
            An M-Pesa prompt has been sent to
          </p>
          <p className="text-bone text-sm font-medium mb-6">{phone}</p>
          <p className="text-muted text-xs mb-8">
            Enter your M-Pesa PIN to complete the payment.
            <br />This page will update automatically.
          </p>
          <button
            onClick={() => {
              setStep('details')
              setLoading(false)
            }}
            className="text-muted hover:text-bone text-xs tracking-widest transition-colors border border-ghost px-6 py-2"
          >
            CANCEL PAYMENT
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-void text-bone">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-ghost bg-void/90 backdrop-blur-sm">
        <Link href="/" className="font-heading text-xl tracking-widest">POLARIS</Link>
        <div className="flex items-center gap-8">
          <Link href="/shop" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">SHOP</Link>
          <Link href="/cart" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">CART</Link>
        </div>
      </nav>

      <div className="pt-28 px-8 pb-24 max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-muted text-xs tracking-[0.4em] mb-3">FINAL STEP</p>
          <h1 className="font-heading text-4xl tracking-wider">CHECKOUT</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-muted text-xs tracking-widest mb-6">
              DELIVERY DETAILS
            </p>

            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-bone text-xs tracking-wide block mb-1">
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-obsidian border border-ghost rounded px-3 py-3 text-bone text-sm focus:outline-none focus:border-crimson"
                />
              </div>

              <div>
                <label className="text-bone text-xs tracking-wide block mb-1">
                  DELIVERY ADDRESS
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. Westlands, Nairobi"
                  className="w-full bg-obsidian border border-ghost rounded px-3 py-3 text-bone text-sm focus:outline-none focus:border-crimson"
                />
              </div>

              <div>
                <label className="text-bone text-xs tracking-wide block mb-1">
                  M-PESA PHONE NUMBER
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0712345678"
                  className="w-full bg-obsidian border border-ghost rounded px-3 py-3 text-bone text-sm focus:outline-none focus:border-crimson"
                />
                <p className="text-muted text-xs mt-1">
                  You will receive an M-Pesa prompt on this number
                </p>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mt-8 bg-crimson hover:bg-crimson-light text-bone py-4 text-sm tracking-widest transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'SENDING PROMPT...' : 'PAY WITH M-PESA'}
            </button>
          </div>

          <div>
            <p className="text-muted text-xs tracking-widest mb-6">
              ORDER SUMMARY
            </p>

            <div className="border border-ghost divide-y divide-ghost">
              {items.map(item => (
                <div key={item.id} className="px-4 py-3 flex justify-between">
                  <div>
                    <p className="text-bone text-sm">{item.name}</p>
                    <p className="text-muted text-xs">
                      Size: {item.size} · Qty: {item.quantity}
                      {item.designName && ` · ${item.designName}`}
                    </p>
                  </div>
                  <p className="text-bone text-sm">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}

              <div className="px-4 py-4 flex justify-between">
                <p className="text-bone text-sm tracking-widest font-medium">
                  TOTAL
                </p>
                <p className="text-bone text-lg font-medium">
                  KES {mounted ? total().toLocaleString() : '0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}