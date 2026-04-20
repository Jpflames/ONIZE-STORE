import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./sanity.types";

interface WishlistState {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  resetWishlist: () => void;
}

const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (product) =>
        set((state) => ({
          items: [...state.items, product],
        })),
      removeFromWishlist: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        })),
      isInWishlist: (productId) =>
        get().items.some((item) => item._id === productId),
      resetWishlist: () => set({ items: [] }),
    }),
    { name: "wishlist-store" },
  ),
);

export default useWishlistStore;
