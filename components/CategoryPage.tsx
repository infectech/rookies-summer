"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import ComboSection from "@/components/combo/ComboSection";
import { useProducts } from "@/hooks/use-products";
import { Product } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { ComboType } from "@/types";

interface CategoryPageProps {
  title: string;
  description: string;
  /** Which products to show, given the full merged product catalog. */
  filterProducts: (products: Product[]) => Product[];
  /** When set, that combo type's combo(s) are shown above the product grid. */
  comboType?: ComboType;
}

export default function CategoryPage({
  title,
  description,
  filterProducts,
  comboType,
}: CategoryPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const itemCount = useCart((s) => s.itemCount());
  const subtotal = useCart((s) => s.subtotal());
  const openCart = useCart((s) => s.openCart);
  const products = useProducts();
  const categoryProducts = filterProducts(products);

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <>
      <section className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-3xl font-semibold text-black">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        {comboType && (
          <div className="mb-16">
            <ComboSection comboType={comboType} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-5">
          {categoryProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={handleSelect}
              index={index}
            />
          ))}
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {itemCount > 0 && (
        <button
          type="button"
          onClick={openCart}
          className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-full bg-black px-5 py-4 text-white shadow-lg shadow-black/20 md:hidden"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <ShoppingBag className="size-4" />
            {itemCount} item{itemCount > 1 ? "s" : ""}
          </span>
          <span className="text-sm font-semibold text-gold">
            {formatCurrency(subtotal)}
          </span>
        </button>
      )}
    </>
  );
}
