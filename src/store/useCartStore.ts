import { create } from 'zustand';
import { Product } from '@/data/mock';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,
  addItem: (product, quantity = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
          isOpen: true,
        };
      }
      return { items: [...state.items, { ...product, quantity }], isOpen: true };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === productId ? { ...i, quantity } : i)),
    })),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  closeCart: () => set({ isOpen: false }),
  clearCart: () => set({ items: [] }),
}));
