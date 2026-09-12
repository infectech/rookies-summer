import { useCart } from "@/hooks/use-cart";
import {
  getCartQuantity,
  getDiscountPercent,
  MULTIBUY_PRICE,
  ORIGINAL_PRICE,
  SALE_PRICE,
} from "@/lib/pricing";
import { cn, formatCurrency } from "@/lib/utils";

interface PricingDisplayProps {
  className?: string;
  compact?: boolean;
}

export default function PricingDisplay({
  className,
  compact = false,
}: PricingDisplayProps) {
  const items = useCart((s) => s.items);
  const qty = getCartQuantity(items);
  const currentSalePrice = qty >= 2 ? MULTIBUY_PRICE : SALE_PRICE;
  const discountPercent = getDiscountPercent(ORIGINAL_PRICE, currentSalePrice);

  return (
    <div className={cn("flex flex-wrap items-center gap-2 sm:flex-nowrap", className)}>
      <span className="text-muted-foreground line-through">
        {formatCurrency(ORIGINAL_PRICE)}
      </span>
      <span
        className={cn(
          "font-bold text-[#E53935]",
          compact ? "text-sm sm:text-base" : "text-xl"
        )}
      >
        {formatCurrency(currentSalePrice)}
      </span>
      <span className="rounded-full bg-[#E53935]/10 px-2 py-0.5 text-[11px] font-bold text-[#E53935]">
        {discountPercent}% off
      </span>
      <span className="rounded-full bg-[#E53935]/10 px-2 py-0.5 text-[11px] font-bold text-[#E53935]">
        Limited Time
      </span>
    </div>
  );
}
