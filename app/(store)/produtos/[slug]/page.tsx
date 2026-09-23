import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductPageClient } from "./ProductPageClient";
import type { Metadata } from "next";
import { formatPrice } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  return db.product.findUnique({ where: { slug, active: true } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Produto não encontrado" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  // Get related products
  const related = await db.product.findMany({
    where: { category: product.category, active: true, NOT: { id: product.id } },
    take: 4,
  });

  return <ProductPageClient product={product} relatedProducts={related} />;
}
