import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Currency = "USD" | "EGP";

// Base prices in the app are stored in USD. EGP is derived via a fixed rate.
export const USD_TO_EGP = 50;

interface CurrencyState {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggle: () => void;
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: "USD",
      setCurrency: (c) => set({ currency: c }),
      toggle: () => set({ currency: get().currency === "USD" ? "EGP" : "USD" }),
    }),
    { name: "printhub-currency" },
  ),
);
