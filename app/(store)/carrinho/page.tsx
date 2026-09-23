"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Lock } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { useTransition } from "react";
import { createCheckoutSession } from "@/app/actions/checkout";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } =
    useCartStore();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const subtotal = totalPrice();
  const shipping = subtotal >= 30000 ? 0 : 1990; // Free shipping over R$300
  const total = subtotal + shipping;

  async function handleCheckout() {
    startTransition(async () => {
      const cartItems = items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      }));

      const result = await createCheckoutSession(cartItems);

      if (result.error) {
        alert(result.error);
        return;
      }

      if (result.url) {
        clearCart();
        router.push(result.url);
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="container-main" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="empty-state">
          <ShoppingBag size={64} style={{ color: "var(--text-muted)" }} />
          <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Adicione produtos para começar a comprar
          </p>
          <Link href="/" className="btn btn-primary btn-lg mt-2">
            Explorar produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
      <h1 className="text-2xl font-bold mb-8">
        Meu Carrinho
        <span className="text-base font-normal ml-2" style={{ color: "var(--text-muted)" }}>
          ({totalItems()} {totalItems() === 1 ? "item" : "itens"})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 rounded-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              {/* Image */}
              <Link href={`/produtos/${item.slug}`} className="flex-shrink-0">
                <div
                  className="w-24 h-24 rounded-xl overflow-hidden"
                  style={{ background: "var(--bg-elevated)" }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1">
                <Link
                  href={`/produtos/${item.slug}`}
                  className="font-semibold text-sm hover:text-green-400 transition-colors block mb-1"
                >
                  {item.name}
                </Link>
                <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                  {formatPrice(item.priceInCents)} por unidade
                </p>
                <div className="flex items-center justify-between">
                  <div className="quantity-selector">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Diminuir"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="quantity-value text-sm">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      aria-label="Aumentar"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold" style={{ color: "var(--green-accent)" }}>
                      {formatPrice(item.priceInCents * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="btn btn-icon btn-ghost"
                      style={{ color: "var(--status-canceled)" }}
                      aria-label="Remover"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div
            className="rounded-2xl p-6 sticky top-24"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <h2 className="font-bold text-lg mb-5">Resumo do Pedido</h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>Frete</span>
                <span style={{ color: shipping === 0 ? "var(--green-accent)" : undefined }}>
                  {shipping === 0 ? "Grátis 🎉" : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Frete grátis para compras acima de R$ 300
                </p>
              )}
              <div className="divider my-1" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span style={{ color: "var(--green-accent)" }}>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isPending || items.length === 0}
              className="btn btn-primary btn-full btn-lg mb-3"
              id="checkout-btn"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                  />
                  Processando...
                </span>
              ) : (
                <>
                  Finalizar Compra
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <Lock size={12} />
              Pagamento seguro via Stripe
            </div>

            <div className="divider" />

            <Link
              href="/"
              className="btn btn-ghost btn-full text-sm"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
