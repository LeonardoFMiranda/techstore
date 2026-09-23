"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="text-center max-w-md px-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <AlertTriangle size={28} style={{ color: "#ef4444" }} />
        </div>
        <h1 className="text-2xl font-bold mb-3">Algo deu errado</h1>
        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
          {error.message ?? "Ocorreu um erro inesperado. Tente novamente."}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn btn-primary">
            Tentar novamente
          </button>
          <Link href="/" className="btn btn-secondary">
            Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}
