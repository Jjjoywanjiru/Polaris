import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('orderId')

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: order } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single()

  return NextResponse.json({ status: order?.status || 'pending' })
}