"use client";

import { useActionState } from "react";
import { trackOrder } from "@/app/actions/tracking";
import { Search, Package, ChevronRight } from "lucide-react";
import { formatPrice, getOrderStatusLabel, getOrderStatusColor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function TrackOrderPage() {
  const [state, formAction, pending] = useActionState(trackOrder, null);

  return (
    <div className="container-main py-12 md:py-20 min-h-screen">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 glow-green"
            style={{
              background: "linear-gradient(135deg, #00cc8a, #00b377)",
            }}
          >
            <Search size={32} className="text-black" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Rastrear Pedido</h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Acompanhe o status da sua compra sem precisar de uma conta.
          </p>
        </div>

        {/* Tracking Form */}
        <div className="card p-6 mb-8">
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="orderId" className="label">
                Número do Pedido *
              </label>
              <input
                type="text"
                id="orderId"
                name="orderId"
                placeholder="Ex: 5z9f... ou #5z9f..."
                className="input"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="label">
                E-mail usado na compra *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="seu@email.com"
                className="input"
                required
              />
            </div>

            {state?.error && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "var(--status-canceled)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                {state.error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full justify-center mt-2"
              disabled={pending}
            >
              {pending ? "Buscando..." : "Buscar Pedido"}
            </button>
          </form>
        </div>

        {/* Result */}
        {state?.order && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold mb-4">Resultado da Busca</h2>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}
            >
              {/* Order header */}
              <div
                className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--bg-elevated)" }}
                  >
                    <Package size={18} style={{ color: "var(--green-accent)" }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Pedido #{state.order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {new Date(state.order.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${getOrderStatusColor(state.order.status)}`}>
                    {getOrderStatusLabel(state.order.status)}
                  </span>
                  <span className="font-bold" style={{ color: "var(--green-accent)" }}>
                    {formatPrice(state.order.totalInCents)}
                  </span>
                </div>
              </div>

              {/* Items preview */}
              <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                  Itens do pedido
                </p>
                <div className="space-y-3">
                  {state.order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden"
                        style={{ background: "var(--bg-elevated)" }}
                      >
                        {item.product.image && (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                          {item.product.name}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                          Qtd: {item.quantity} × {formatPrice(item.priceInCentsAtPurchase)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* View detail */}
              {state.order.stripeSessionId && (
                <div className="px-5 py-3">
                  <Link
                    href={`/pedido/confirmado?session_id=${state.order.stripeSessionId}`}
                    className="flex items-center gap-1 text-xs font-medium transition-colors"
                    style={{ color: "var(--green-accent)" }}
                  >
                    Ver detalhes no recibo
                    <ChevronRight size={14} />
                  </Link>
                </div>
              )}
            </div>

            {/* Prompt Account Creation Again */}
            <div
              className="mt-6 p-4 rounded-xl text-center"
              style={{ background: "var(--bg-elevated)", border: "1px dashed var(--border)" }}
            >
              <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                Não quer digitar seus dados toda vez que for rastrear um pedido?
              </p>
              <Link href="/sign-up" className="btn btn-primary btn-sm inline-flex">
                Crie sua conta agora
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
