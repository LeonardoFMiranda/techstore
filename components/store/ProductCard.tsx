"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  priceInCents: number;
  images: string[];
  category: string;
  stock: number;
}

export function ProductCard({
  id,
  name,
  slug,
  priceInCents,
  images,
  category,
  stock,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const isOutOfStock = stock === 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({
      productId: id,
      name,
      slug,
      priceInCents,
      image: images[0] ?? "",
      stock,
    });
  }

  return (
    <Link href={`/produtos/${slug}`} className="product-card group block">
      {/* Image */}
      <div className="product-card-image">
        <Image
          src={images[0] ?? "/placeholder.png"}
          alt={name}
          width={400}
          height={400}
          className="w-full h-full object-cover"
          priority={false}
        />

        {/* Category badge overlay */}
        <div className="absolute top-2 left-2">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(0,0,0,0.65)",
              color: "var(--text-secondary)",
              backdropFilter: "blur(8px)",
            }}
          >
            {category}
          </span>
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.55)" }}
          >
            <span className="badge badge-error text-xs">Esgotado</span>
          </div>
        )}

        {/* Quick add button */}
        {!isOutOfStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 btn btn-primary btn-sm opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0"
            id={`add-to-cart-${id}`}
            aria-label={`Adicionar ${name} ao carrinho`}
          >
            <ShoppingCart size={14} />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="product-card-body">
        <h3
          className="text-sm font-semibold line-clamp-2 mb-2 leading-snug"
          style={{ color: "var(--text-primary)" }}
        >
          {name}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <p
            className="text-base font-bold"
            style={{ color: "var(--green-accent)" }}
          >
            {formatPrice(priceInCents)}
          </p>

          {stock <= 5 && stock > 0 && (
            <span className="text-xs" style={{ color: "var(--status-pending)" }}>
              Últimas {stock}!
            </span>
          )}
        </div>

        {/* Installments hint */}
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          ou 12x {formatPrice(Math.ceil(priceInCents / 12))} s/juros
        </p>
      </div>
    </Link>
  );
}
