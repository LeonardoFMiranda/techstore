import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, Package, ShoppingBag, DollarSign } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard Admin" };

async function getDashboardData() {
  const [
    totalOrders,
    paidOrders,
    totalProducts,
    activeProducts,
    topProducts,
  ] = await Promise.all([
    db.order.count(),
    db.order.findMany({
      where: { status: "PAID" },
      select: { totalInCents: true },
    }),
    db.product.count(),
    db.product.count({ where: { active: true } }),
    db.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const totalRevenue = paidOrders.reduce((sum: number, o: { totalInCents: number }) => sum + o.totalInCents, 0);

  const topProductIds = topProducts.map((p: { productId: string }) => p.productId);
  const topProductDetails = await db.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true, priceInCents: true, images: true },
  });

  const topProductsWithDetails = topProducts.map((tp: typeof topProducts[0]) => ({
    ...tp,
    product: topProductDetails.find((p: { id: string }) => p.id === tp.productId),
  }));

  return {
    totalRevenue,
    paidOrdersCount: paidOrders.length,
    totalOrders,
    totalProducts,
    activeProducts,
    topProducts: topProductsWithDetails,
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const stats = [
    {
      label: "Receita Total",
      value: formatPrice(data.totalRevenue),
      icon: DollarSign,
      color: "var(--green-accent)",
      sub: `${data.paidOrdersCount} pedidos pagos`,
    },
    {
      label: "Total de Pedidos",
      value: data.totalOrders.toString(),
      icon: ShoppingBag,
      color: "var(--status-shipped)",
      sub: "todos os status",
    },
    {
      label: "Produtos Ativos",
      value: data.activeProducts.toString(),
      icon: Package,
      color: "var(--status-pending)",
      sub: `de ${data.totalProducts} cadastrados`,
    },
    {
      label: "Taxa de Conversão",
      value: data.totalOrders > 0
        ? `${Math.round((data.paidOrdersCount / data.totalOrders) * 100)}%`
        : "—",
      icon: TrendingUp,
      color: "var(--green-accent)",
      sub: "pedidos concluídos",
    },
  ];

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Visão geral da loja
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, sub }) => (
          <div
            key={label}
            className="card p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {label}
              </p>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${color}15`, border: `1px solid ${color}25` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
            </div>
            <p className="text-2xl font-bold mb-1">{value}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Top products */}
      <div className="card p-5">
        <h2 className="font-semibold mb-4">Produtos Mais Vendidos</h2>
        {data.topProducts.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Nenhuma venda ainda.
          </p>
        ) : (
          <div className="space-y-3">
            {data.topProducts.map((item, index) => (
              <div key={item.productId} className="flex items-center gap-3">
                <span
                  className="text-sm font-bold w-5 text-right flex-shrink-0"
                  style={{ color: index === 0 ? "var(--green-accent)" : "var(--text-muted)" }}
                >
                  {index + 1}
                </span>
                <div
                  className="flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--bg-elevated)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: "var(--green-accent)",
                      width: `${Math.round(
                        ((item._sum.quantity ?? 0) /
                          (data.topProducts[0]._sum.quantity ?? 1)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-sm flex-1 truncate" style={{ color: "var(--text-secondary)" }}>
                  {item.product?.name ?? "Produto removido"}
                </span>
                <span className="text-sm font-medium ml-2" style={{ color: "var(--text-primary)" }}>
                  {item._sum.quantity ?? 0} un.
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
