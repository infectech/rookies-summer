import { Flame } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import {
  getDiscountPercent,
  getOriginalPrice,
  getUnitPriceForProduct,
} from "@/lib/pricing";
import { cn, formatCurrency } from "@/lib/utils";

interface PricingDisplayProps {
  className?: string;
  compact?: boolean;
  productCode?: string;
}

export default function PricingDisplay({
  className,
  compact = false,
  productCode = "SS",
}: PricingDisplayProps) {
  const items = useCart((s) => s.items);
  const originalPrice = getOriginalPrice(productCode);
  const currentSalePrice = getUnitPriceForProduct(productCode, [
    ...items,
    { productCode, quantity: 1 },
  ]);
  const discountPercent = getDiscountPercent(originalPrice, currentSalePrice);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground line-through">
          {formatCurrency(originalPrice)}
        </span>
        <span
          className={cn(
            "font-bold text-[#E53935]",
            compact ? "text-sm sm:text-base" : "text-xl"
          )}
        >
          {formatCurrency(currentSalePrice)}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#E53935] px-2.5 py-0.5 text-[11px] font-bold text-white">
          {discountPercent}% OFF
        </span>
        <span className="flex items-center gap-1 rounded-full border border-[#E53935]/25 px-2.5 py-0.5 text-[11px] font-semibold text-[#E53935]">
          <Flame className="size-3" />
          Limited Time
        </span>
      </div>
    </div>
  );
}
