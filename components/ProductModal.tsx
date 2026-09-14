"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Product, Size } from "@/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProductSlider, { ProductSliderApi } from "@/components/ProductSlider";
import SizeSelector from "@/components/SizeSelector";
import SizeChart from "@/components/SizeChart";
import PricingDisplay from "@/components/PricingDisplay";
import { useCart } from "@/hooks/use-cart";
import { trackAddToCart, trackViewContent } from "@/lib/pixel";
import { getUnitPriceForProduct } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { BLUR_PLACEHOLDER } from "@/lib/image";

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductModal({
  product,
  open,
  onOpenChange,
}: ProductModalProps) {
  const [size, setSize] = useState<Size | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCart((s) => s.addItem);
  const cartItems = useCart((s) => s.items);
  const sliderApiRef = useRef<ProductSliderApi | null>(null);

  useEffect(() => {
    if (open && product) {
      trackViewContent({
        code: product.code,
        name: product.name,
        price: getUnitPriceForProduct(product.code, [
          ...cartItems,
          { productCode: product.code, quantity: 1 },
        ]),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product]);

  if (!product) return null;

  const handleThumbnailClick = (index: number) => {
    setActiveImage(index);
    sliderApiRef.current?.scrollTo(index);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSize(null);
      setActiveImage(0);
    }
    onOpenChange(nextOpen);
  };

  const sizes: Size[] = ["M", "L", "XL", "XXL"];
  const allSizesOutOfStock = sizes.every(
    (s) => product.outOfStockSizes?.includes(s)
  );
  const isStockout =
    allSizesOutOfStock ||
    (size !== null && (product.outOfStockSizes?.includes(size) ?? false));

  const handleAddToCart = () => {
    if (!size || product.outOfStockSizes?.includes(size)) return;
    const item = {
      productCode: product.code,
      productName: product.name,
      size,
      quantity: 1,
      price: getUnitPriceForProduct(product.code, [
        ...cartItems,
        { productCode: product.code, quantity: 1 },
      ]),
      image: product.images[0],
    };
    addItem(item);
    trackAddToCart(item);
    toast.success("Product added to cart successfully!", {
      description: `${product.name} (${size})`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl sm:max-w-3xl">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <ProductSlider
              images={product.images}
              alt={product.name}
              onApiChange={(api) => {
                sliderApiRef.current = api;
              }}
              onSlideChange={setActiveImage}
            />
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => handleThumbnailClick(i)}
                    className={cn(
                      "relative aspect-square w-16 overflow-hidden rounded-lg border-2 transition-colors",
                      i === activeImage ? "border-gold" : "border-transparent"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-black">
                {product.name}
              </h2>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {product.code}
              </p>
              <PricingDisplay className="mt-2" productCode={product.code} />
            </div>

            <div className="text-sm leading-relaxed text-muted-foreground">
              {product.description.split("\n").map((line, i) => {
                if (line.startsWith("### ")) {
                  return (
                    <h3 key={i} className="mt-4 mb-2 font-semibold text-black first:mt-0">
                      {line.replace("### ", "")}
                    </h3>
                  );
                }
                if (line.startsWith("- ")) {
                  return (
                    <ul key={i} className="list-disc pl-5">
                      <li>{line.replace("- ", "")}</li>
                    </ul>
                  );
                }
                if (line.startsWith("*") && line.endsWith("*")) {
                  return (
                    <p key={i} className="mt-2 text-xs italic">
                      {line.replaceAll("*", "")}
                    </p>
                  );
                }
                if (line.trim() === "") return null;
                
                return (
                  <p key={i} className="mt-1">
                    {line}
                  </p>
                );
              })}
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-black">
                Select Size
              </p>
              <SizeSelector
                value={size}
                onChange={setSize}
                outOfStockSizes={product.outOfStockSizes}
              />
            </div>

            <SizeChart variant={product.isTrouser ? "trouser" : "shirt"} />

            <Button
              className={cn(
                "mt-2 h-12 w-full rounded-full text-base",
                isStockout
                  ? "bg-burgundy text-white disabled:opacity-100"
                  : size
                  ? "bg-black text-white hover:bg-gold hover:text-black"
                  : "bg-muted text-muted-foreground"
              )}
              disabled={!size || isStockout}
              onClick={handleAddToCart}
            >
              {isStockout
                ? "Stockout"
                : size
                ? "Add to Cart"
                : "Select a size"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
