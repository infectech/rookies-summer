"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { useProducts } from "@/hooks/use-products";
import { Product } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency, cn } from "@/lib/utils";
import { BLUR_PLACEHOLDER } from "@/lib/image";

type ShirtFilter = "all" | "check" | "stripe";

const FILTERS: { value: ShirtFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "check", label: "Check Shirt" },
  { value: "stripe", label: "Stripe Shirt" },
];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<ShirtFilter>("all");
  const itemCount = useCart((s) => s.itemCount());
  const subtotal = useCart((s) => s.subtotal());
  const openCart = useCart((s) => s.openCart);
  const products = useProducts();
  const summerProducts = products.filter((p) => !p.isCheckShirt);
  const checkShirtProducts = products.filter((p) => p.isCheckShirt);

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <>
      <section className="w-full">
        <Image
          src="/hero.png"
          alt="Rookies DNMCO premium shirt"
          width={0}
          height={0}
          sizes="100vw"
          priority
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          className="h-auto w-full"
        />
      </section>

      <section id="products" className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-8">
        <div id="check-shirts" className="mb-6 flex scroll-mt-20 items-center justify-center gap-6 sm:gap-10">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "border-b-2 pb-1 text-xs font-semibold uppercase tracking-wider transition-colors sm:text-sm",
                filter === f.value
                  ? "border-gold text-black"
                  : "border-transparent text-muted-foreground hover:text-black"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filter !== "check" && (
          <>
            <div className="mb-10 text-center">
              <h2 className="font-heading text-3xl font-semibold text-black">
                Most Summer Friendly Shirts
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Enjoy 40% discount and free delivery on shopping 1500 TK or more.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-5">
              {summerProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={handleSelect}
                  index={index}
                />
              ))}
            </div>
          </>
        )}

        {filter !== "stripe" && (
          <>
            <div className={cn("mb-10 text-center", filter !== "check" && "mt-16")}>
              <h2 className="font-heading text-3xl font-semibold text-black">
                Need Check Shirts?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try our best check shirt collection, but might not feel summer
                friendly to everyone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-5">
              {checkShirtProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={handleSelect}
                  index={index}
                />
              ))}
            </div>
          </>
        )}
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
