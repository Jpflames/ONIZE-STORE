import { create } from "zustand";

interface LoginSidebarState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const useLoginSidebar = create<LoginSidebarState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default useLoginSidebar;
