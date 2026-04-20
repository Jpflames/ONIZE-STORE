import { create } from "zustand";

interface Address {
  _id: string;
  addressType: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
}

interface AddressSidebarState {
  isOpen: boolean;
  editingAddress: Address | null;
  refreshTrigger: number;
  open: (address?: Address) => void;
  close: () => void;
  refresh: () => void;
}

const useAddressSidebar = create<AddressSidebarState>((set) => ({
  isOpen: false,
  editingAddress: null,
  refreshTrigger: 0,
  open: (address) => set({ isOpen: true, editingAddress: address || null }),
  close: () => set({ isOpen: false, editingAddress: null }),
  refresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));

export default useAddressSidebar;
