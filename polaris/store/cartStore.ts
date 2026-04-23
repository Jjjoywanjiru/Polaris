import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  size: string
  quantity: number
  designId?: string
  designName?: string
}

type CartStore = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find(
          i => i.productId === item.productId && i.size === item.size
        )
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              i.id === existing.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }))
        } else {
          set(state => ({ items: [...state.items, item] }))
        }
      },

      removeItem: (id) =>
        set(state => ({
          items: state.items.filter(i => i.id !== id),
        })),

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            i.id === id ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'polaris-cart',
    }
  )
)