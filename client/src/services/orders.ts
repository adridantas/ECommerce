import { api } from "@/lib/axios";
import type { Order, OrderStatus } from "@/commons/types";

export async function fetchOrders(): Promise<{ items: Order[] }> {
  const response = await api.get<Order[]>("/admin/orders");
  return { items: response.data };
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  const res = await api.put(`/admin/orders/${id}/status`, null, {
    params: { status },
  });
  return res.data;
}
