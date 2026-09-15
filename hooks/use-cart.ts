import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, ComboCartItem, Size } from "@/types";
import { getCartSubtotal } from "@/lib/pricing";

interface CartState {
  items: CartItem[];
  comboItems: ComboCartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (productCode: string, size: Size) => void;
  updateQuantity: (productCode: string, size: Size, quantity: number) => void;
  updateSize: (productCode: string, oldSize: Size, newSize: Size) => void;
  addComboItem: (item: ComboCartItem) => void;
  removeComboItem: (comboId: string, index: number) => void;
  clearCart: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      comboItems: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productCode === item.productCode && i.size === item.size
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productCode === item.productCode && i.size === item.size
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, item], isOpen: true };
        }),
      removeItem: (productCode, size) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productCode === productCode && i.size === size)
          ),
        })),
      updateQuantity: (productCode, size, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) => !(i.productCode === productCode && i.size === size)
                )
              : state.items.map((i) =>
                  i.productCode === productCode && i.size === size
                    ? { ...i, quantity }
                    : i
                ),
        })),
      updateSize: (productCode, oldSize, newSize) =>
        set((state) => {
          if (oldSize === newSize) return state;
          
          const existingNewSizeItem = state.items.find(
            (i) => i.productCode === productCode && i.size === newSize
          );

          if (existingNewSizeItem) {
            // merge quantities if new size already exists
            const oldItem = state.items.find((i) => i.productCode === productCode && i.size === oldSize);
            return {
              items: state.items
                .map((i) =>
                  i.productCode === productCode && i.size === newSize
                    ? { ...i, quantity: i.quantity + (oldItem?.quantity || 0) }
                    : i
                )
                .filter((i) => !(i.productCode === productCode && i.size === oldSize))
            };
          }

          // just update the size
          return {
            items: state.items.map((i) =>
              i.productCode === productCode && i.size === oldSize
                ? { ...i, size: newSize }
                : i
            ),
          };
        }),
      addComboItem: (item) =>
        set((state) => ({
          comboItems: [...state.comboItems, item],
          isOpen: true,
        })),
      removeComboItem: (comboId, index) =>
        set((state) => ({
          comboItems: state.comboItems.filter(
            (c, i) => !(c.comboId === comboId && i === index)
          ),
        })),
      clearCart: () => set({ items: [], comboItems: [] }),
      subtotal: () =>
        getCartSubtotal(get().items) +
        get().comboItems.reduce((sum, c) => sum + c.comboPrice * c.quantity, 0),
      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0) +
        get().comboItems.reduce((sum, c) => sum + c.quantity, 0),
    }),
    {
      name: "revine-cart",
      partialize: (state) => ({ items: state.items, comboItems: state.comboItems }),
    }
  )
);
