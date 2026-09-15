export type Size = "M" | "L" | "XL" | "XXL";

export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  outOfStockSizes?: Size[];
  isNewArrival?: boolean;
  isCheckShirt?: boolean;
  isTrouser?: boolean;
}

export interface CartItem {
  productCode: string;
  productName: string;
  size: Size;
  quantity: number;
  price: number;
  image: string;
}

// ---------------------------------------------------------------------------
// Combo / bundle products
// ---------------------------------------------------------------------------

export type ComboType = "trouser" | "summer-shirt" | "check-shirt";

/** One admin-defined price point for a given slot count, e.g. "3 pcs -> 2100". */
export interface ComboPricingTier {
  slots: number;
  comboPrice: number;
}

export interface ComboProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  comboType: ComboType;
  /** Regular price of a single unit; used to compute "regular total" and savings. */
  unitRegularPrice: number;
  images: string[];
  pricingTiers: ComboPricingTier[];
  /** Default number of slots shown when the page first loads. */
  defaultSlots: number;
  /** Product codes the customer may pick from for each slot. */
  allowedProductCodes: string[];
  allowDuplicateProducts?: boolean;
  isActive: boolean;
}

/** One selected product for a specific slot in an active combo selection. */
export interface ComboSlotSelection {
  slotIndex: number;
  productCode: string;
  productName: string;
  image: string;
  size: Size | null;
  price: number;
}

export interface ComboCartItem {
  kind: "combo";
  comboId: string;
  comboSlug: string;
  comboName: string;
  slots: ComboSlotSelection[];
  comboPrice: number;
  quantity: number;
  image: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  district: string;
  note?: string;
}

export interface OrderItemPayload {
  productCode: string;
  productName: string;
  size: Size;
  quantity: number;
  price: number;
}

export interface OrderPayload {
  requestId: string;
  customer: CustomerInfo;
  items: OrderItemPayload[];
  deliveryCharge: number;
  total: number;
}

export interface OrderResponse {
  success: boolean;
  orderId?: string;
  message?: string;
}
