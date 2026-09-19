"use client";

import CategoryPage from "@/components/CategoryPage";

export default function TrousersPage() {
  return (
    <CategoryPage
      title="Trousers Built For Everyday Comfort"
      description="Enjoy 40% discount and free delivery on shopping 1400 TK or more."
      comboType="trouser"
      filterProducts={(products) => products.filter((p) => p.isTrouser)}
    />
  );
}
