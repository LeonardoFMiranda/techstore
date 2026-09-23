"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Zap,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div
        className="flex items-center gap-2 px-5 py-5 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center glow-green"
          style={{ background: "linear-gradient(135deg, #00cc8a, #00b377)" }}
        >
          <Zap size={14} className="text-black" />
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            TechStore
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Admin
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`admin-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
        <Link
          href="/"
          className="flex items-center gap-2 text-xs"
          style={{ color: "var(--text-muted)" }}
          target="_blank"
        >
          <ExternalLink size={12} />
          Ver loja
        </Link>
      </div>
    </aside>
  );
}
