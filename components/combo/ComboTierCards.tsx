import Image from "next/image";
import Link from "next/link";
import { ComboProduct } from "@/types";
import { getAvailableSlotCounts, getComboPrice, getComboSavings } from "@/lib/combo-pricing";
import { formatCurrency } from "@/lib/utils";
import { BLUR_PLACEHOLDER } from "@/lib/image";

interface ComboTierCardsProps {
  combo: ComboProduct;
}

/** Renders one distinct card per pricing tier (2 Pcs, 3 Pcs, 4 Pcs, …), each
 * using its own combo image and linking straight into that tier on the combo
 * builder page. */
export default function ComboTierCards({ combo }: ComboTierCardsProps) {
  const slotCounts = getAvailableSlotCounts(combo);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
      {slotCounts.map((slots) => {
        const image = combo.tierImages?.[slots] ?? combo.images[0];
        const price = getComboPrice(combo, slots);
        const savings = getComboSavings(combo, slots);

        return (
          <Link
            key={slots}
            href={`/combo/${combo.slug}?slots=${slots}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition-shadow hover:shadow-lg sm:rounded-3xl"
          >
            <div className="relative aspect-square w-full">
              <Image
                src={image}
                alt={`${slots} Pcs ${combo.name}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1 p-2.5 sm:gap-2 sm:p-6">
              <h3 className="font-heading text-xs font-semibold leading-tight text-black sm:text-lg md:text-xl">
                {slots} Pcs — {combo.name}
              </h3>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <span className="text-sm font-bold text-[#E53935] sm:text-lg">
                  {formatCurrency(price)}
                </span>
                {savings > 0 && (
                  <span className="text-[10px] font-medium text-muted-foreground sm:text-xs">
                    Save {formatCurrency(savings)}
                  </span>
                )}
              </div>
              <span className="mt-1 inline-flex w-fit items-center rounded-full bg-black px-2.5 py-1.5 text-[10px] font-semibold text-white transition-colors group-hover:bg-gold group-hover:text-black sm:mt-2 sm:px-4 sm:py-2 sm:text-xs">
                Build Your Combo
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
