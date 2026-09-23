import { ReactNode } from "react";
import Link from "next/link";
import { Package, User } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function MyAccountLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="container-main py-12 md:py-20">
      <div className="flex flex-col md:flex-row gap-8 py-4">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-lg font-bold mb-6">Minha Conta</h2>
          <nav className="flex flex-col gap-2">
            <Link 
              href="/minha-conta/pedidos"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--bg-elevated)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <Package size={18} />
              Meus Pedidos
            </Link>
            <Link 
              href="/minha-conta/perfil"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--bg-elevated)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <User size={18} />
              Meus Dados
            </Link>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
