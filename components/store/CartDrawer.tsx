"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, Package } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } =
    useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, closeCart]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    router.push("/carrinho");
  };

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={closeCart} aria-hidden="true" />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="cart-drawer"
        role="dialog"
        aria-label="Carrinho de compras"
        aria-modal="true"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 border-b flex-shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} style={{ color: "var(--green-accent)" }} />
            <h2 className="font-semibold text-base">
              Carrinho
              {totalItems() > 0 && (
                <span
                  className="ml-2 text-sm font-normal"
                  style={{ color: "var(--text-muted)" }}
                >
                  ({totalItems()} {totalItems() === 1 ? "item" : "itens"})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="btn btn-icon btn-ghost"
            aria-label="Fechar carrinho"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="empty-state">
              <Package size={48} style={{ color: "var(--text-muted)" }} />
              <p className="font-semibold" style={{ color: "var(--text-secondary)" }}>
                Carrinho vazio
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Adicione produtos para começar
              </p>
              <Link href="/" onClick={closeCart} className="btn btn-primary btn-sm mt-2">
                Ver Produtos
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-3 pb-4 border-b"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  {/* Image */}
                  <Link
                    href={`/produtos/${item.slug}`}
                    onClick={closeCart}
                    className="flex-shrink-0"
                  >
                    <div
                      className="w-16 h-16 rounded-lg overflow-hidden"
                      style={{ background: "var(--bg-elevated)" }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/produtos/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm font-medium line-clamp-2 hover:text-green-400 transition-colors"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.name}
                    </Link>
                    <p
                      className="text-sm font-semibold mt-1"
                      style={{ color: "var(--green-accent)" }}
                    >
                      {formatPrice(item.priceInCents * item.quantity)}
                    </p>

                    {/* Quantity + Remove */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="quantity-selector">
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          aria-label="Diminuir quantidade"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="quantity-value text-sm">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          aria-label="Aumentar quantidade"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="btn btn-icon btn-ghost"
                        style={{ color: "var(--status-canceled)" }}
                        aria-label="Remover item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="p-5 border-t flex-shrink-0"
            style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
              <span className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                {formatPrice(totalPrice())}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="btn btn-primary btn-full btn-lg"
              id="cart-checkout-btn"
            >
              Finalizar Compra
              <ArrowRight size={18} />
            </button>
            <button
              onClick={closeCart}
              className="btn btn-ghost btn-full mt-2 text-sm"
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
