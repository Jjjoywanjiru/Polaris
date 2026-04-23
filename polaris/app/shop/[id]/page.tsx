import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AddToCart from './AddToCart'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-void text-bone">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-ghost bg-void/90 backdrop-blur-sm">
        <Link href="/" className="font-heading text-xl tracking-widest">POLARIS</Link>
        <div className="flex items-center gap-8">
          <Link href="/shop" className="text-sm text-bone tracking-wide">SHOP</Link>
          <Link href="/builder" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">BUILDER</Link>
          <Link href="/cart" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">CART</Link>
          <Link href="/login" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">ACCOUNT</Link>
        </div>
      </nav>

      <div className="pt-28 px-8 pb-24 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-muted text-xs tracking-wide mb-12">
          <Link href="/shop" className="hover:text-bone transition-colors">SHOP</Link>
          <span>/</span>
          <span className="text-bone">{product.name.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="aspect-square bg-obsidian border border-ghost flex items-center justify-center">
            {product.preview_image_url ? (
              <img
                src={product.preview_image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <p className="font-heading text-6xl text-ghost">P</p>
                <p className="text-muted text-xs mt-4 tracking-widest">
                  {product.category.toUpperCase()}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-muted text-xs tracking-[0.4em] mb-4">
              {product.category.toUpperCase()}
            </p>
            <h1 className="font-heading text-4xl tracking-wider mb-4">
              {product.name.toUpperCase()}
            </h1>
            <p className="text-muted text-sm leading-relaxed mb-8">
              {product.description}
            </p>
            <p className="text-bone text-2xl font-medium mb-8">
              KES {product.base_price.toLocaleString()}
            </p>
            <AddToCart product={product} />
          </div>
        </div>
      </div>
    </main>
  )
}