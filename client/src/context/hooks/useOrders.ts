import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useAuth } from "@/context/hooks/use-auth";
import type { Order } from "@/commons/types";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authenticatedUser } = useAuth();

  const fetchOrders = async () => {
    if (!authenticatedUser?.id) {
      setOrders([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/orders/user/${authenticatedUser.id}`);
      setOrders(response.data as Order[]);
    } catch (err: any) {
      console.error("Erro ao buscar pedidos:", err);
      setError(err.response?.data?.message ?? "Não foi possível carregar seus pedidos");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticatedUser?.id) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [authenticatedUser]);

  return { orders, loading, error };
};
