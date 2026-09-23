"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Zap, Search, Menu, X } from "lucide-react";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";
import { useCartStore } from "@/lib/store/cart";
import { useState } from "react";

const categories = [
  { label: "Fones", value: "Fones de Ouvido" },
  { label: "Teclados", value: "Teclados" },
  { label: "Mouses", value: "Mouses" },
  { label: "Monitores", value: "Monitores" },
  { label: "Acessórios", value: "Acessórios" },
];

export function Navbar() {
  const pathname = usePathname();
  const { totalItems, toggleCart } = useCartStore();
  const itemCount = totalItems();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <nav className="navbar">
      <div className="container-main h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center glow-green"
            style={{ background: "linear-gradient(135deg, #00cc8a, #00b377)" }}
          >
            <Zap size={16} className="text-black" />
          </div>
          <span className="font-bold text-lg gradient-text">TechStore</span>
        </Link>

        {/* Desktop categories */}
        <div className="hidden md:flex items-center gap-1">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              href={`/?categoria=${encodeURIComponent(cat.value)}`}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150"
              style={{
                color:
                  pathname === "/" ? "var(--text-secondary)" : "var(--text-muted)",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "var(--text-primary)";
                (e.target as HTMLElement).style.background = "var(--bg-elevated)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "var(--text-secondary)";
                (e.target as HTMLElement).style.background = "transparent";
              }}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search (desktop) */}
          <Link
            href="/?busca=true"
            className="btn btn-icon btn-ghost hidden md:flex"
            title="Buscar"
          >
            <Search size={18} />
          </Link>

          {/* Cart button */}
          <button
            onClick={toggleCart}
            className="btn btn-icon btn-ghost relative"
            aria-label={`Carrinho com ${itemCount} itens`}
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-black glow-green"
                style={{ background: "var(--green-accent)", fontSize: "0.65rem" }}
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {isLoaded && !isSignedIn && (
            <SignInButton mode="modal">
              <button className="btn btn-primary btn-sm">Entrar</button>
            </SignInButton>
          )}
          {isLoaded && isSignedIn && (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          )}

          {/* Mobile menu toggle */}
          <button
            className="btn btn-icon btn-ghost md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
        >
          <div className="container-main py-3 flex flex-col gap-1">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/?categoria=${encodeURIComponent(cat.value)}`}
                className="px-3 py-2 rounded-md text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
                onClick={() => setMobileOpen(false)}
              >
                {cat.label}
              </Link>
            ))}
            <Link
              href="/minha-conta/pedidos"
              className="px-3 py-2 rounded-md text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
              onClick={() => setMobileOpen(false)}
            >
              Meus Pedidos
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
