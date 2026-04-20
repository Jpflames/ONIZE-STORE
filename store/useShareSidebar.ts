import { create } from "zustand";

interface ShareState {
  isOpen: boolean;
  productSlug: string;
  productName: string;
  productImage: string;
  open: (slug: string, name: string, image: string) => void;
  close: () => void;
}

const useShareSidebar = create<ShareState>()((set) => ({
  isOpen: false,
  productSlug: "",
  productName: "",
  productImage: "",
  open: (slug, name, image) =>
    set({
      isOpen: true,
      productSlug: slug,
      productName: name,
      productImage: image,
    }),
  close: () => set({ isOpen: false }),
}));

export default useShareSidebar;
