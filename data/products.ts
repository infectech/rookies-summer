import { Product } from "@/types";
import { CHECK_SHIRT_SALE_PRICE, SALE_PRICE } from "@/lib/pricing";

const PRODUCT_DESCRIPTION = `### Shirt Details
- Fabric: 100% Cotton
- GSM: Approx. 150 GSM
- Quality: Export Quality
- Fit: Regular Fit
- Feel: Soft, Lightweight, Breathable & Comfortable
- Comfort: Lightweight & Airy
- Suitable For: Summer & Everyday Wear

### Wash Care
- Machine Wash: Cold water / gentle cycle
- Detergent: Use mild detergent
- Bleach: Do not bleach
- Drying: Dry in shade; avoid prolonged direct sunlight
- Ironing: Iron on low to medium heat
- Dry Clean: Not required
- Tip: Wash dark and light colors separately.

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

const CHECK_SHIRT_DESCRIPTION = `### Shirt Details
- Export Quality Premium Shirt
- 100% Cotton Fabric
- Fabric Weight: 210-240 GSM
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

// Check shirt catalog, moved over from the rookies (check shirt) project.
// Codes preserve their original RR numbering.
const checkShirtProducts: Product[] = [
  {
    code: "RR01",
    name: "Urban Check",
    images: [1, 2, 3].map((n) => `/check-shirts/rookies 05-08-26 RR ${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR03",
    name: "Classic Grid",
    images: [7, 8, 9].map((n) => `/check-shirts/rookies 05-08-26 RR ${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR06",
    name: "Streetline Check",
    images: [16, 17, 18].map((n) => `/check-shirts/rookies 05-08-26 RR ${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR07",
    name: "Vintage Grid",
    images: [19, 20, 21].map((n) => `/check-shirts/rookies 05-08-26 RR ${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR08",
    name: "Bold Check",
    images: [22, 23, 24].map((n) => `/check-shirts/rookies 05-08-26 RR ${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR09",
    name: "Urban Plaid",
    images: [25, 26, 27].map((n) => `/check-shirts/rookies 05-08-26 RR ${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR10",
    name: "Heritage Check",
    images: [31, 32, 33].map((n) => `/check-shirts/rookies 05-08-26 RR ${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR12",
    name: "Rugged Check",
    images: [37, 38, 39].map((n) => `/check-shirts/rookies 05-08-26 RR ${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR13",
    name: "Metro Plaid",
    images: [1, 2, 3].map((n) => `/check-shirts/new-${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR14",
    name: "Royal Check",
    images: [4, 5, 6].map((n) => `/check-shirts/new-${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR16",
    name: "Urban Heritage",
    images: [10, 11, 12].map((n) => `/check-shirts/new-${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR17",
    name: "Steel Plaid",
    images: [13, 14, 15].map((n) => `/check-shirts/new-${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR18",
    name: "Classic Line",
    images: [16, 17, 18].map((n) => `/check-shirts/new-${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR20",
    name: "Crown Grid",
    images: [22, 23, 24].map((n) => `/check-shirts/new-${String(n).padStart(2, "0")}.png`),
  },
].map((entry, index) => ({
  id: 2000 + index + 1,
  code: entry.code,
  name: entry.name,
  description: CHECK_SHIRT_DESCRIPTION,
  price: CHECK_SHIRT_SALE_PRICE,
  images: entry.images,
  outOfStockSizes: outOfStockMap[entry.code],
  isCheckShirt: true,
}));

// Availability-based sorting happens live in hooks/use-products.ts,
// once real stock data is merged in.
export const products: Product[] = [...productsInCodeOrder, ...checkShirtProducts];

export function getProductByCode(code: string): Product | undefined {
  return products.find((p) => p.code === code);
}
