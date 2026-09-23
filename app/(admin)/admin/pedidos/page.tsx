import { db } from "@/lib/db";
import { formatPrice, getOrderStatusLabel, getOrderStatusColor } from "@/lib/utils";
import { updateOrderStatus } from "@/app/actions/admin";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pedidos — Admin" };

const STATUS_OPTIONS = [
  { value: "SHIPPED", label: "Marcar como Enviado" },
  { value: "CANCELED", label: "Cancelar Pedido" },
];

interface SearchParams {
  status?: string;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const orders = await db.order.findMany({
    where: params.status ? { status: params.status as any } : undefined,
    include: {
      items: {
        include: { product: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const statusCounts = await db.order.groupBy({
    by: ["status"],
    _count: true,
  });

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="text-xl font-bold">Pedidos</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {orders.length} pedidos
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { label: "Todos", value: "" },
          { label: "Pendentes", value: "PENDING" },
          { label: "Pagos", value: "PAID" },
          { label: "Enviados", value: "SHIPPED" },
          { label: "Cancelados", value: "CANCELED" },
        ].map(({ label, value }) => {
          const count = value
            ? statusCounts.find((s) => s.status === value)?._count ?? 0
            : orders.length;
          const isActive = (params.status ?? "") === value;
          return (
            <a
              key={value}
              href={value ? `?status=${value}` : "/admin/pedidos"}
              className="btn btn-sm"
              style={{
                background: isActive ? "rgba(0,230,158,0.15)" : "var(--bg-elevated)",
                color: isActive ? "var(--green-accent)" : "var(--text-secondary)",
                border: `1px solid ${isActive ? "rgba(0,230,158,0.3)" : "var(--border)"}`,
              }}
            >
              {label}
              <span
                className="ml-1 text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  background: isActive ? "rgba(0,230,158,0.2)" : "var(--bg-card)",
                  color: isActive ? "var(--green-accent)" : "var(--text-muted)",
                }}
              >
                {count}
              </span>
            </a>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <p style={{ color: "var(--text-secondary)" }}>Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Itens</th>
                <th>Total</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="font-mono text-xs">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                      {order.userId ? order.userId.slice(-8) : order.guestEmail ? order.guestEmail.split("@")[0] : "Visitante"}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {order.items.slice(0, 2).map((item) => (
                        <span
                          key={item.id}
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                        >
                          {item.product.name.slice(0, 20)}... ×{item.quantity}
                        </span>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          +{order.items.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="font-medium" style={{ color: "var(--green-accent)" }}>
                      {formatPrice(order.totalInCents)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getOrderStatusColor(order.status)}`}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td>
                    {order.status !== "CANCELED" && order.status !== "PENDING" && (
                      <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
