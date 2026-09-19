"use client";

import CategoryPage from "@/components/CategoryPage";

export default function SummerShirtsPage() {
  return (
    <CategoryPage
      title="Most Summer Friendly Shirts"
      description="Enjoy 40% discount and free delivery on shopping 1400 TK or more."
      comboType="summer-shirt"
      filterProducts={(products) =>
        products.filter((p) => !p.isCheckShirt && !p.isTrouser)
      }
    />
  );
}
