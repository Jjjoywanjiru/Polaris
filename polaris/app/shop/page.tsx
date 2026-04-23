import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

// This tells Next.js to always fetch fresh data
export const dynamic = 'force-dynamic'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()

  // Fetch products, filter by category if one is selected
  let query = supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data: products, error } = await query

  const categories = [
    { label: 'ALL', value: '' },
    { label: 'HOODIES', value: 'hoodie' },
    { label: 'SWEATSUITS', value: 'sweatsuit' },
    { label: 'TEES', value: 'tshirt' },
    { label: 'BEANIES', value: 'beanie' },
    { label: 'TIES', value: 'tie' },
  ]

  return (
    <main className="min-h-screen bg-void text-bone">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-ghost bg-void/90 backdrop-blur-sm">
        <Link href="/" className="font-heading text-xl tracking-widest">POLARIS</Link>
        <div className="flex items-center gap-8">
          <Link href="/shop" className="text-sm text-bone tracking-wide">
            SHOP
          </Link>
          <Link href="/builder" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">
            BUILDER
          </Link>
          <Link href="/cart" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">
            CART
          </Link>
          <Link href="/login" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">
            ACCOUNT
          </Link>
        </div>
      </nav>

      <div className="pt-28 px-8 pb-24">

        {/* Page header */}
        <div className="mb-12">
          <p className="text-muted text-xs tracking-[0.4em] mb-3">THE COLLECTION</p>
          <h1 className="font-heading text-4xl tracking-wider">
            {category ? category.toUpperCase() + 'S' : 'ALL PIECES'}
          </h1>
        </div>

        {/* Category filters */}
        <div className="flex gap-3 mb-12 flex-wrap">
          {categories.map(cat => (
            <Link
              key={cat.label}
              href={cat.value ? `/shop?category=${cat.value}` : '/shop'}
              className={`px-5 py-2 text-xs tracking-widest border transition-all duration-200 ${
                (category === cat.value) || (!category && cat.value === '')
                  ? 'border-crimson text-bone bg-crimson/10'
                  : 'border-ghost text-muted hover:border-bone hover:text-bone'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <p className="text-red-400 text-sm">
            Failed to load products. Please try again.
          </p>
        )}

        {/* Empty state */}
        {!error && products?.length === 0 && (
          <div className="text-center py-24">
            <p className="text-muted text-sm tracking-wide">
              No pieces found in this category.
            </p>
          </div>
        )}

        {/* Products grid */}
        {products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group bg-obsidian border border-ghost hover:border-crimson transition-all duration-300"
              >
                {/* Product image placeholder */}
                <div className="aspect-square bg-ash flex items-center justify-center border-b border-ghost group-hover:border-crimson transition-colors">
                  {product.preview_image_url ? (
                    <img
                      src={product.preview_image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <p className="font-heading text-2xl text-ghost group-hover:text-crimson transition-colors">
                        P
                      </p>
                      <p className="text-muted text-xs mt-2 tracking-widest">
                        {product.category.toUpperCase()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="p-4">
                  <p className="text-bone text-sm tracking-wide mb-1">
                    {product.name}
                  </p>
                  <p className="text-muted text-xs mb-3">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-bone text-sm font-medium">
                      KES {product.base_price.toLocaleString()}
                    </p>
                    <p className="text-muted text-xs tracking-widest group-hover:text-crimson transition-colors">
                      VIEW →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}