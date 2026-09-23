import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { updateProduct, deleteProduct } from "@/app/actions/admin";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Editar Produto — Admin" };

const CATEGORIES = [
  "Fones de Ouvido",
  "Teclados",
  "Mouses",
  "Monitores",
  "Webcams",
  "Microfones",
  "Armazenamento",
  "Acessórios",
];

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, id);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/produtos" className="btn btn-icon btn-ghost">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Editar Produto</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {product.name}
          </p>
        </div>
      </div>

      <div className="card p-6">
        <form action={updateWithId} className="space-y-5">
          <div>
            <label className="label" htmlFor="name">Nome *</label>
            <input
              id="name"
              name="name"
              type="text"
              className="input"
              defaultValue={product.name}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="description">Descrição *</label>
            <textarea
              id="description"
              name="description"
              className="textarea"
              defaultValue={product.description}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="price">Preço (R$) *</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                className="input"
                defaultValue={(product.priceInCents / 100).toFixed(2)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="stock">Estoque *</label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                className="input"
                defaultValue={product.stock}
                required
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="category">Categoria *</label>
            <select
              id="category"
              name="category"
              className="select"
              defaultValue={product.category}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="images">URLs das Imagens *</label>
            <textarea
              id="images"
              name="images"
              className="textarea"
              style={{ minHeight: "80px" }}
              defaultValue={product.images.join(", ")}
              required
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Separe múltiplas URLs com vírgula
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="label mb-0">Status:</label>
            <select
              name="active"
              className="select"
              defaultValue={product.active ? "true" : "false"}
              style={{ width: "auto" }}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/admin/produtos" className="btn btn-secondary flex-1 justify-center">
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary flex-1" id="update-product-btn">
              Salvar Alterações
            </button>
          </div>
        </form>

        {/* Danger zone */}
        <div
          className="mt-6 pt-5 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-sm font-medium mb-3" style={{ color: "var(--status-canceled)" }}>
            Zona de Perigo
          </p>
          <form action={deleteProduct.bind(null, id)}>
            <button
              type="submit"
              className="btn btn-danger btn-sm"
              id="delete-product-btn"
              onClick={(e) => {
                if (!confirm(`Tem certeza que deseja excluir "${product.name}"? Esta ação não pode ser desfeita.`)) {
                  e.preventDefault();
                }
              }}
            >
              Excluir Produto
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
