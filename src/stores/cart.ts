import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ParsedModel } from "@/lib/mock-parser";

export interface CartItem {
  id: string;
  model: ParsedModel;
  materialId: string;
  materialName: string;
  pricePerGram: number;
  color: string;
  layerHeight: number;
  infillPct: number;
  finishing: string[];
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface CartState {
  items: CartItem[];
  configuratorModel: ParsedModel | null;
  setConfiguratorModel: (m: ParsedModel | null) => void;
  addItem: (item: CartItem) => void;
  updateItem: (id: string, patch: Partial<CartItem>) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      configuratorModel: null,
      setConfiguratorModel: (m) => set({ configuratorModel: m }),
      addItem: (item) => set((s) => ({ items: [...s.items, item] })),
      updateItem: (id, patch) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "printhub-cart" },
  ),
);
