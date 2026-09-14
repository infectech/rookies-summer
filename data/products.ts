import { Product } from "@/types";
import { CHECK_SHIRT_SALE_PRICE, SALE_PRICE, TROUSER_SALE_PRICE } from "@/lib/pricing";

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
    images: [2, 1, 3].map(
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
    images: [2, 1, 3].map((n) => `/check-shirts/rookies 05-08-26 RR ${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR03",
    name: "Classic Grid",
    images: [8, 7, 9].map((n) => `/check-shirts/rookies 05-08-26 RR ${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR06",
    name: "Streetline Check",
    images: [17, 16, 18].map((n) => `/check-shirts/rookies 05-08-26 RR ${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR07",
    name: "Vintage Grid",
    images: [20, 19, 21].map((n) => `/check-shirts/rookies 05-08-26 RR ${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR08",
    name: "Bold Check",
    images: [23, 22, 24].map((n) => `/check-shirts/rookies 05-08-26 RR ${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR09",
    name: "Urban Plaid",
    images: [26, 25, 27].map((n) => `/check-shirts/rookies 05-08-26 RR ${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR10",
    name: "Heritage Check",
    images: [32, 31, 33].map((n) => `/check-shirts/rookies 05-08-26 RR ${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR12",
    name: "Rugged Check",
    images: [38, 37, 39].map((n) => `/check-shirts/rookies 05-08-26 RR ${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR13",
    name: "Metro Plaid",
    images: [2, 1, 3].map((n) => `/check-shirts/new-${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR14",
    name: "Royal Check",
    images: [5, 4, 6].map((n) => `/check-shirts/new-${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR16",
    name: "Urban Heritage",
    images: [11, 10, 12].map((n) => `/check-shirts/new-${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR17",
    name: "Steel Plaid",
    images: [14, 13, 15].map((n) => `/check-shirts/new-${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR18",
    name: "Classic Line",
    images: [17, 16, 18].map((n) => `/check-shirts/new-${String(n).padStart(2, "0")}.png`),
  },
  {
    code: "RR20",
    name: "Crown Grid",
    images: [23, 22, 24].map((n) => `/check-shirts/new-${String(n).padStart(2, "0")}.png`),
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

const TROUSER_DESCRIPTION = `### Trouser Details
- Fabric: Premium Stretch Twill
- Fit: Regular Fit with Elastic Drawstring Waist
- Feel: Soft, Breathable & Comfortable
- Comfort: Lightweight & Flexible for All-Day Wear
- Suitable For: Casual & Everyday Wear

### Wash Care
- Machine Wash: Cold water / gentle cycle
- Detergent: Use mild detergent
- Bleach: Do not bleach
- Drying: Dry in shade; avoid prolonged direct sunlight
- Ironing: Iron on low heat
- Dry Clean: Not required

### Delivery Information
- Inside Dhaka: 1–2 working days
- Outside Dhaka: 2–3 working days
*Note: Delivery may occasionally be delayed due to unforeseen circumstances or courier-related issues.*`;

// Trouser catalog. Images live in /Trousers, named "rookies <photoNumber>.png".
// Each product uses 3 consecutive photos, codes numbered TR01+.
const trouserProducts: Product[] = [
  {
    code: "TR01",
    name: "Brown Stripe",
    images: [31, 32, 33].map((n) => `/Trousers/rookies ${n}.png`),
  },
  {
    code: "TR02",
    name: "Sand Trail",
    images: [34, 35, 36].map((n) => `/Trousers/rookies ${n}.png`),
  },
  {
    code: "TR03",
    name: "Onyx Track",
    images: [37, 38, 39].map((n) => `/Trousers/rookies ${n}.png`),
  },
  {
    code: "TR04",
    name: "Storm Grey",
    images: [40, 41, 42].map((n) => `/Trousers/rookies ${n}.png`),
  },
  {
    code: "TR05",
    name: "Chalk White",
    images: [43, 44, 45].map((n) => `/Trousers/rookies ${n}.png`),
  },
].map((entry, index) => ({
  id: 3000 + index + 1,
  code: entry.code,
  name: entry.name,
  description: TROUSER_DESCRIPTION,
  price: TROUSER_SALE_PRICE,
  images: entry.images,
  outOfStockSizes: outOfStockMap[entry.code],
  isTrouser: true,
}));

// Availability-based sorting happens live in hooks/use-products.ts,
// once real stock data is merged in.
export const products: Product[] = [
  ...productsInCodeOrder,
  ...checkShirtProducts,
  ...trouserProducts,
];

export function getProductByCode(code: string): Product | undefined {
  return products.find((p) => p.code === code);
}
