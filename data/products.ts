import { Product } from "@/types";
import { SALE_PRICE } from "@/lib/pricing";

const PRODUCT_DESCRIPTION = `### Shirt Details
- Export Quality Premium Shirt
- 100% Cotton Fabric
- Fabric Weight: 210-230 GSM
- Soft & Comfortable
- Durable Stitching

### Features
- Premium Quality
- Perfect fit for everyday wear

### Wash Care
- Machine or hand wash with cold/normal water.
- Use mild detergent.
- Do not bleach.
- Avoid direct sunlight while drying.

### Delivery Information
- Inside Dhaka: 1–2 working days
- Outside Dhaka: 2–3 working days
*Note: Delivery may occasionally be delayed due to unforeseen circumstances or courier-related issues.*`;

// Catalog: images live in /products, named "rookies <photoNumber>.png"
// Each product uses 3 consecutive photos.
const productNames: string[] = [
  "Shadow Line",
  "Urban Crest",
  "Metro Heritage",
  "Urban Royale",
  "Urban Crown",
  "Regal Line",
  "Dark Horizon",
  "Midnight Avenue",
  "Royal Street",
  "Noble Meridian",
];

/**
 * Single source of truth for out-of-stock sizes, keyed by product code.
 * To stock out a product: add/edit its entry here with the sizes that are unavailable.
 * To fully stock out a product (all sizes): list all four sizes, e.g. ["M", "L", "XL", "XXL"].
 * To restock a product: remove its entry (or the specific sizes) from this map.
 */
const outOfStockMap: Record<string, import("@/types").Size[]> = {};

const productsInCodeOrder: Product[] = productNames.map((name, index) => {
  const code = `SS${String(index + 1).padStart(2, "0")}`;
  const photoBase = index * 3;
  return {
    id: index + 1,
    code,
    name,
    description: PRODUCT_DESCRIPTION,
    price: SALE_PRICE,
    images: [1, 2, 3].map(
      (n) => `/products/rookies ${String(photoBase + n).padStart(2, "0")}.png`
    ),
    outOfStockSizes: outOfStockMap[code],
  };
});

const TOTAL_SIZES = 4;

function availableSizeCount(product: Product): number {
  return TOTAL_SIZES - (product.outOfStockSizes?.length ?? 0);
}

export const products: Product[] = [...productsInCodeOrder].sort(
  (a, b) => availableSizeCount(b) - availableSizeCount(a)
);

export function getProductByCode(code: string): Product | undefined {
  return products.find((p) => p.code === code);
}
