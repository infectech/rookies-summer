import Link from "next/link";
import { combos } from "@/data/combos";
import ComboCard from "@/components/combo/ComboCard";
import { ComboType } from "@/types";

interface ComboSectionProps {
  /** When set, only combos of this type are shown. */
  comboType?: ComboType;
}

export default function ComboSection({ comboType }: ComboSectionProps) {
  const activeCombos = combos.filter(
    (c) => c.isActive && (!comboType || c.comboType === comboType)
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
      {activeCombos.map((combo) => (
        <Link key={combo.id} href={`/combo/${combo.slug}`} className="group">
          <ComboCard combo={combo} />
        </Link>
      ))}
    </div>
  );
}
