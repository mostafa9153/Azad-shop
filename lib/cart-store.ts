import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CustomMeasurements } from "./types";

export interface CartItem {
  id: string; // unique item id (variantId or variantId + custom timestamp)
  productId: string;
  variantId?: string;
  sku: string;
  titleEn: string;
  titleBn: string;
  size: string;
  colorEn: string;
  colorBn: string;
  pricePaise: number;
  quantity: number;
  imageUrl: string;
  isCustomSize: boolean;
  customMeasurements?: CustomMeasurements | null;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotalPaise: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (newItem) => {
        const items = get().items;
        // Check if matching item exists (non-custom)
        if (!newItem.isCustomSize && newItem.variantId) {
          const existing = items.find((i) => i.variantId === newItem.variantId && !i.isCustomSize);
          if (existing) {
            set({
              items: items.map((i) =>
                i.variantId === newItem.variantId && !i.isCustomSize
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
              isOpen: true,
            });
            return;
          }
        }

        const id = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        set({
          items: [...items, { ...newItem, id }],
          isOpen: true,
        });
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity: Math.min(qty, 20) } : i)),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalPaise: () => {
        return get().items.reduce((acc, i) => {
          const customFee = i.isCustomSize ? 15000 : 0;
          return acc + (i.pricePaise + customFee) * i.quantity;
        }, 0);
      },
      getItemCount: () => {
        return get().items.reduce((acc, i) => acc + i.quantity, 0);
      },
    }),
    {
      name: "azad_haya_cart_v1",
    }
  )
);
