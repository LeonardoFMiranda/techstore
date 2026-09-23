import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Package,
  ArrowRight,
  UserPlus,
  Search,
} from "lucide-react";
import { formatPrice, getOrderStatusLabel, getOrderStatusColor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pedido Confirmado",
  description: "Seu pedido foi recebido com sucesso!",
};

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function OrderConfirmedPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  if (!session_id) notFound();

  // Fetch order by stripeSessionId — data comes from DB, not URL
  const order = await db.order.findUnique({
    where: { stripeSessionId: session_id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    // Webhook might not have processed yet — show processing state
    return (
      <div className="container-main" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="max-w-lg mx-auto text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}
          >
            <Clock size={36} style={{ color: "var(--status-pending)" }} />
          </div>
          <h1 className="text-2xl font-bold mb-3">Processando seu pagamento...</h1>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            Estamos confirmando seu pagamento. Isso pode levar alguns instantes.
            Recarregue a página em alguns segundos.
          </p>
          <Link href="/" className="btn btn-primary">
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.status === "PAID";

  return (
    <div className="container-main" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 glow-green"
            style={{
              background: isPaid
                ? "rgba(0,230,158,0.15)"
                : "rgba(245,158,11,0.15)",
              border: `1px solid ${isPaid ? "rgba(0,230,158,0.3)" : "rgba(245,158,11,0.3)"}`,
            }}
          >
            {isPaid ? (
              <CheckCircle2 size={36} style={{ color: "var(--green-accent)" }} />
            ) : (
              <Clock size={36} style={{ color: "var(--status-pending)" }} />
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isPaid ? "Pedido confirmado! 🎉" : "Pagamento processando..."}
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            {isPaid
              ? "Obrigado pela sua compra! Seu pedido foi recebido e está sendo preparado."
              : "Aguardando confirmação do pagamento."}
          </p>
        </div>

        {/* Order card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          {/* Order header */}
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{
              background: "var(--bg-elevated)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Pedido
              </p>
              <p className="font-mono text-sm font-semibold">{order.id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <span className={`badge ${getOrderStatusColor(order.status)} mt-1`}>
                {getOrderStatusLabel(order.status)}
              </span>
            </div>
          </div>

          {/* Items */}
          <div style={{ background: "var(--bg-card)" }}>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 px-6 py-4 border-b"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <div
                  className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background: "var(--bg-elevated)" }}
                >
                  <Image
                    src={item.product.images[0] ?? ""}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.product.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Qtd: {item.quantity} × {formatPrice(item.priceInCentsAtPurchase)}
                  </p>
                </div>
                <p className="font-bold text-sm" style={{ color: "var(--green-accent)" }}>
                  {formatPrice(item.priceInCentsAtPurchase * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            className="px-6 py-4 flex justify-between items-center"
            style={{
              background: "var(--bg-elevated)",
              borderTop: "1px solid var(--border)",
            }}
          >
            <span className="font-semibold">Total do pedido</span>
            <span className="font-bold text-xl" style={{ color: "var(--green-accent)" }}>
              {formatPrice(order.totalInCents)}
            </span>
          </div>
        </div>

        {/* Guest CTA */}
        {!order.userId && (
          <div
            className="mt-6 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6"
            style={{
              background: "linear-gradient(145deg, var(--bg-card) 0%, var(--bg-elevated) 100%)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,230,158,0.15)" }}
            >
              <UserPlus size={24} style={{ color: "var(--green-accent)" }} />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-lg mb-1">Quer acompanhar esse pedido?</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Crie uma conta usando o e-mail <strong>{order.guestEmail}</strong> para acessar o histórico de pedidos completo e ganhar benefícios na loja.
              </p>
            </div>
            <Link
              href={`/sign-up?email_address=${encodeURIComponent(order.guestEmail || "")}`}
              className="btn btn-primary"
            >
              Criar Conta Grátis
            </Link>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          {order.userId ? (
            <Link
              href="/minha-conta/pedidos"
              className="btn btn-secondary flex-1 justify-center"
            >
              <Package size={18} />
              Ver Meus Pedidos
            </Link>
          ) : (
            <Link
              href="/rastrear-pedido"
              className="btn btn-secondary flex-1 justify-center"
            >
              <Search size={18} />
              Rastrear Pedido
            </Link>
          )}
          <Link href="/" className="btn btn-primary flex-1 justify-center">
            Continuar Comprando
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
