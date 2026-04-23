'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'

type Product = {
  id: string
  name: string
  base_price: number
  sizes: string[]
}

export default function AddToCart({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState('')
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(state => state.addItem)
  const router = useRouter()

  function handleAddToCart() {
    if (!selectedSize) {
      setError('Please select a size')
      return
    }

    setError('')
    addItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.base_price,
      size: selectedSize,
      quantity: 1,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div>
      {/* Size selector */}
      <div className="mb-8">
        <p className="text-muted text-xs tracking-widest mb-3">SELECT SIZE</p>
        <div className="flex gap-2">
          {product.sizes?.map((size: string) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-12 h-12 border text-xs tracking-wide transition-colors ${
                selectedSize === size
                  ? 'border-crimson text-bone bg-crimson/10'
                  : 'border-ghost hover:border-crimson text-bone'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {error && (
          <p className="text-red-400 text-xs mt-2">{error}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleAddToCart}
          className={`py-4 text-sm tracking-widest transition-all font-medium ${
            added
              ? 'bg-green-900 text-green-300'
              : 'bg-crimson hover:bg-crimson-light text-bone'
          }`}
        >
          {added ? 'ADDED TO CART ✓' : 'ADD TO CART'}
        </button>
        <button
          onClick={() => router.push(`/builder?product=${product.id}`)}
          className="border border-ghost hover:border-bone text-bone py-4 text-sm tracking-widest transition-colors"
        >
          CUSTOMIZE WITH A DESIGN
        </button>
      </div>
    </div>
  )
}