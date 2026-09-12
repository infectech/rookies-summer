"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getCartQuantity,
  getCartUnitPrice,
  getLineTotal,
  ORIGINAL_PRICE,
} from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import { BLUR_PLACEHOLDER } from "@/lib/image";
import { Size } from "@/types";
import { useProducts } from "@/hooks/use-products";

export default function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const closeCart = useCart((s) => s.closeCart);
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const updateSize = useCart((s) => s.updateSize);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = useCart((s) => s.subtotal());
  const products = useProducts();
  const getProductByCode = (code: string) =>
    products.find((p) => p.code === code);
  const cartQuantity = getCartQuantity(items);
  const unitPrice = getCartUnitPrice(items);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b border-black/5">
          <SheetTitle className="font-heading text-lg">Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <ShoppingBag className="size-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Your cart is empty
            </p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={closeCart}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={`${item.productCode}-${item.size}`}
                    className="flex gap-3"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        className="object-cover"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium leading-tight text-black">
                            {item.productName}
                          </p>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            {item.productCode} &middot; Size: 
                            <select
                              value={item.size}
                              onChange={(e) => updateSize(item.productCode, item.size, e.target.value as Size)}
                              className="rounded border border-black/10 bg-transparent px-0.5 py-0.5 text-xs outline-none"
                            >
                              {(["M", "L", "XL", "XXL"] as Size[]).map((s) => {
                                const prod = getProductByCode(item.productCode);
                                const isOut = prod?.outOfStockSizes?.includes(s);
                                return (
                                  <option key={s} value={s} disabled={isOut}>
                                    {s}{isOut ? " (Out of stock)" : ""}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productCode, item.size)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                          aria-label="Remove item"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="flex size-6 items-center justify-center rounded-full border border-black/15 hover:bg-muted"
                            onClick={() =>
                              updateQuantity(
                                item.productCode,
                                item.size,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-4 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="flex size-6 items-center justify-center rounded-full border border-black/15 hover:bg-muted"
                            onClick={() =>
                              updateQuantity(
                                item.productCode,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <p className="text-sm font-medium text-black">
                          {formatCurrency(getLineTotal(item, items))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SheetFooter className="gap-3 border-t border-black/5 bg-white">
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    Unit price
                  </span>
                  <span>{formatCurrency(unitPrice)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-black">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {unitPrice < ORIGINAL_PRICE && (
                  <div className="flex justify-between text-sm font-medium text-[#E53935]">
                    <span>You save</span>
                    <span>{formatCurrency((ORIGINAL_PRICE - unitPrice) * cartQuantity)}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Delivery charge is calculated at checkout based on your district.
                </p>
              </div>
              <Separator className="mt-1" />
              <Link href="/checkout" className="w-full" onClick={closeCart}>
                <Button className="h-12 w-full rounded-full bg-black text-base text-white hover:bg-gold hover:text-black">
                  Checkout
                </Button>
              </Link>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
