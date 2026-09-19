"use client";

import CategoryPage from "@/components/CategoryPage";

export default function CheckShirtsPage() {
  return (
    <CategoryPage
      title="Need Check Shirts?"
      description="Try our best check shirt collection, but might not feel summer friendly to everyone."
      filterProducts={(products) => products.filter((p) => p.isCheckShirt)}
    />
  );
}
