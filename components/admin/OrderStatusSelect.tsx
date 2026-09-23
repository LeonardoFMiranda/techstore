"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/actions/admin";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Marcar como Pendente" },
  { value: "PAID", label: "Marcar como Pago" },
  { value: "SHIPPED", label: "Marcar como Enviado" },
  { value: "CANCELED", label: "Cancelar Pedido" },
];

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      className="select text-xs"
      style={{ height: "30px", width: "auto", padding: "0 0.5rem", opacity: isPending ? 0.5 : 1 }}
      defaultValue=""
      disabled={isPending}
      onChange={(e) => {
        const val = e.target.value as "PENDING" | "PAID" | "SHIPPED" | "CANCELED";
        if (val) {
          startTransition(async () => {
            await updateOrderStatus(orderId, val);
          });
        }
      }}
    >
      <option value="">Alterar status</option>
      {STATUS_OPTIONS.filter((s) => s.value !== currentStatus).map(
        ({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        )
      )}
    </select>
  );
}
