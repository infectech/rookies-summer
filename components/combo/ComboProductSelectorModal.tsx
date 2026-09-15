"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { PackageX } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import SizeSelector from "@/components/SizeSelector";
import { Button } from "@/components/ui/button";
import { Product, Size } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import { BLUR_PLACEHOLDER } from "@/lib/image";

interface ComboProductSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  unitPrice: number;
  onSelect: (product: Product, size: Size | null) => void;
}

export default function ComboProductSelectorModal({
  open,
  onOpenChange,
  products,
  unitPrice,
  onSelect,
}: ComboProductSelectorModalProps) {
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [size, setSize] = useState<Size | null>(null);

  const activeProduct = useMemo(
    () => products.find((p) => p.code === activeCode) ?? null,
    [products, activeCode]
  );

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setActiveCode(null);
      setSize(null);
    }
    onOpenChange(next);
  };

  const handleConfirm = () => {
    if (!activeProduct) return;
    onSelect(activeProduct, size);
    handleOpenChange(false);
  };

  const sizes: Size[] = ["M", "L", "XL", "XXL"];
  const allSizesOut = activeProduct
    ? sizes.every((s) => activeProduct.outOfStockSizes?.includes(s))
    : false;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl sm:max-w-2xl">
        <DialogTitle className="font-heading text-lg font-semibold text-black">
          {activeProduct ? "Choose size" : "Select a product"}
        </DialogTitle>

        {!activeProduct && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {products.map((product) => {
              const outOfStock =
                sizes.every((s) => product.outOfStockSizes?.includes(s)) ?? false;
              return (
                <button
                  key={product.code}
                  type="button"
                  disabled={outOfStock}
                  onClick={() => setActiveCode(product.code)}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-xl border text-left transition-colors",
                    outOfStock
                      ? "cursor-not-allowed border-black/10 opacity-50"
                      : "border-black/10 hover:border-black/40"
                  )}
                >
                  <div className="relative aspect-3/4 w-full bg-muted">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                    />
                    {outOfStock && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 text-white">
                        <PackageX className="size-5" />
                        <span className="text-xs font-medium">Out of stock</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 p-2">
                    <span className="line-clamp-1 text-sm font-medium text-black">
                      {product.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(unitPrice)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {activeProduct && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="relative aspect-3/4 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={activeProduct.images[0]}
                  alt={activeProduct.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                />
              </div>
              <div className="flex flex-col justify-center gap-1">
                <p className="font-medium text-black">{activeProduct.name}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {activeProduct.code}
                </p>
                <p className="text-sm font-semibold text-black">
                  {formatCurrency(unitPrice)}
                </p>
              </div>
            </div>

            {allSizesOut ? (
              <p className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                <PackageX className="size-4" /> This product is currently out of stock.
              </p>
            ) : (
              <div>
                <p className="mb-2 text-sm font-medium text-black">Select Size</p>
                <SizeSelector
                  value={size}
                  onChange={setSize}
                  outOfStockSizes={activeProduct.outOfStockSizes}
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => {
                  setActiveCode(null);
                  setSize(null);
                }}
              >
                Back
              </Button>
              <Button
                className="flex-1 rounded-full bg-black text-white hover:bg-gold hover:text-black"
                disabled={!size || allSizesOut}
                onClick={handleConfirm}
              >
                Confirm selection
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
