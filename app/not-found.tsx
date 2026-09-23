import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Página não encontrada" };

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="text-center max-w-md px-6">
        <p
          className="text-8xl font-black mb-4 gradient-text"
        >
          404
        </p>
        <h1 className="text-2xl font-bold mb-3">Página não encontrada</h1>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link href="/" className="btn btn-primary btn-lg">
          Voltar para a loja
        </Link>
      </div>
    </div>
  );
}
