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
    description:
      "Build your own trouser combo. Premium China Angle fabric, wrinkle-free finish, styled for casual and smart-casual wear.",
    comboType: "trouser",
    unitRegularPrice: 1600,
    images: [
      "/Trousers/rookies 31.png",
      "/Trousers/rookies 34.png",
      "/Trousers/rookies 37.png",
    ],
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
    description:
      "Lightweight, breathable cotton shirts bundled for the season. Pick 2 or 3 shirts and save.",
    comboType: "summer-shirt",
    unitRegularPrice: 700,
    images: [
      "/products/rookies 01.png",
      "/products/rookies 04.png",
      "/products/rookies 07.png",
    ],
    pricingTiers: [
      { slots: 2, comboPrice: 1300 },
      { slots: 3, comboPrice: 1900 },
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
