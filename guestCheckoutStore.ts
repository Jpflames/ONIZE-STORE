import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GuestCheckoutDetails = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

type GuestCheckoutState = {
  details: GuestCheckoutDetails;
  setField: <K extends keyof GuestCheckoutDetails>(
    key: K,
    value: GuestCheckoutDetails[K],
  ) => void;
  reset: () => void;
};

const emptyDetails: GuestCheckoutDetails = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
};

const useGuestCheckoutStore = create<GuestCheckoutState>()(
  persist(
    (set) => ({
      details: emptyDetails,
      setField: (key, value) =>
        set((state) => ({ details: { ...state.details, [key]: value } })),
      reset: () => set({ details: emptyDetails }),
    }),
    { name: "guest-checkout" },
  ),
);

export default useGuestCheckoutStore;

