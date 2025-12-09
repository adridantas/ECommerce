import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import type { Order, OrderDashboard, OrderStatus } from "@/commons/types";
import { fetchOrderAttachments, uploadOrderAttachment } from "@/services/orderAttachments";

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dashboard, setDashboard] = useState<OrderDashboard | null>(null);
  const [loading, setLoading] = useState(false);

  const loadDashboard = async () => {
    const res = await api.get<OrderDashboard>("/admin/orders/dashboard");
    setDashboard(res.data);
  };

  const loadOrders = async () => {
    const res = await api.get<Order[]>("/admin/orders");
    setOrders(res.data);
  };

  const updateStatus = async (id: number, status: OrderStatus) => {
    await api.put(`/admin/orders/${id}/status`, null, {
      params: { status },
    });
    await loadOrders();
    await loadDashboard();
  };
  const getAttachments = async (orderId: number) => {
    return await fetchOrderAttachments(orderId);
  };

  const attachFile = async (orderId: number, file: File, type: any) => {
    await uploadOrderAttachment(orderId, file, type);
    return await fetchOrderAttachments(orderId);
  };
  useEffect(() => {
    setLoading(true);
    Promise.all([loadOrders(), loadDashboard()]).finally(() =>
      setLoading(false)
    );
  }, []);

  return { orders, dashboard, loading, updateStatus, getAttachments, attachFile };
};
