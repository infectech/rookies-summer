import { CartItem } from "@/types";

export const ORIGINAL_PRICE = 1250;
export const SALE_PRICE = 750;
export const MULTIBUY_PRICE = 750;

export function getDiscountPercent(
  originalPrice = ORIGINAL_PRICE,
  salePrice = SALE_PRICE
) {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export function getCartQuantity(items: Pick<CartItem, "quantity">[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartUnitPrice(items: Pick<CartItem, "quantity">[]) {
  const qty = getCartQuantity(items);
  return qty >= 2 ? MULTIBUY_PRICE : SALE_PRICE;
}

export function getCartSubtotal(items: Pick<CartItem, "quantity">[]) {
  const unitPrice = getCartUnitPrice(items);
  return items.reduce((sum, item) => sum + unitPrice * item.quantity, 0);
}

export function getLineTotal(
  item: Pick<CartItem, "quantity">,
  items: Pick<CartItem, "quantity">[]
) {
  return getCartUnitPrice(items) * item.quantity;
}

export function hasMultiBuyDiscount(items: Pick<CartItem, "quantity">[]) {
  return getCartQuantity(items) >= 2;
}

export function getRegularDeliveryCharge(district: string) {
  return district.trim().toLowerCase() === "dhaka" ? 70 : 130;
}

export function getDeliveryChargeForItems(
  district: string,
  items: Pick<CartItem, "quantity">[]
) {
  if (hasMultiBuyDiscount(items)) {
    return 0;
  }
  return getRegularDeliveryCharge(district);
}
