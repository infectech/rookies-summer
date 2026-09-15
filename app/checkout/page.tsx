"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { trackInitiateCheckout } from "@/lib/pixel";
import CheckoutForm from "@/components/CheckoutForm";
import OrderSuccess from "@/components/OrderSuccess";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const comboItems = useCart((s) => s.comboItems);
  const subtotal = useCart((s) => s.subtotal());
  const closeCart = useCart((s) => s.closeCart);
  const [placed, setPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [placedTotal, setPlacedTotal] = useState<number | null>(null);
  const [placedFailed, setPlacedFailed] = useState(false);
  const isEmpty = items.length === 0 && comboItems.length === 0;

  useEffect(() => {
    closeCart();
    if (items.length > 0) {
      trackInitiateCheckout(items, subtotal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isEmpty && !placed) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-semibold text-black">
          Your cart is empty
        </h1>
        <p className="text-sm text-muted-foreground">
          Add a few items to your cart before heading to checkout.
        </p>
        <Link href="/#products">
          <Button className="h-11 rounded-full bg-black text-white hover:bg-gold hover:text-black">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-black"
      >
        <ChevronLeft className="size-4" />
        Continue Shopping
      </Link>

      {!placed && (
        <>
          <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-black sm:text-3xl">
            Checkout
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cash on delivery &mdash; pay when your order arrives.
          </p>
        </>
      )}

      {placed ? (
        <OrderSuccess
          orderId={placedOrderId}
          total={placedTotal ?? 0}
          failed={placedFailed}
        />
      ) : (
        <div className="mt-8 mx-auto max-w-xl lg:max-w-none">
          <CheckoutForm
            onOrderSubmitting={(total) => {
              setPlacedTotal(total);
              setPlaced(true);
            }}
            onOrderPlaced={(orderId) => {
              setPlacedOrderId(orderId);
            }}
            onOrderFailed={() => {
              setPlacedFailed(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
