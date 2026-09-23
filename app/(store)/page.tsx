import { Suspense } from "react";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/ProductCard";
import { Search, SlidersHorizontal, Zap, Shield, Truck } from "lucide-react";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { AutoSubmitSelect } from "@/components/store/AutoSubmitSelect";

interface SearchParams {
  categoria?: string;
  busca?: string;
}

async function getProducts(searchParams: SearchParams) {
  const where: Prisma.ProductWhereInput = {
    active: true,
  };

  if (searchParams.categoria) {
    where.category = searchParams.categoria;
  }

  if (searchParams.busca) {
    where.name = { contains: searchParams.busca, mode: "insensitive" };
  }

  return db.product.findMany({ where, orderBy: { createdAt: "desc" } });
}

async function getCategories() {
  const categories = await db.product.findMany({
    where: { active: true },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return categories.map((c) => c.category);
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const isFiltered = params.categoria || params.busca;

  return (
    <div>
      {/* Hero */}
      {!isFiltered && (
        <section
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, #0d2218 100%)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {/* Decorative glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 70% 50%, rgba(0, 230, 158, 0.08) 0%, transparent 70%)",
            }}
          />
          <div className="container-main py-20 md:py-28 relative">
            <div className="max-w-2xl">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 text-xs font-medium"
                style={{
                  borderColor: "rgba(0,230,158,0.3)",
                  background: "rgba(0,230,158,0.08)",
                  color: "var(--green-accent)",
                }}
              >
                <Zap size={12} />
                Novidades tech disponíveis
              </div>
              <h1
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Eletrônicos{" "}
                <span className="gradient-text text-glow">premium</span>
                <br />
                para quem entende.
              </h1>
              <p
                className="text-lg mb-8 max-w-lg leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Curadoria dos melhores gadgets, periféricos e equipamentos tech.
                Compre com segurança via Stripe.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="#products" className="btn btn-primary btn-lg">
                  Ver Catálogo
                </Link>
                <Link href="/carrinho" className="btn btn-secondary btn-lg">
                  Meu Carrinho
                </Link>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-6 mt-12">
                {[
                  { icon: Shield, label: "Pagamento seguro" },
                  { icon: Truck, label: "Entrega expressa" },
                  { icon: Zap, label: "Suporte 24h" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Icon size={16} style={{ color: "var(--green-accent)" }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products section */}
      <section id="products" className="container-main section-padding">
        {/* Section header */}
        <div className="section-header">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {params.categoria
                ? params.categoria
                : params.busca
                ? `Resultados para "${params.busca}"`
                : "Todos os Produtos"}
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {products.length} {products.length === 1 ? "produto" : "produtos"} encontrado
              {products.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <form method="GET" className="relative">
              {params.categoria && (
                <input type="hidden" name="categoria" value={params.categoria} />
              )}
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                name="busca"
                defaultValue={params.busca}
                placeholder="Buscar produtos..."
                className="input pl-9"
                style={{ width: "220px", height: "38px" }}
                id="search-products"
              />
            </form>

            {/* Category filter */}
            <form method="GET">
              {params.busca && (
                <input type="hidden" name="busca" value={params.busca} />
              )}
              <div className="relative">
                <SlidersHorizontal
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--text-muted)" }}
                />
                <AutoSubmitSelect
                  name="categoria"
                  defaultValue={params.categoria ?? ""}
                  className="select pl-8"
                  style={{ width: "180px", height: "38px" }}
                  id="filter-category"
                >
                  <option value="">Todas categorias</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </AutoSubmitSelect>
              </div>
            </form>

            {/* Clear filters */}
            {isFiltered && (
              <Link href="/" className="btn btn-ghost btn-sm">
                Limpar filtros
              </Link>
            )}
          </div>
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="font-semibold text-lg" style={{ color: "var(--text-secondary)" }}>
              Nenhum produto encontrado
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Tente ajustar os filtros ou buscar por outro termo
            </p>
            <Link href="/" className="btn btn-primary btn-sm mt-2">
              Ver todos os produtos
            </Link>
          </div>
        ) : (
          <Suspense fallback={<ProductGridSkeleton />}>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  priceInCents={product.priceInCents}
                  images={product.images}
                  category={product.category}
                  stock={product.stock}
                />
              ))}
            </div>
          </Suspense>
        )}
      </section>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="product-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="product-card">
          <div className="skeleton aspect-square" />
          <div className="product-card-body space-y-2">
            <div className="skeleton h-4 rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
            <div className="skeleton h-5 w-1/2 rounded mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
