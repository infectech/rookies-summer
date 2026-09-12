import { useEffect, useMemo } from "react";
import { products as baseProducts } from "@/data/products";
import { useStock } from "@/hooks/use-stock";
import { Product } from "@/types";

const TOTAL_SIZES = 4;

// 0 = all sizes in stock, 1 = some sizes out of stock, 2 = all sizes out of stock.
function availabilityTier(product: Product): number {
  const outOfStockCount = product.outOfStockSizes?.length ?? 0;
  if (outOfStockCount === 0) return 0;
  if (outOfStockCount >= TOTAL_SIZES) return 2;
  return 1;
}

// Merges the static product catalog with live out-of-stock data
// polled from the Stock sheet via /api/stock, then sorts so fully
// in-stock products come first, partially out-of-stock next, and
// fully out-of-stock products last.
export function useProducts(): Product[] {
  const stock = useStock((s) => s.stock);
  const startPolling = useStock((s) => s.startPolling);

  useEffect(() => startPolling(), [startPolling]);

  return useMemo(() => {
    const merged = baseProducts.map((product) => ({
      ...product,
      outOfStockSizes: stock[product.code] ?? product.outOfStockSizes,
    }));

    return merged.sort(
      (a, b) => availabilityTier(a) - availabilityTier(b)
    );
  }, [stock]);
}

export function useProductByCode(code: string): Product | undefined {
  const products = useProducts();
  return products.find((p) => p.code === code);
}
