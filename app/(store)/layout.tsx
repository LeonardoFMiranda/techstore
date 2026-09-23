import { Navbar } from "@/components/store/Navbar";
import { CartDrawer } from "@/components/store/CartDrawer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>{children}</main>
      <footer
        className="border-t mt-20"
        style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
      >
        <div className="container-main py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-3 text-sm" style={{ color: "var(--text-primary)" }}>
                TechStore
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Eletrônicos premium com a melhor curadoria do mercado.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm" style={{ color: "var(--text-primary)" }}>
                Compras
              </h4>
              <ul className="space-y-2">
                {["Catálogo", "Carrinho", "Minha Conta"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm" style={{ color: "var(--text-primary)" }}>
                Suporte
              </h4>
              <ul className="space-y-2">
                {["FAQ", "Devoluções", "Rastreio"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm" style={{ color: "var(--text-primary)" }}>
                Pagamento Seguro
              </h4>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                🔒 Processado via Stripe. Seus dados estão protegidos.
              </p>
            </div>
          </div>
          <div
            className="divider"
            style={{ marginTop: "2.5rem", marginBottom: "1.5rem" }}
          />
          <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
            © 2025 TechStore. Projeto de portfólio com Next.js + Stripe.
          </p>
        </div>
      </footer>
    </>
  );
}
