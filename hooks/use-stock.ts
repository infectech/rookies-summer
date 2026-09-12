import { create } from "zustand";
import { Size } from "@/types";

export type StockMap = Record<string, Size[]>;

const POLL_INTERVAL_MS = 60_000;

interface StockState {
  stock: StockMap;
  loaded: boolean;
  fetchStock: () => Promise<void>;
  startPolling: () => () => void;
}

export const useStock = create<StockState>()((set, get) => ({
  stock: {},
  loaded: false,
  fetchStock: async () => {
    try {
      const res = await fetch("/api/stock", { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.stock) {
        set({ stock: data.stock, loaded: true });
      }
    } catch {
      // Keep last known stock on failure.
    }
  },
  startPolling: () => {
    get().fetchStock();
    const id = setInterval(() => get().fetchStock(), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  },
}));
