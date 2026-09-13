import { CartItem } from "@/types";

export const ORIGINAL_PRICE = 1250;
export const SALE_PRICE = 750;
export const MULTIBUY_PRICE = 750;

export const CHECK_SHIRT_ORIGINAL_PRICE = 1200;
export const CHECK_SHIRT_SALE_PRICE = 600;
export const CHECK_SHIRT_MULTIBUY_PRICE = 600;

export type PriceGroup = "summer" | "check-shirt";

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
};

export function getPriceGroup(productCode: string): PriceGroup {
  return productCode.startsWith("RR") ? "check-shirt" : "summer";
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

export function getUnitPriceForProduct(
  productCode: string,
  items: Pick<CartItem, "quantity" | "productCode">[]
): number {
  const group = getPriceGroup(productCode);
  const qty = groupQuantity(items, group);
  const tier = PRICE_TABLE[group];
  return qty >= 2 ? tier.multibuy : tier.sale;
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
