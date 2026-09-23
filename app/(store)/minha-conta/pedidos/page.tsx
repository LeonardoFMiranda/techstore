import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice, getOrderStatusLabel, getOrderStatusColor } from "@/lib/utils";
import { Package, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meus Pedidos",
  description: "Histórico de pedidos da sua conta",
};

export default async function MyOrdersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const orders = await db.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: { select: { name: true, images: true } } },
        take: 3,
      },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-main" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Meus Pedidos</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <Package size={56} style={{ color: "var(--text-muted)" }} />
            <h2 className="text-xl font-semibold" style={{ color: "var(--text-secondary)" }}>
              Nenhum pedido ainda
            </h2>
            <p style={{ color: "var(--text-muted)" }}>
              Explore o catálogo e faça seu primeiro pedido!
            </p>
            <Link href="/" className="btn btn-primary btn-sm mt-2">
              Explorar produtos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
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
                        Pedido #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${getOrderStatusColor(order.status)}`}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                    <span className="font-bold" style={{ color: "var(--green-accent)" }}>
                      {formatPrice(order.totalInCents)}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="px-5 py-3">
                  <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                    {order._count.items}{" "}
                    {order._count.items === 1 ? "produto" : "produtos"}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {order.items.map((item) => (
                      <span
                        key={item.id}
                        className="text-xs px-2 py-1 rounded-md"
                        style={{
                          background: "var(--bg-elevated)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.product.name} ×{item.quantity}
                      </span>
                    ))}
                    {order._count.items > 3 && (
                      <span
                        className="text-xs px-2 py-1 rounded-md"
                        style={{
                          background: "var(--bg-elevated)",
                          color: "var(--text-muted)",
                        }}
                      >
                        +{order._count.items - 3} mais
                      </span>
                    )}
                  </div>
                </div>

                {/* View detail */}
                {order.stripeSessionId && (
                  <div className="px-5 py-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                    <Link
                      href={`/pedido/confirmado?session_id=${order.stripeSessionId}`}
                      className="flex items-center gap-1 text-xs font-medium transition-colors"
                      style={{ color: "var(--green-accent)" }}
                    >
                      Ver detalhes do pedido
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
