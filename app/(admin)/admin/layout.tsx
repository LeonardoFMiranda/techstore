import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { UserRoleEnum } from "@prisma/client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

async function checkAdmin(userId: string) {
  const role = await db.userRole.findUnique({ where: { userId } });
  return role?.role === UserRoleEnum.ADMIN;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const admin = await checkAdmin(userId);
  if (!admin) redirect("/");

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {/* Admin topbar */}
        <div
          className="h-14 flex items-center px-6 border-b sticky top-0 z-10"
          style={{
            background: "rgba(10,15,13,0.85)",
            backdropFilter: "blur(12px)",
            borderColor: "var(--border)",
          }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Painel Administrativo
          </p>
        </div>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
