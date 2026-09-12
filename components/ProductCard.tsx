"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ShoppingCart, TriangleAlert } from "lucide-react";
import { Product, Size } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductSlider from "@/components/ProductSlider";
import PricingDisplay from "@/components/PricingDisplay";
import { useCart } from "@/hooks/use-cart";
import { trackAddToCart } from "@/lib/pixel";
import { SALE_PRICE } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  index?: number;
}

export function ProductCard({ product, onSelect, index = 0 }: ProductCardProps) {
  const sizes: Size[] = ["M", "L", "XL", "XXL"];
  const availableSizes = sizes.filter(
    (s) => !product.outOfStockSizes?.includes(s)
  );
  const [size, setSize] = useState<Size>(() => availableSizes[0] ?? "M");
  const isStockout = availableSizes.length === 0;
  const addItem = useCart((s) => s.addItem);

  useEffect(() => {
    if (product.outOfStockSizes?.includes(size)) {
      setSize(availableSizes[0] ?? size);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.outOfStockSizes]);

  const handleAddToCart = () => {
    if (!size || product.outOfStockSizes?.includes(size)) return;
    const item = {
      productCode: product.code,
      productName: product.name,
      size,
      quantity: 1,
      price: SALE_PRICE,
      image: product.images[0],
    };

    addItem(item);
    trackAddToCart(item);
    toast.success("Product added to cart successfully!", {
      description: `${product.name} - Size ${size}`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06, ease: "easeOut" }}
      className="flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(product)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(product);
          }
        }}
        className="relative block cursor-pointer text-left"
        aria-label={`View ${product.name}`}
      >
        <ProductSlider images={product.images} alt={product.name} className="rounded-none" />
        {product.isNewArrival && (
          <Badge className="absolute right-2 top-2 z-10 bg-gold text-black shadow-sm">
            New Arrival
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-2.5 sm:p-4">
        <h3 className="font-heading text-sm font-medium leading-snug text-black sm:text-lg">
          {product.name}
        </h3>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
          {product.code}
        </p>
        <PricingDisplay compact className="mt-1" />

        <div className="mt-2 grid grid-cols-4 gap-1">
          {sizes.map((option) => {
            const isOutOfStock = product.outOfStockSizes?.includes(option);
            return (
              <button
                key={option}
                type="button"
                disabled={isOutOfStock}
                onClick={() => !isOutOfStock && setSize(option)}
                className={cn(
                  "h-7 rounded-full border text-[11px] font-semibold transition-colors",
                  isOutOfStock
                    ? "cursor-not-allowed border-black/5 bg-gray-100 text-gray-400 opacity-50 line-through"
                    : size === option
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-muted text-black hover:border-black/30"
                )}
                aria-disabled={isOutOfStock}
                aria-pressed={size === option}
              >
                {option}
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isStockout}
          className={cn(
            "mt-2 h-9 w-full rounded-full text-xs text-white transition-colors disabled:opacity-100 sm:mt-3 sm:h-11 sm:text-sm",
            isStockout
              ? "bg-burgundy hover:bg-burgundy"
              : "bg-black hover:bg-gold hover:text-black"
          )}
        >
          {isStockout ? (
            <TriangleAlert className="size-4" />
          ) : (
            <ShoppingCart className="size-4" />
          )}
          {isStockout ? "Stockout" : "Add to Cart"}
        </Button>
        <Button
          type="button"
          onClick={() => onSelect(product)}
          className="h-8 rounded-full bg-gold text-xs font-semibold text-black transition-all hover:bg-gold/80 sm:mt-1 sm:h-9"
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
}

export default ProductCard;
