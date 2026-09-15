"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Separator } from "@/components/ui/separator";
import { getDeliveryCharge, getRegularDeliveryCharge } from "@/lib/config";
import { BLUR_PLACEHOLDER } from "@/lib/image";
import { Size } from "@/types";
import { useProducts } from "@/hooks/use-products";
import { getComboRegularTotal } from "@/lib/combo-pricing";
import { getComboById } from "@/data/combos";
import { getLineTotal, getOriginalPrice } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";

interface OrderSummaryProps {
  district?: string;
}

export default function OrderSummary({ district }: OrderSummaryProps) {
  const items = useCart((s) => s.items);
  const comboItems = useCart((s) => s.comboItems);
  const subtotal = useCart((s) => s.subtotal());
  const updateQuantity = useCart((s) => s.updateQuantity);
  const updateSize = useCart((s) => s.updateSize);
  const removeItem = useCart((s) => s.removeItem);
  const removeComboItem = useCart((s) => s.removeComboItem);
  const products = useProducts();
  const getProductByCode = (code: string) =>
    products.find((p) => p.code === code);
  const regularTotal =
    items.reduce(
      (sum, item) => sum + getOriginalPrice(item.productCode) * item.quantity,
      0
    ) +
    comboItems.reduce((sum, combo) => {
      const definition = getComboById(combo.comboId);
      if (!definition) return sum;
      return sum + getComboRegularTotal(definition, combo.slots.length) * combo.quantity;
    }, 0);
  const totalSavings = Math.max(0, regularTotal - subtotal);
  const deliveryCharge =
    district ? getDeliveryCharge(district, subtotal) : null;
  const regularDeliveryCharge =
    district ? getRegularDeliveryCharge(district) : null;
  const total = subtotal + (deliveryCharge ?? 0);

  return (
    <div className="rounded-2xl border border-black/10 bg-muted/20 p-5 sm:p-6">
      <h2 className="font-heading text-lg font-semibold text-black">
        Order Summary
      </h2>
      <div className="mt-4 flex flex-col gap-4">
        {comboItems.map((combo, index) => (
          <div
            key={`${combo.comboId}-${index}`}
            className="flex flex-col gap-2 rounded-xl border border-black/10 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={combo.image}
                    alt={combo.comboName}
                    fill
                    sizes="64px"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={BLUR_PLACEHOLDER}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium leading-tight text-black">
                    {combo.comboName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {combo.slots.length} pcs combo &middot; Qty {combo.quantity}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeComboItem(combo.comboId, index)}
                className="text-muted-foreground transition-colors hover:text-destructive"
                aria-label="Remove combo"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <ul className="flex flex-col gap-1 pl-1 text-xs text-muted-foreground">
              {combo.slots.map((slot, i) => (
                <li key={i}>
                  {slot.productName}
                  {slot.size ? ` — ${slot.size}` : ""}
                </li>
              ))}
            </ul>
            <div className="flex justify-end text-sm font-medium text-black">
              {formatCurrency(combo.comboPrice * combo.quantity)}
            </div>
          </div>
        ))}
        {items.map((item) => (
          <div key={`${item.productCode}-${item.size}`} className="flex gap-3">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image
                src={item.image}
                alt={item.productName}
                fill
                sizes="64px"
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
              />
            </div>
            <div className="flex flex-1 flex-col justify-center gap-0.5">
              <p className="text-sm font-medium leading-tight text-black">
                {item.productName}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Size:</span>
                <select
                  value={item.size}
                  onChange={(e) => updateSize(item.productCode, item.size, e.target.value as Size)}
                  className="rounded-md border border-black/10 bg-transparent px-1 py-0.5 text-xs outline-none"
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
              <div className="mt-1 flex items-center gap-2">
                <button
                  type="button"
                  className="flex size-6 items-center justify-center rounded-full border border-black/15 hover:bg-muted disabled:opacity-40"
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
                <span className="w-5 text-center text-sm">{item.quantity}</span>
                <button
                  type="button"
                  className="flex size-6 items-center justify-center rounded-full border border-black/15 hover:bg-muted"
                  onClick={() =>
                    updateQuantity(item.productCode, item.size, item.quantity + 1)
                  }
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.productCode, item.size)}
                  className="ml-1 text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="Remove item"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            <p className="self-center text-sm font-medium text-black">
              {formatCurrency(getLineTotal(item, items))}
            </p>
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Regular Price</span>
          <span className="line-through">{formatCurrency(regularTotal)}</span>
        </div>
        <div className="flex justify-between font-medium text-[#E53935]">
          <span>Offer Price</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {totalSavings > 0 && (
          <div className="flex justify-between text-sm font-medium text-[#E53935]">
            <span>You save</span>
            <span>{formatCurrency(totalSavings)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery</span>
          <span>
            {deliveryCharge !== null ? (
              <span className="flex items-center gap-2">
                 {subtotal >= 1000 && <span className="text-xs line-through text-muted-foreground">{formatCurrency(regularDeliveryCharge ?? 0)}</span>}
                 {formatCurrency(deliveryCharge)}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Select district
              </span>
            )}
          </span>
        </div>
        <div className="mt-2 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-black">Delivery Time</p>
          <p>Inside Dhaka: 1–2 working days</p>
          <p>Outside Dhaka: 2–3 working days</p>
          <p className="mt-1">Delivery may occasionally be delayed due to unforeseen circumstances or courier-related issues.</p>
        </div>
        <Separator className="my-1" />
        <div className="flex justify-between text-base font-semibold text-black">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
