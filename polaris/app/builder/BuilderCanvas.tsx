'use client'

import { useEffect, useRef, useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'

type Product = {
  id: string
  name: string
  category: string
  base_price: number
}

type Design = {
  id: string
  name: string
  category: string
  svg_url: string
  preview_url: string
}

type Props = {
  products: Product[]
  designs: Design[]
}

const CLOTHING_SHAPES: Record<string, string> = {
  hoodie: `
    <svg viewBox="0 0 300 350" xmlns="http://www.w3.org/2000/svg">
      <path d="M105,20 Q150,10 195,20 L220,50 L260,60 L270,120 L240,125 L240,320 L60,320 L60,125 L30,120 L40,60 L80,50 Z" 
        fill="#1c1c1c" stroke="#2a2a2a" stroke-width="2"/>
      <path d="M105,20 Q150,50 195,20" fill="none" stroke="#2a2a2a" stroke-width="2"/>
      <path d="M115,22 Q150,35 185,22 L190,60 Q150,70 110,60 Z" fill="#111111" stroke="#2a2a2a" stroke-width="1.5"/>
    </svg>
  `,
  tshirt: `
    <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <path d="M100,20 Q150,10 200,20 L240,50 L270,80 L240,100 L230,90 L230,280 L70,280 L70,90 L60,100 L30,80 L60,50 Z"
        fill="#1c1c1c" stroke="#2a2a2a" stroke-width="2"/>
      <path d="M100,20 Q150,45 200,20" fill="none" stroke="#2a2a2a" stroke-width="2"/>
    </svg>
  `,
  sweatsuit: `
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
      <path d="M100,20 Q150,10 200,20 L225,50 L260,60 L265,130 L235,132 L235,230 L65,230 L65,132 L35,130 L40,60 L75,50 Z"
        fill="#1c1c1c" stroke="#2a2a2a" stroke-width="2"/>
      <path d="M100,20 Q150,45 200,20" fill="none" stroke="#2a2a2a" stroke-width="2"/>
      <path d="M85,240 L75,380 L135,380 L150,300 L165,380 L225,380 L215,240 Z"
        fill="#1c1c1c" stroke="#2a2a2a" stroke-width="2"/>
      <path d="M75,375 L135,375" stroke="#2a2a2a" stroke-width="3"/>
      <path d="M165,375 L225,375" stroke="#2a2a2a" stroke-width="3"/>
    </svg>
  `,
  beanie: `
    <svg viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg">
      <path d="M60,180 Q60,80 150,60 Q240,80 240,180 Z"
        fill="#1c1c1c" stroke="#2a2a2a" stroke-width="2"/>
      <rect x="55" y="175" width="190" height="35" rx="4"
        fill="#111111" stroke="#2a2a2a" stroke-width="2"/>
      <line x1="55" y1="185" x2="245" y2="185" stroke="#2a2a2a" stroke-width="1.5"/>
      <line x1="55" y1="195" x2="245" y2="195" stroke="#2a2a2a" stroke-width="1.5"/>
      <circle cx="150" cy="68" r="14" fill="#1c1c1c" stroke="#2a2a2a" stroke-width="2"/>
    </svg>
  `,
  tie: `
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
      <path d="M130,20 L170,20 L185,80 L150,90 L115,80 Z"
        fill="#1c1c1c" stroke="#2a2a2a" stroke-width="2"/>
      <path d="M115,80 L150,90 L185,80 L200,350 L150,380 L100,350 Z"
        fill="#1c1c1c" stroke="#2a2a2a" stroke-width="2"/>
    </svg>
  `,
}

export default function BuilderCanvas({ products, designs }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<any>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    products[0] || null
  )
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(state => state.addItem)
  const router = useRouter()

  // Initialize Fabric canvas
  useEffect(() => {
    async function initCanvas() {
      const { Canvas, FabricImage } = await import('fabric')

      if (!canvasRef.current) return

      // Destroy previous instance
      if (fabricRef.current) {
        fabricRef.current.dispose()
      }

      const canvas = new Canvas(canvasRef.current, {
        width: 400,
        height: 450,
        backgroundColor: '#111111',
      })

      fabricRef.current = canvas

      // Draw clothing shape as SVG
      if (selectedProduct) {
        const svgString = CLOTHING_SHAPES[selectedProduct.category] ||
          CLOTHING_SHAPES['tshirt']

        const { loadSVGFromString } = await import('fabric')
        const { objects, options } = await loadSVGFromString(svgString)

        const { util } = await import('fabric')
        const group = util.groupSVGElements(objects.filter(Boolean) as any[], options)

        group.set({
          left: 200,
          top: 225,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
          scaleX: 1.2,
          scaleY: 1.2,
        })

        canvas.add(group)
        canvas.renderAll()
      }
    }

    initCanvas()

    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose()
        fabricRef.current = null
      }
    }
  }, [selectedProduct])

  // Add design to canvas
  async function addDesignToCanvas(design: Design) {
    if (!fabricRef.current) return

    setSelectedDesign(design)

    const { FabricImage, loadSVGFromURL, loadSVGFromString, util } =
      await import('fabric')

    // Use a simple placeholder shape since we don't have real SVG files yet
    const placeholderSVG = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <text x="50" y="55" text-anchor="middle" 
          font-size="60" fill="#8b1a1a">
          ${design.name === 'Dragon' ? '🐉' :
            design.name === 'Serpent' ? '🐍' : '⭐'}
        </text>
      </svg>
    `

    const { objects, options } = await loadSVGFromString(placeholderSVG)
    const group = util.groupSVGElements(objects.filter(Boolean) as any[], options)

    group.set({
      left: 200,
      top: 200,
      originX: 'center',
      originY: 'center',
      scaleX: 0.8,
      scaleY: 0.8,
      cornerColor: '#8b1a1a',
      cornerSize: 8,
      transparentCorners: false,
    })

    fabricRef.current.add(group)
    fabricRef.current.setActiveObject(group)
    fabricRef.current.renderAll()
  }

  // Remove selected object
  function removeSelected() {
    if (!fabricRef.current) return
    const active = fabricRef.current.getActiveObject()
    if (active) {
      fabricRef.current.remove(active)
      fabricRef.current.renderAll()
    }
  }

  // Clear all designs (keep clothing shape)
  function clearDesigns() {
    if (!fabricRef.current) return
    const objects = fabricRef.current.getObjects()
    // Keep first object (clothing shape), remove rest
    objects.slice(1).forEach((obj: any) => {
      fabricRef.current.remove(obj)
    })
    fabricRef.current.renderAll()
    setSelectedDesign(null)
  }

  function handleAddToCart() {
    if (!selectedProduct) return

    addItem({
      id: `${selectedProduct.id}-${selectedSize}-${Date.now()}`,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.base_price,
      size: selectedSize,
      quantity: 1,
      designId: selectedDesign?.id,
      designName: selectedDesign?.name,
    })

    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      router.push('/cart')
    }, 1500)
  }

  return (
    <div className="flex min-h-screen">

      {/* Left sidebar — product and design selection */}
      <div className="w-72 border-r border-ghost p-6 overflow-y-auto">
        <div className="mb-8">
          <p className="text-muted text-xs tracking-[0.3em] mb-4">
            SELECT GARMENT
          </p>
          <div className="space-y-2">
            {products.map(product => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`w-full text-left px-4 py-3 border text-sm transition-all ${
                  selectedProduct?.id === product.id
                    ? 'border-crimson text-bone bg-crimson/10'
                    : 'border-ghost text-muted hover:border-bone hover:text-bone'
                }`}
              >
                <p className="tracking-wide">{product.name}</p>
                <p className="text-xs mt-1 opacity-60">
                  KES {product.base_price.toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-muted text-xs tracking-[0.3em] mb-4">
            SELECT SIZE
          </p>
          <div className="flex gap-2">
            {['S', 'M', 'L', 'XL'].map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-10 h-10 border text-xs transition-colors ${
                  selectedSize === size
                    ? 'border-crimson text-bone bg-crimson/10'
                    : 'border-ghost text-muted hover:border-bone hover:text-bone'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-muted text-xs tracking-[0.3em] mb-4">
            ADD DESIGN
          </p>
          <div className="space-y-2">
            {designs.map(design => (
              <button
                key={design.id}
                onClick={() => addDesignToCanvas(design)}
                className={`w-full text-left px-4 py-3 border text-sm transition-all ${
                  selectedDesign?.id === design.id
                    ? 'border-crimson text-bone bg-crimson/10'
                    : 'border-ghost text-muted hover:border-bone hover:text-bone'
                }`}
              >
                <p className="tracking-wide">{design.name}</p>
                <p className="text-xs mt-1 opacity-60 capitalize">
                  {design.category}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center — canvas */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="mb-4 text-center">
          <p className="text-muted text-xs tracking-[0.3em] mb-1">
            DESIGN STUDIO
          </p>
          <p className="text-bone font-heading text-xl tracking-wider">
            {selectedProduct?.name.toUpperCase() || 'SELECT A GARMENT'}
          </p>
        </div>

        <div className="border border-ghost">
          <canvas ref={canvasRef} />
        </div>

        <p className="text-muted text-xs mt-4 tracking-wide text-center">
          Click a design to add it · Drag to reposition · Use handles to resize
        </p>
      </div>

      {/* Right sidebar — actions */}
      <div className="w-64 border-l border-ghost p-6 flex flex-col">
        <div className="mb-8">
          <p className="text-muted text-xs tracking-[0.3em] mb-4">
            CANVAS TOOLS
          </p>
          <div className="space-y-2">
            <button
              onClick={removeSelected}
              className="w-full border border-ghost hover:border-red-800 text-muted hover:text-red-400 py-2 text-xs tracking-widest transition-colors"
            >
              REMOVE SELECTED
            </button>
            <button
              onClick={clearDesigns}
              className="w-full border border-ghost hover:border-bone text-muted hover:text-bone py-2 text-xs tracking-widest transition-colors"
            >
              CLEAR ALL DESIGNS
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div className="mt-auto">
          {selectedProduct && (
            <div className="border border-ghost p-4 mb-4">
              <p className="text-muted text-xs tracking-widest mb-3">
                SUMMARY
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Garment</span>
                  <span className="text-bone">{selectedProduct.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Size</span>
                  <span className="text-bone">{selectedSize}</span>
                </div>
                {selectedDesign && (
                  <div className="flex justify-between">
                    <span className="text-muted">Design</span>
                    <span className="text-bone">{selectedDesign.name}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-ghost">
                  <span className="text-muted">Total</span>
                  <span className="text-bone font-medium">
                    KES {selectedProduct.base_price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!selectedProduct || added}
            className={`w-full py-4 text-sm tracking-widest transition-all font-medium ${
              added
                ? 'bg-green-900 text-green-300'
                : 'bg-crimson hover:bg-crimson-light text-bone disabled:opacity-40'
            }`}
          >
            {added ? 'ADDED ✓' : 'ADD TO CART'}
          </button>
        </div>
      </div>

    </div>
  )
}