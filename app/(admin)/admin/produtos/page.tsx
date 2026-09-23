import { db } from "@/lib/db";
import { formatPrice, getOrderStatusLabel, getOrderStatusColor } from "@/lib/utils";
import Link from "next/link";
import { Plus, Edit2, Eye, EyeOff } from "lucide-react";
import { toggleProductActive, deleteProduct } from "@/app/actions/admin";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Produtos — Admin" };

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orderItems: true } },
    },
  });

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="text-xl font-bold">Produtos</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {products.length} produtos cadastrados
          </p>
        </div>
        <Link href="/admin/produtos/novo" className="btn btn-primary btn-sm">
          <Plus size={16} />
          Novo Produto
        </Link>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Vendas</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ background: "var(--bg-elevated)" }}
                    >
                      {product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium max-w-xs truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {product.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        /{product.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td>{product.category}</td>
                <td>
                  <span style={{ color: "var(--green-accent)" }} className="font-medium">
                    {formatPrice(product.priceInCents)}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      color:
                        product.stock === 0
                          ? "var(--status-canceled)"
                          : product.stock <= 5
                          ? "var(--status-pending)"
                          : "var(--text-secondary)",
                    }}
                  >
                    {product.stock}
                  </span>
                </td>
                <td>{product._count.orderItems}</td>
                <td>
                  <span
                    className={`badge ${product.active ? "badge-success" : "badge-neutral"}`}
                  >
                    {product.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/produtos/${product.id}/editar`}
                      className="btn btn-icon btn-ghost btn-sm"
                      title="Editar"
                    >
                      <Edit2 size={15} />
                    </Link>
                    <form action={toggleProductActive.bind(null, product.id, !product.active)}>
                      <button
                        type="submit"
                        className="btn btn-icon btn-ghost btn-sm"
                        title={product.active ? "Desativar" : "Ativar"}
                      >
                        {product.active ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
