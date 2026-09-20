"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Circle, Eye, Heart, Minus, Pencil, Plus } from "lucide-react";
import { ComboProduct, ComboSlotSelection, Product, Size } from "@/types";
import { Button } from "@/components/ui/button";
import SizeChart from "@/components/SizeChart";
import ProductDescription from "@/components/ProductDescription";
import ComboProductSelectorModal from "@/components/combo/ComboProductSelectorModal";
import { useCart } from "@/hooks/use-cart";
import {
  getAvailableSlotCounts,
  getComboPrice,
  getComboRegularTotal,
  getComboSavings,
} from "@/lib/combo-pricing";
import { cn, formatCurrency } from "@/lib/utils";
import { BLUR_PLACEHOLDER } from "@/lib/image";

interface ComboProductPageProps {
  combo: ComboProduct;
  allowedProducts: Product[];
  /** Preselected slot count, e.g. from a "4 Pcs Combo" card link (?slots=4). */
  initialSlots?: number;
}

export default function ComboProductPage({
  combo,
  allowedProducts,
  initialSlots,
}: ComboProductPageProps) {
  const slotCounts = useMemo(() => getAvailableSlotCounts(combo), [combo]);
  const [slotCount, setSlotCount] = useState(() => {
    if (initialSlots && slotCounts.includes(initialSlots)) return initialSlots;
    return slotCounts.includes(combo.defaultSlots) ? combo.defaultSlots : slotCounts[0];
  });
  const [selections, setSelections] = useState<(ComboSlotSelection | null)[]>(
    Array.from({ length: slotCount }, () => null)
  );
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const addComboItem = useCart((s) => s.addComboItem);
  const openCart = useCart((s) => s.openCart);

  const mainImage = combo.tierImages?.[slotCount] ?? combo.images[0];

  const comboPrice = getComboPrice(combo, slotCount);
  const regularTotal = getComboRegularTotal(combo, slotCount);
  const savings = getComboSavings(combo, slotCount);
  const unitPrice = comboPrice / slotCount;

  const filledCount = selections.filter(Boolean).length;
  const allSelected = filledCount === slotCount;

  const handleSlotCountChange = (next: number) => {
    if (next === slotCount) return;
    setSlotCount(next);
    setSelections((prev) => {
      const copy = prev.slice(0, next);
      while (copy.length < next) copy.push(null);
      return copy;
    });
  };

  const handleSlotClick = (index: number) => setActiveSlot(index);

  const handleProductSelected = (product: Product, size: Size | null) => {
    if (activeSlot === null) return;
    setSelections((prev) => {
      const copy = [...prev];
      copy[activeSlot] = {
        slotIndex: activeSlot,
        productCode: product.code,
        productName: product.name,
        image: product.images[0],
        size,
        price: unitPrice,
      };
      return copy;
    });
    setActiveSlot(null);
  };

  const handleAddToCart = (buyNow: boolean) => {
    if (!allSelected) return;
    const filled = selections as ComboSlotSelection[];
    addComboItem({
      kind: "combo",
      comboId: combo.id,
      comboSlug: combo.slug,
      comboName: combo.name,
      slots: filled,
      comboPrice,
      quantity,
      image: combo.images[0],
    });
    toast.success("Combo added to cart!", {
      description: `${combo.name} (${slotCount} pcs)`,
    });
    if (buyNow) {
      openCart();
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 lg:grid-cols-2 lg:gap-12 lg:px-6">
      {/* LEFT: main photo */}
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <span className="absolute left-3 top-3 z-10 rounded-full bg-[#E53935] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          Sale
        </span>
        <div className="relative aspect-4/5 w-full">
          <Image
            src={mainImage}
            alt={combo.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
          />
        </div>
      </div>

      {/* RIGHT: info + combo builder */}
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-black sm:text-3xl">
            {combo.name}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-lg text-muted-foreground line-through">
            {formatCurrency(regularTotal)}
          </span>
          <span className="text-2xl font-bold text-[#E53935] sm:text-3xl">
            {formatCurrency(comboPrice)}
          </span>
          {savings > 0 && (
            <span className="rounded-full bg-[#E53935]/10 px-2.5 py-1 text-xs font-semibold text-[#E53935]">
              You save {formatCurrency(savings)}
            </span>
          )}
        </div>

        {slotCounts.length > 1 && (
          <div>
            <p className="mb-2 text-sm font-medium text-black">Combo Size</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {slotCounts.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => handleSlotCountChange(count)}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-full border px-3 text-xs font-medium transition-colors sm:h-10 sm:px-5 sm:text-sm",
                    slotCount === count
                      ? "border-black bg-black text-white"
                      : "border-black/15 bg-white text-black hover:border-black/40"
                  )}
                >
                  {count} Pcs — {formatCurrency(getComboPrice(combo, count))}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Combo slot cards */}
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex items-start gap-2 pb-1 sm:flex-wrap sm:gap-3">
            {selections.map((selection, index) => (
              <div key={index} className="flex items-start gap-2 sm:gap-3">
                <div className="flex shrink-0 flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSlotClick(index)}
                    className={cn(
                      "flex size-16 shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border transition-colors sm:size-28",
                      selection
                        ? "border-black/15 bg-white"
                        : "border-dashed border-black/20 bg-muted/40 hover:border-black/40"
                    )}
                  >
                    {selection ? (
                      <div className="relative size-full">
                        <Image
                          src={selection.image}
                          alt={selection.productName}
                          fill
                          sizes="112px"
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL={BLUR_PLACEHOLDER}
                        />
                      </div>
                    ) : (
                      <Plus className="size-5 text-muted-foreground sm:size-6" />
                    )}
                  </button>
                  {!selection && (
                    <span className="w-16 text-center text-[10px] leading-tight text-muted-foreground sm:w-28 sm:text-[11px]">
                      Please select a product!
                    </span>
                  )}
                </div>
                {index < selections.length - 1 && (
                  <Plus className="mt-5 size-3.5 shrink-0 text-muted-foreground sm:mt-10 sm:size-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected product rows */}
        <div className="flex flex-col gap-2">
          {selections.map((selection, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 rounded-lg border border-black/10 px-3 py-2"
            >
              {selection ? (
                <>
                  <span className="truncate text-sm font-medium text-black">
                    {selection.productName}
                    {selection.size ? ` — ${selection.size}` : ""}
                  </span>
                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSlotClick(index)}
                      aria-label="Edit selection"
                      className="text-muted-foreground transition-colors hover:text-black"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <span className="text-sm text-black">{formatCurrency(selection.price)}</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-sm text-muted-foreground">Please select your product!</span>
                  <div className="flex shrink-0 items-center gap-3 text-muted-foreground">
                    <Pencil className="size-4 opacity-40" />
                    <span className="text-sm">------</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Validation banner */}
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium",
            allSelected ? "bg-green-50 text-green-700" : "bg-muted text-muted-foreground"
          )}
        >
          {allSelected ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <Circle className="size-4 shrink-0" />
          )}
          {allSelected
            ? "All products selected"
            : "Please select a product for all items."}
        </div>

        {/* Quantity + CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex h-11 w-fit items-center rounded-full border border-black/15">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-full w-10 items-center justify-center text-black"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-full w-10 items-center justify-center text-black"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              disabled={!allSelected}
              onClick={() => handleAddToCart(false)}
              className="h-11 flex-1 rounded-full border-black text-black disabled:opacity-50 sm:flex-none sm:px-8"
            >
              Add to Cart
            </Button>
            <Button
              disabled={!allSelected}
              onClick={() => handleAddToCart(true)}
              className="h-11 flex-1 rounded-full bg-black text-white hover:bg-gold hover:text-black disabled:opacity-50 sm:flex-none sm:px-8"
            >
              Buy Now
            </Button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setWishlisted((w) => !w)}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-black"
        >
          <Heart className={cn("size-4", wishlisted && "fill-[#E53935] text-[#E53935]")} />
          Add to wishlist
        </button>

        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-[#E53935]">
          <Eye className="size-4 shrink-0" />
          <span>
            <strong>24</strong> people watching this product now!
          </span>
        </div>

        {combo.description && <ProductDescription description={combo.description} />}

        <SizeChart variant={combo.comboType === "trouser" ? "trouser" : "shirt"} />
      </div>

      <ComboProductSelectorModal
        open={activeSlot !== null}
        onOpenChange={(open) => !open && setActiveSlot(null)}
        products={allowedProducts}
        unitPrice={unitPrice}
        onSelect={handleProductSelected}
      />
    </div>
  );
}
