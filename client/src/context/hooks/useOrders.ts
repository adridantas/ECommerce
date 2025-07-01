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
            console.warn("Usuario nao autenticado ");
            setOrders([]); 
            return;
        }

        setLoading(true); 
        setError(null);   
        try {
            const response = await api.get(`/orders/user/${authenticatedUser.id}`);
            console.log("RESPOSTA API PEDIDOS: ", response.data);

            setOrders(response.data.map((order: Order) => ({
                ...order,
                status: "Processando" 
            })));
        } catch (err: any) {
            console.error("Erro ao buscar pedidos:", err);
            setError("Nao foi possivel carregar seus pedidos"); 
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            }
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

    return { orders, loading, error, fetchOrders, authenticatedUser };
};
