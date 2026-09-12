import { GOOGLE_SHEET_ENDPOINT } from "@/lib/config";
import { Size } from "@/types";

export type StockMap = Record<string, Size[]>;

interface StockResponse {
  success: boolean;
  stock?: StockMap;
  message?: string;
}

// Server-side only: proxies the Apps Script web app's doGet(?action=stock)
// so the Apps Script URL never ships to the client.
export async function fetchStock(): Promise<StockMap> {
  if (!GOOGLE_SHEET_ENDPOINT) {
    return {};
  }

  const res = await fetch(`${GOOGLE_SHEET_ENDPOINT}?action=stock`, {
    method: "GET",
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Stock API responded with status ${res.status}`);
  }

  const data = (await res.json()) as StockResponse;

  if (!data.success || !data.stock) {
    throw new Error(data.message ?? "Failed to load stock");
  }

  return data.stock;
}
