"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, PhoneCall } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/hooks/use-cart";
import { DISTRICTS, getDeliveryCharge } from "@/lib/config";
import { getUnitPriceForProduct } from "@/lib/pricing";
import { trackPurchase } from "@/lib/pixel";
import { OrderItemPayload, OrderPayload, OrderResponse } from "@/types";
import OrderSummary from "@/components/OrderSummary";

const checkoutSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  phone: z
    .string()
    .regex(/^01[3-9]\d{8}$/, "Enter a valid Bangladeshi phone number"),
  address: z.string().min(1, "Address is required"),
  district: z.string().min(1, "District is required"),
  note: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onOrderSubmitting?: (total: number) => void;
  onOrderPlaced?: (orderId: string) => void;
  onOrderFailed?: () => void;
}

export default function CheckoutForm({
  onOrderSubmitting,
  onOrderPlaced,
  onOrderFailed,
}: CheckoutFormProps) {
  const items = useCart((s) => s.items);
  const comboItems = useCart((s) => s.comboItems);
  const subtotal = useCart((s) => s.subtotal());
  const clearCart = useCart((s) => s.clearCart);
  const isEmpty = items.length === 0 && comboItems.length === 0;

  const [submitting, setSubmitting] = useState(false);
  const [district, setDistrict] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      district: "",
      note: "",
    },
  });


  const onSubmit = async (values: CheckoutFormValues) => {
    if (isEmpty) return;
    setSubmitting(true);

    const deliveryCharge = getDeliveryCharge(values.district, subtotal);
    const total = subtotal + deliveryCharge;

    const requestId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const regularItemPayload: OrderItemPayload[] = items.map((i) => ({
      productCode: i.productCode,
      productName: i.productName,
      size: i.size,
      quantity: i.quantity,
      price: getUnitPriceForProduct(i.productCode, items),
    }));

    // Combos are one cart entry but the order sheet only understands flat
    // per-product/size lines, so each selected slot is written out as its
    // own line at its share of the combo price.
    const comboItemPayload: OrderItemPayload[] = comboItems.flatMap((combo) =>
      combo.slots.map((slot) => ({
        productCode: slot.productCode,
        productName: `${combo.comboName} — ${slot.productName}`,
        size: slot.size ?? "M",
        quantity: combo.quantity,
        price: slot.price,
      }))
    );

    const payload: OrderPayload = {
      requestId,
      customer: {
        name: values.name,
        phone: values.phone,
        address: values.address,
        district: values.district,
        note: values.note,
      },
      items: [...regularItemPayload, ...comboItemPayload],
      deliveryCharge,
      total,
    };

    // Navigate to the confirmation screen right away instead of making
    // the customer watch a spinner for the full round trip — the Sheets
    // write itself is fast now, but Apps Script's response delivery
    // still has a few unavoidable seconds of network overhead. The order
    // ID fills in on that screen once the real response arrives; if it
    // ultimately fails, that screen switches to an error state instead.
    onOrderSubmitting?.(total);
    clearCart();

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: OrderResponse = await res.json();

      if (data.success && data.orderId) {
        trackPurchase(data.orderId, total);
        onOrderPlaced?.(data.orderId);
      } else {
        onOrderFailed?.();
      }
    } catch {
      onOrderFailed?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-3xl border border-black/5 bg-white p-5 sm:p-6 lg:grid-cols-[1.2fr_1fr] lg:gap-x-8 lg:[grid-template-areas:'header_header''banner_banner''name_summary''phone_summary''address_summary''button_summary']"
      noValidate
    >
      <h2 className="font-heading text-lg font-semibold text-black lg:[grid-area:header]">
        Delivery Details
      </h2>

      <div className="flex items-start gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground lg:[grid-area:banner]">
        <PhoneCall className="mt-0.5 size-4 shrink-0 text-gold" />
        <p>Our representative will call you shortly to confirm your order.</p>
      </div>

      <div className="flex flex-col gap-1.5 lg:[grid-area:name]">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          placeholder="Your full name"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5 lg:[grid-area:phone]">
        <Label htmlFor="phone">Phone *</Label>
        <Input
          id="phone"
          placeholder="01XXXXXXXXX"
          inputMode="numeric"
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-black/10 p-4 lg:[grid-area:address]">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            placeholder="House, road, area details"
            aria-invalid={!!errors.address}
            {...register("address")}
          />
          {errors.address && (
            <p className="text-xs text-destructive">{errors.address.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="district">District *</Label>
          <Controller
            name="district"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value ?? "");
                  setDistrict(value ?? "");
                }}
              >
                <SelectTrigger
                  id="district"
                  aria-invalid={!!errors.district}
                  className="h-8 w-full"
                >
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.district && (
            <p className="text-xs text-destructive">
              {errors.district.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="note">Note (optional)</Label>
          <Textarea
            id="note"
            placeholder="Anything we should know about your delivery?"
            {...register("note")}
          />
        </div>
      </div>

      <div className="lg:[grid-area:summary] lg:self-start lg:sticky lg:top-24">
        <OrderSummary district={district} />
      </div>

      <Button
        type="submit"
        disabled={submitting || isEmpty}
        className="mt-2 h-12 w-full rounded-full bg-black text-base text-white hover:bg-gold hover:text-black lg:[grid-area:button]"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Placing Order...
          </>
        ) : (
          "Place Order (Cash on Delivery)"
        )}
      </Button>
    </form>
  );
}