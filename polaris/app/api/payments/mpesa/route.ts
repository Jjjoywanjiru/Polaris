import { createClient } from '@/lib/supabase/server'
import { initiateStkPush } from '@/lib/mpesa'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { phone, items, total } = await request.json()

    if (!phone || !items || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
        status: 'pending',
        total,
        phone_number: phone,
      })
      .select()
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Insert order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      design_id: item.designId || null,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.price,
    }))

    await supabase.from('order_items').insert(orderItems)

    // Initiate STK push
    const stkResponse = await initiateStkPush({
      phone,
      amount: total,
      orderId: order.id,
    })

    if (stkResponse.ResponseCode !== '0') {
      return NextResponse.json(
        { error: stkResponse.errorMessage || 'STK push failed' },
        { status: 400 }
      )
    }

    // Save checkout request ID
    await supabase
      .from('orders')
      .update({
        mpesa_checkout_request_id: stkResponse.CheckoutRequestID,
      })
      .eq('id', order.id)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      checkoutRequestId: stkResponse.CheckoutRequestID,
      message: 'Check your phone for the M-Pesa prompt',
    })
  } catch (error) {
    console.error('M-Pesa error:', error)
    return NextResponse.json(
      { error: 'Payment initiation failed' },
      { status: 500 }
    )
  }
}