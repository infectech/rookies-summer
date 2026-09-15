import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getComboBySlug } from "@/data/combos";
import { products } from "@/data/products";
import ComboProductPage from "@/components/combo/ComboProductPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const combo = getComboBySlug(slug);
  if (!combo) return {};
  return {
    title: combo.name,
    description: combo.description,
  };
}

export default async function ComboPage({ params }: PageProps) {
  const { slug } = await params;
  const combo = getComboBySlug(slug);
  if (!combo) notFound();

  const allowedProducts = products.filter((p) =>
    combo.allowedProductCodes.includes(p.code)
  );

  return <ComboProductPage combo={combo} allowedProducts={allowedProducts} />;
}
