import { useEffect, useMemo } from "react";
import { products as baseProducts } from "@/data/products";
import { useStock } from "@/hooks/use-stock";
import { Product } from "@/types";

// Merges the static product catalog with live out-of-stock data
// polled from the Stock sheet via /api/stock.
export function useProducts(): Product[] {
  const stock = useStock((s) => s.stock);
  const startPolling = useStock((s) => s.startPolling);

  useEffect(() => startPolling(), [startPolling]);

  return useMemo(
    () =>
      baseProducts.map((product) => ({
        ...product,
        outOfStockSizes: stock[product.code] ?? product.outOfStockSizes,
      })),
    [stock]
  );
}

export function useProductByCode(code: string): Product | undefined {
  const products = useProducts();
  return products.find((p) => p.code === code);
}
