import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names (shadcn/ui utility)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a price in cents to a Brazilian currency string.
 * e.g. 12990 => "R$ 129,90"
 */
export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceInCents / 100);
}

/**
 * Converts a string to a URL-friendly slug.
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Returns the label for an order status.
 */
export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Pendente",
    PAID: "Pago",
    SHIPPED: "Enviado",
    CANCELED: "Cancelado",
  };
  return labels[status] ?? status;
}

/**
 * Returns the CSS class for an order status badge.
 */
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "badge-warning",
    PAID: "badge-success",
    SHIPPED: "badge-info",
    CANCELED: "badge-error",
  };
  return colors[status] ?? "badge-neutral";
}
