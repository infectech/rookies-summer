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

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  district: string;
  area?: string;
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
