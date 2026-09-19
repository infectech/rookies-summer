import { ComboProduct } from "@/types";

/**
 * Combo/bundle catalog. This file is the single source of truth for combo
 * definitions. Nothing on the product page hardcodes a specific combo, size
 * count, or price — everything is driven by these records + lib/combo-pricing.ts.
 */
export const combos: ComboProduct[] = [
  {
    id: "combo-trouser",
    slug: "premium-trouser-combo",
    name: "Premium Trouser Combo",
    description: `Build your own trouser combo from our Elite Fabric Contrast Trousers, crafted from exclusive premium Chinese fabric for the modern gentleman.

### Why should you buy from us?
- Exclusive export quality trousers
- providing 3 months of exchange on any issue regarding zipper, waistband, drawstring or sewing issue.
- Exchange will be given as long as stock is available.

### Key Features
- Front Fly Zipper: Smooth front fly with high-quality zipper closure
- Dual Zipper Pockets: Two side pockets with secure zipper for safety and style
- Back Pocket: Designer applique back pocket for everyday convenience
- Contrast Design: Stylish contrast detailing for a modern and refined look
- Perfect Tailoring: Precisely measured fit for a sharp and comfortable silhouette
- Premium Fabric: Made from imported China exclusive fabric for superior quality
- Anti-Pilling Material: Bobble-free fabric that maintains a fresh look over time
- Breathable Comfort: Lightweight and breathable for all-day wear
- Durable Build: Designed for long-lasting performance and everyday use

Pick 2, 3, or 4 trousers to build your combo and save.`,
    comboType: "trouser",
    unitRegularPrice: 1600,
    images: ["/Trouser Combo.png"],
    tierImages: {
      2: "/2pc trouser combo.png",
      3: "/3pc trouser combo.png",
      4: "/4pc trouser combo.png",
    },
    pricingTiers: [
      { slots: 2, comboPrice: 1400 },
      { slots: 3, comboPrice: 2100 },
      { slots: 4, comboPrice: 2650 },
    ],
    defaultSlots: 3,
    allowedProductCodes: ["TR01", "TR02", "TR03", "TR04", "TR05"],
    allowDuplicateProducts: false,
    isActive: true,
  },
  {
    id: "combo-summer-shirt",
    slug: "summer-friend-shirt-combo",
    name: "Summer Friend Shirt Combo",
    description: `Lightweight, breathable cotton shirts bundled for the season. Build your own combo from our Summer Friendly Shirt collection.

### Why Should You Buy From Us?
- Export-quality cotton shirt made for premium comfort and everyday style.
- Summer-friendly fabric that makes it one of our best choices for warm weather.
- 15 Days Exchange Policy for issues related to fabric, buttons, collar, stitching, or other problem.
- Easy Exchange available as long as your preferred size/design is in stock.

### Shirt Details
- Fabric: 100% Cotton
- GSM: Approx. 150 GSM
- Quality: Export Quality
- Fit: Regular Fit
- Feel: Soft, Lightweight, Breathable & Comfortable
- Suitable For: Summer & Everyday Wear

Pick 2, 3, or 4 shirts to build your combo and save.`,
    comboType: "summer-shirt",
    unitRegularPrice: 700,
    images: ["/Summer Shirt Combo.png"],
    tierImages: {
      2: "/2pc summer shirt combo.png",
      3: "/3pc summer shirt combo.png",
      4: "/4pc summer shirt combo.png",
    },
    pricingTiers: [
      { slots: 2, comboPrice: 1300 },
      { slots: 3, comboPrice: 1900 },
      { slots: 4, comboPrice: 2500 },
    ],
    defaultSlots: 2,
    allowedProductCodes: [
      "SS01",
      "SS02",
      "SS03",
      "SS04",
      "SS05",
      "SS06",
      "SS07",
      "SS08",
      "SS09",
      "SS10",
    ],
    allowDuplicateProducts: false,
    isActive: true,
  },
];

export function getComboBySlug(slug: string): ComboProduct | undefined {
  return combos.find((c) => c.slug === slug && c.isActive);
}

export function getComboById(id: string): ComboProduct | undefined {
  return combos.find((c) => c.id === id);
}
