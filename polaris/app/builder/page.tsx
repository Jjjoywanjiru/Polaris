import Link from 'next/link'
import BuilderCanvas from './BuilderCanvas'
import { createClient } from '@/lib/supabase/server'

export default async function BuilderPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, category, base_price')
    .eq('in_stock', true)

  const { data: designs } = await supabase
    .from('designs')
    .select('*')
    .eq('is_active', true)

  return (
    <main className="min-h-screen bg-void text-bone">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-ghost bg-void/90 backdrop-blur-sm">
        <Link href="/" className="font-heading text-xl tracking-widest">POLARIS</Link>
        <div className="flex items-center gap-8">
          <Link href="/shop" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">SHOP</Link>
          <Link href="/builder" className="text-sm text-bone tracking-wide">BUILDER</Link>
          <Link href="/cart" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">CART</Link>
          <Link href="/login" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">ACCOUNT</Link>
        </div>
      </nav>

      <div className="pt-20">
        <BuilderCanvas
          products={products || []}
          designs={designs || []}
        />
      </div>
    </main>
  )
}