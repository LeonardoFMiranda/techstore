"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ShoppingCart,
  ChevronLeft,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
  Check,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { ProductCard } from "@/components/store/ProductCard";
import type { Product } from "@prisma/client";

interface ProductPageClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();
  const isOutOfStock = product.stock === 0;

  function handleAddToCart() {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      priceInCents: product.priceInCents,
      image: product.images[0] ?? "",
      stock: product.stock,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="container-main" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
        <Link href="/" className="flex items-center gap-1 hover:text-green-400 transition-colors">
          <ChevronLeft size={14} />
          Voltar ao catálogo
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text-secondary)" }}>{product.category}</span>
        <span>/</span>
        <span
          className="truncate max-w-xs"
          style={{ color: "var(--text-primary)" }}
        >
          {product.name}
        </span>
      </nav>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image gallery */}
        <div className="space-y-3">
          <div
            className="relative aspect-square rounded-2xl overflow-hidden"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            <Image
              src={product.images[selectedImage] ?? ""}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-150"
                  style={{
                    border: `2px solid ${i === selectedImage ? "var(--green-accent)" : "var(--border)"}`,
                    opacity: i === selectedImage ? 1 : 0.6,
                  }}
                  aria-label={`Ver imagem ${i + 1}`}
                >
                  <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          {/* Category */}
          <div className="mb-3">
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: "var(--green-accent)" }}
            >
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mb-6">
            <p
              className="text-4xl font-bold"
              style={{ color: "var(--green-accent)" }}
            >
              {formatPrice(product.priceInCents)}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              ou 12x de {formatPrice(Math.ceil(product.priceInCents / 12))} sem juros
            </p>
          </div>

          <div className="divider" />

          {/* Description */}
          <p
            className="leading-relaxed mb-6 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {product.description}
          </p>

          {/* Stock status */}
          {isOutOfStock ? (
            <div className="badge badge-error mb-4">Fora de estoque</div>
          ) : product.stock <= 5 ? (
            <p className="text-sm mb-4" style={{ color: "var(--status-pending)" }}>
              ⚠️ Restam apenas {product.stock} unidades!
            </p>
          ) : null}

          {/* Quantity selector */}
          {!isOutOfStock && (
            <div className="flex items-center gap-4 mb-6">
              <label className="label mb-0">Quantidade:</label>
              <div className="quantity-selector">
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Diminuir"
                >
                  <Minus size={14} />
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  aria-label="Aumentar"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="btn btn-primary btn-lg btn-full mb-3"
            id="add-to-cart-btn"
            style={
              added
                ? {
                    background: "linear-gradient(135deg, #00b377, #008a5c)",
                    boxShadow: "0 0 30px rgba(0,230,158,0.4)",
                  }
                : undefined
            }
          >
            {added ? (
              <>
                <Check size={20} />
                Adicionado ao carrinho!
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                {isOutOfStock ? "Produto Esgotado" : "Adicionar ao Carrinho"}
              </>
            )}
          </button>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: Shield, label: "Compra Segura", sub: "via Stripe" },
              { icon: Truck, label: "Entrega Rápida", sub: "em todo Brasil" },
              { icon: RotateCcw, label: "7 dias", sub: "para devolver" },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 p-3 rounded-xl text-center"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              >
                <Icon size={18} style={{ color: "var(--green-accent)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  {label}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-xl font-bold mb-6">Produtos relacionados</h2>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                priceInCents={p.priceInCents}
                images={p.images}
                category={p.category}
                stock={p.stock}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
