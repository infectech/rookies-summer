import Link from "next/link";
import { combos } from "@/data/combos";
import ComboCard from "@/components/combo/ComboCard";

export default function ComboSection() {
  const activeCombos = combos.filter((c) => c.isActive);

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
