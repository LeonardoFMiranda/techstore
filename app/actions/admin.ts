"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { productSchema } from "@/lib/validations";
import { toSlug } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { UserRoleEnum } from "@prisma/client";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  const role = await db.userRole.findUnique({ where: { userId } });
  if (role?.role !== UserRoleEnum.ADMIN) throw new Error("Not authorized");
  return userId;
}

// =========== PRODUCT ACTIONS ===========

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    priceInCents: Math.round(parseFloat(formData.get("price") as string) * 100),
    stock: parseInt(formData.get("stock") as string),
    category: formData.get("category") as string,
    images: (formData.get("images") as string).split(",").map((s) => s.trim()).filter(Boolean),
    active: formData.get("active") === "true",
    slug: "",
  };

  raw.slug = toSlug(raw.name);

  // Ensure slug uniqueness
  const existing = await db.product.findUnique({ where: { slug: raw.slug } });
  if (existing) raw.slug = `${raw.slug}-${Date.now()}`;

  const validation = productSchema.safeParse(raw);
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  await db.product.create({ data: validation.data });
  revalidatePath("/admin/produtos");
  revalidatePath("/");
  redirect("/admin/produtos");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    priceInCents: Math.round(parseFloat(formData.get("price") as string) * 100),
    stock: parseInt(formData.get("stock") as string),
    category: formData.get("category") as string,
    images: (formData.get("images") as string).split(",").map((s) => s.trim()).filter(Boolean),
    active: formData.get("active") === "true",
    slug: "",
  };

  const product = await db.product.findUnique({ where: { id } });
  if (!product) throw new Error("Product not found");

  raw.slug = product.slug; // Keep original slug on edit

  const validation = productSchema.safeParse(raw);
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  await db.product.update({ where: { id }, data: validation.data });
  revalidatePath("/admin/produtos");
  revalidatePath("/");
  revalidatePath(`/produtos/${product.slug}`);
  redirect("/admin/produtos");
}

export async function toggleProductActive(id: string, active: boolean) {
  await requireAdmin();
  await db.product.update({ where: { id }, data: { active } });
  revalidatePath("/admin/produtos");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const product = await db.product.findUnique({ where: { id } });
  if (!product) throw new Error("Product not found");

  await db.product.delete({ where: { id } });
  revalidatePath("/admin/produtos");
  revalidatePath("/");
  redirect("/admin/produtos");
}

// =========== ORDER ACTIONS ===========

export async function updateOrderStatus(orderId: string, status: "SHIPPED" | "CANCELED") {
  await requireAdmin();

  // Cannot manually set to PAID (only via webhook)
  if (status === "PAID" as string) {
    throw new Error("Status PAID só pode ser definido via webhook do Stripe.");
  }

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Pedido não encontrado");

  // Cannot change a PAID order to PENDING
  if (order.status === "PAID" && status === "CANCELED") {
    // Allowed: admin can cancel a paid order
  }

  await db.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/pedidos");
}
