import Image from "next/image";
import { ComboProduct } from "@/types";
import { getAvailableSlotCounts, getComboPrice, getComboSavings } from "@/lib/combo-pricing";
import { formatCurrency } from "@/lib/utils";
import { BLUR_PLACEHOLDER } from "@/lib/image";

interface ComboCardProps {
  combo: ComboProduct;
}

export default function ComboCard({ combo }: ComboCardProps) {
  const slotCounts = getAvailableSlotCounts(combo);
  const minSlots = slotCounts[0];
  const maxSlots = slotCounts[slotCounts.length - 1];
  const startingPrice = getComboPrice(combo, minSlots);
  const maxSavings = getComboSavings(combo, maxSlots);

  return (
    <div className="flex overflow-hidden rounded-3xl border border-black/5 bg-white transition-shadow group-hover:shadow-lg">
      <div className="relative aspect-square w-2/5 shrink-0 sm:w-1/3">
        <Image
          src={combo.images[0]}
          alt={combo.name}
          fill
          sizes="(max-width: 640px) 40vw, 25vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
        />
        <span className="absolute left-2 top-2 rounded-full bg-[#E53935] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          Combo
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2 p-4 sm:p-6">
        <h3 className="font-heading text-lg font-semibold text-black sm:text-xl">
          {combo.name}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{combo.description}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Starting at</span>
          <span className="text-lg font-bold text-[#E53935]">
            {formatCurrency(startingPrice)}
          </span>
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          {minSlots === maxSlots ? `${minSlots} pcs` : `${minSlots}–${maxSlots} pcs`} &middot; Save
          up to {formatCurrency(maxSavings)}
        </p>
        <span className="mt-2 inline-flex w-fit items-center rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-gold group-hover:text-black">
          Build Your Combo
        </span>
      </div>
    </div>
  );
}
