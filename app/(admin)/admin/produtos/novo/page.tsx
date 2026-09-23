import { createProduct } from "@/app/actions/admin";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Novo Produto — Admin" };

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

export default function NewProductPage() {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/produtos" className="btn btn-icon btn-ghost">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Novo Produto</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Preencha os dados do produto
          </p>
        </div>
      </div>

      <div className="card p-6">
        <form action={createProduct} className="space-y-5">
          <div>
            <label className="label" htmlFor="name">Nome *</label>
            <input
              id="name"
              name="name"
              type="text"
              className="input"
              placeholder="Ex: Fone de Ouvido Sony WH-1000XM5"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="description">Descrição *</label>
            <textarea
              id="description"
              name="description"
              className="textarea"
              placeholder="Descreva as características do produto..."
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
                placeholder="129.90"
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
                placeholder="10"
                required
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="category">Categoria *</label>
            <select id="category" name="category" className="select" required>
              <option value="">Selecione...</option>
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
              placeholder="https://exemplo.com/imagem1.jpg, https://exemplo.com/imagem2.jpg"
              required
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Separe múltiplas URLs com vírgula
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="label mb-0" htmlFor="active">Status:</label>
            <select id="active" name="active" className="select" style={{ width: "auto" }}>
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/admin/produtos" className="btn btn-secondary flex-1 justify-center">
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary flex-1" id="create-product-btn">
              Criar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
