'use client'

import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCartStore()

  return (
    <main className="min-h-screen bg-void text-bone">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-ghost bg-void/90 backdrop-blur-sm">
        <Link href="/" className="font-heading text-xl tracking-widest">POLARIS</Link>
        <div className="flex items-center gap-8">
          <Link href="/shop" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">SHOP</Link>
          <Link href="/builder" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">BUILDER</Link>
          <Link href="/cart" className="text-sm text-bone tracking-wide">
            CART {itemCount() > 0 && `(${itemCount()})`}
          </Link>
          <Link href="/login" className="text-sm text-muted hover:text-bone transition-colors tracking-wide">ACCOUNT</Link>
        </div>
      </nav>

      <div className="pt-28 px-8 pb-24 max-w-3xl mx-auto">
        <div className="mb-12">
          <p className="text-muted text-xs tracking-[0.4em] mb-3">YOUR</p>
          <h1 className="font-heading text-4xl tracking-wider">CART</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 border border-ghost">
            <p className="text-muted text-sm tracking-wide mb-8">
              Your cart is empty.
            </p>
            <Link
              href="/shop"
              className="bg-crimson hover:bg-crimson-light text-bone px-8 py-3 text-sm tracking-widest transition-colors"
            >
              BROWSE THE COLLECTION
            </Link>
          </div>
        ) : (
          <div>
            {/* Cart items */}
            <div className="divide-y divide-ghost mb-12">
              {items.map(item => (
                <div key={item.id} className="py-6 flex items-center gap-6">
                  {/* Placeholder image */}
                  <div className="w-20 h-20 bg-obsidian border border-ghost flex items-center justify-center flex-shrink-0">
                    <p className="font-heading text-ghost">P</p>
                  </div>

                  {/* Item details */}
                  <div className="flex-1">
                    <p className="text-bone text-sm tracking-wide mb-1">
                      {item.name}
                    </p>
                    <p className="text-muted text-xs mb-1">
                      Size: {item.size}
                    </p>
                    {item.designName && (
                      <p className="text-muted text-xs">
                        Design: {item.designName}
                      </p>
                    )}
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 border border-ghost hover:border-bone text-bone text-sm transition-colors"
                    >
                      −
                    </button>
                    <span className="text-bone text-sm w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 border border-ghost hover:border-bone text-bone text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <p className="text-bone text-sm font-medium w-24 text-right">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted hover:text-red-400 text-xs tracking-wide transition-colors"
                  >
                    REMOVE
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="border border-ghost p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-muted text-sm tracking-wide">SUBTOTAL</p>
                <p className="text-bone text-sm">
                  KES {total().toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-ghost">
                <p className="text-muted text-sm tracking-wide">SHIPPING</p>
                <p className="text-muted text-sm">Calculated at checkout</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-bone text-sm tracking-widest font-medium">TOTAL</p>
                <p className="text-bone text-xl font-medium">
                  KES {total().toLocaleString()}
                </p>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-crimson hover:bg-crimson-light text-bone py-4 text-sm tracking-widest transition-colors font-medium text-center"
            >
              PROCEED TO CHECKOUT
            </Link>

            <Link
              href="/shop"
              className="block w-full text-center text-muted hover:text-bone text-xs tracking-widest mt-4 transition-colors"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}