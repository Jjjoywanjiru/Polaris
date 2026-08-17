import { createClient} from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function OrdersPage (){
   
   //initialize supabase for a server component
   const supabase = await createClient()

   //get current user
   const{data:{user}} = await supabase.auth.getUser()

   //redirect to login if not authenticated
   if (!user){
      redirect ('/login?redirect=/orders')
   }

   //fetch orders, joining order_items and products
   const {data: orders, error } = await supabase
   .from('orders')
   .select(`
      *,
      order_items (
         *,
         products( name, base_price, preview_image_url)
      )
      `)
      .eq('user_id', user.id)
      .order('created_at', {ascending: false })

   if (error) {
      console.error('Error fetching orders:',error)
      return <div className = "min-h-screen bg-void text-bone p-8">Error loading orders.</div>
   }
   return (
      <main className="min-h-screen bg-void text-bone">
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-ghost bg-void/90 backdrop-blur-sm">
      <Link href="/" className="font-heading text-xl tracking-widest">POLARIS</Link>
      <div className="flex items-center gap-8">
        <Link href="/shop" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">SHOP</Link>
        <Link href="/builder" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">BUILDER</Link>
        <Link href="/cart" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">CART</Link>
        <Link href="/orders" className="text-sm text-bone tracking-wide">ORDERS</Link>
      </div>
    </nav>

    <div className="pt-28 px-8 pb-24 max-w-4xl mx-auto">
      <h1 className="font-heading text-4xl mb-12 tracking-widest text-bone uppercase border-b border-ghost pb-4">
          Your <span className="text-crimson">Archive</span>
        </h1>

        {orders?.length === 0 ? (
          <p className="text-muted text-lg">No orders found in your history.</p>
        ) : (
          <div className="space-y-8">
            {orders?.map((order) => (
              <div 
                key={order.id} 
                className="bg-obsidian border border-ghost rounded-md p-6 shadow-2xl"
              >
                {/* Order Header */}
                <div className="flex flex-wrap justify-between items-center border-b border-ghost pb-4 mb-4">
                  <div>
                    <p className="text-muted text-sm uppercase tracking-wider mb-1">Order ID</p>
                    <p className="font-mono text-sm">{order.id.split('-')[0]}</p>
                  </div>
                  <div>
                    <p className="text-muted text-sm uppercase tracking-wider mb-1">Date</p>
                    <p className="text-bone">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted text-sm uppercase tracking-wider mb-1">Status</p>
                    <p className={`uppercase text-sm tracking-widest ${
                      order.status === 'paid' ? 'text-ice' : 'text-crimson'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted text-sm uppercase tracking-wider mb-1">Total</p>
                    <p className="font-mono text-lg text-bone">KES {order.total}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-4 bg-ash p-4 rounded-sm">
                      <div className="flex-1">
                        <h3 className="font-heading text-lg text-bone uppercase tracking-wide">
                          {item.products.name}
                        </h3>
                        <div className="flex space-x-4 text-muted mt-1 text-sm font-mono">
                          <p>Size: <span className="text-bone">{item.size || 'N/A'}</span></p>
                          <p>Qty: <span className="text-bone">{item.quantity}</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-bone">KES {item.unit_price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  </main>
)
}