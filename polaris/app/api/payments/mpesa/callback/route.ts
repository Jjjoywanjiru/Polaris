import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { Body } = body
    const { stkCallback } = Body

    const checkoutRequestId = stkCallback.CheckoutRequestID
    const resultCode = stkCallback.ResultCode

    const supabase = await createClient()

    if (resultCode === 0) {
      // Payment successful
      const metadata = stkCallback.CallbackMetadata.Item
      const mpesaCode = metadata.find(
        (item: any) => item.Name === 'MpesaReceiptNumber'
      )?.Value

      await supabase
        .from('orders')
        .update({
          status: 'paid',
          mpesa_transaction_id: mpesaCode,
        })
        .eq('mpesa_checkout_request_id', checkoutRequestId)
    } else {
      // Payment failed or cancelled
      await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('mpesa_checkout_request_id', checkoutRequestId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}