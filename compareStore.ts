import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./sanity.types";

const MAX_COMPARE = 4;

interface CompareState {
  items: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCompare: (product) => {
        const state = get();
        if (state.items.length >= MAX_COMPARE) return;
        if (state.items.some((i) => i._id === product._id)) return;
        set({ items: [...state.items, product] });
      },
      removeFromCompare: (productId) =>
        set({ items: get().items.filter((i) => i._id !== productId) }),
      clearCompare: () => set({ items: [] }),
      isInCompare: (productId) => get().items.some((i) => i._id === productId),
    }),
    { name: "compare-store" },
  ),
);

export default useCompareStore;
