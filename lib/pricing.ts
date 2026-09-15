import { CartItem } from "@/types";
import { getComboById } from "@/data/combos";
import { getTierForSlots } from "@/lib/combo-pricing";

export const ORIGINAL_PRICE = 1250;
export const SALE_PRICE = 700;
export const MULTIBUY_PRICE = 700;

export const CHECK_SHIRT_ORIGINAL_PRICE = 1200;
export const CHECK_SHIRT_SALE_PRICE = 600;
export const CHECK_SHIRT_MULTIBUY_PRICE = 600;

export const TROUSER_ORIGINAL_PRICE = 1300;
export const TROUSER_SALE_PRICE = 799;
export const TROUSER_MULTIBUY_PRICE = 799;

export type PriceGroup = "summer" | "check-shirt" | "trouser";

const PRICE_TABLE: Record<
  PriceGroup,
  { original: number; sale: number; multibuy: number }
> = {
  summer: {
    original: ORIGINAL_PRICE,
    sale: SALE_PRICE,
    multibuy: MULTIBUY_PRICE,
  },
  "check-shirt": {
    original: CHECK_SHIRT_ORIGINAL_PRICE,
    sale: CHECK_SHIRT_SALE_PRICE,
    multibuy: CHECK_SHIRT_MULTIBUY_PRICE,
  },
  trouser: {
    original: TROUSER_ORIGINAL_PRICE,
    sale: TROUSER_SALE_PRICE,
    multibuy: TROUSER_MULTIBUY_PRICE,
  },
};

export function getPriceGroup(productCode: string): PriceGroup {
  if (productCode.startsWith("RR")) return "check-shirt";
  if (productCode.startsWith("TR")) return "trouser";
  return "summer";
}

export function getOriginalPrice(productCode: string): number {
  return PRICE_TABLE[getPriceGroup(productCode)].original;
}

export function getDiscountPercent(
  originalPrice = ORIGINAL_PRICE,
  salePrice = SALE_PRICE
) {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export function getCartQuantity(items: Pick<CartItem, "quantity">[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function groupQuantity(
  items: Pick<CartItem, "quantity" | "productCode">[],
  group: PriceGroup
) {
  return items
    .filter((i) => getPriceGroup(i.productCode) === group)
    .reduce((sum, i) => sum + i.quantity, 0);
}

/**
 * Maps a price group to the combo whose pricing tiers should also apply to
 * standalone shopping, so a customer gets the same per-unit price whether
 * or not they use the combo builder.
 */
const GROUP_COMBO_ID: Partial<Record<PriceGroup, string>> = {
  trouser: "combo-trouser",
};

export function getUnitPriceForProduct(
  productCode: string,
  items: Pick<CartItem, "quantity" | "productCode">[]
): number {
  const group = getPriceGroup(productCode);
  const tier = PRICE_TABLE[group];

  // Summer shirts are a flat price regardless of quantity, matching the
  // combo builder's per-unit price so customers get the same deal with or
  // without using the combo flow.
  if (group === "summer") return tier.sale;

  const comboId = GROUP_COMBO_ID[group];
  const combo = comboId ? getComboById(comboId) : undefined;

  if (!combo) {
    const qty = groupQuantity(items, group);
    return qty >= 2 ? tier.multibuy : tier.sale;
  }

  const qty = groupQuantity(items, group);
  if (qty < 2) return tier.sale;

  const tiers = combo.pricingTiers.map((t) => t.slots).sort((a, b) => a - b);
  const matchedSlots = [...tiers].reverse().find((slots) => qty >= slots) ?? tiers[0];
  return getTierForSlots(combo, matchedSlots).comboPrice / matchedSlots;
}

/**
 * @deprecated Prices now vary by product group (see getUnitPriceForProduct).
 * Kept for call sites that only deal with a single-group cart (e.g. the
 * summer-shirt storefront grid) — falls back to the "summer" tier.
 */
export function getCartUnitPrice(
  items: Pick<CartItem, "quantity" | "productCode">[]
) {
  const qty = getCartQuantity(items);
  return qty >= 2 ? MULTIBUY_PRICE : SALE_PRICE;
}

export function getCartSubtotal(
  items: Pick<CartItem, "quantity" | "productCode">[]
) {
  return items.reduce(
    (sum, item) =>
      sum + getUnitPriceForProduct(item.productCode, items) * item.quantity,
    0
  );
}

export function getLineTotal(
  item: Pick<CartItem, "quantity" | "productCode">,
  items: Pick<CartItem, "quantity" | "productCode">[]
) {
  return getUnitPriceForProduct(item.productCode, items) * item.quantity;
}

export function hasMultiBuyDiscount(
  items: Pick<CartItem, "quantity" | "productCode">[],
  group: PriceGroup = "summer"
) {
  return groupQuantity(items, group) >= 2;
}

export function getRegularDeliveryCharge(district: string) {
  return district.trim().toLowerCase() === "dhaka" ? 70 : 130;
}

export function getDeliveryChargeForItems(
  district: string,
  items: Pick<CartItem, "quantity" | "productCode">[]
) {
  const qty = getCartQuantity(items);
  if (qty >= 2) {
    return 0;
  }
  return getRegularDeliveryCharge(district);
}
