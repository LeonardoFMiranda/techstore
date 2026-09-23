import { z } from "zod";

// Product validation
export const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  priceInCents: z.number().int().min(1, "Preço deve ser maior que 0"),
  stock: z.number().int().min(0, "Estoque não pode ser negativo"),
  category: z.string().min(1, "Categoria é obrigatória"),
  images: z.array(z.string().url()).min(1, "Pelo menos uma imagem é necessária"),
  active: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Checkout validation
export const checkoutItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "Carrinho não pode estar vazio"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Order status update (admin)
export const orderStatusSchema = z.object({
  orderId: z.string().cuid(),
  status: z.enum(["SHIPPED", "CANCELED"]), // PAID only via webhook
});

export type OrderStatusFormData = z.infer<typeof orderStatusSchema>;
