import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useAuth } from "@/context/hooks/use-auth";

export interface Address {
    id: string;
    cep: string;
    logradouro: string;
    numero?: string;
    cidade: string;
    estado: string;
    complemento?: string;
    bairro?: string;
}

export const useAddresses = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);
    const { authenticatedUser } = useAuth();

    const fetchAddresses = async () => {
        if (!authenticatedUser?.id) return;
        setLoading(true);
        try {
            const response = await api.get(`/addresses/user/${authenticatedUser.id}`);
            console.log("RESPOSTA API ENDEREÇO:", response.data); 

            setAddresses(response.data);
            console.log("ENDERÇEOS RECEBIDOS:", response.data); 
        } catch (error) {
            console.error("Erro ao buscar endereços", error);
        } finally {
            setLoading(false);
        }
    };

    const addAddress = async (newAddress: Omit<Address, "id">) => {
        try {
            await api.post("/addresses", newAddress);
            await fetchAddresses(); 
        } catch (error: any) {
            console.error("Erro ao adicionar endereço", error);
            if (error.response?.data) {
                console.error("Detalhes do erro:", error.response.data);
            }
        }
    };

    useEffect(() => {
        if (authenticatedUser?.id) {
            fetchAddresses();
        } else {
            setAddresses([]); 
        }
    }, [authenticatedUser]);
    return {
        addresses,
        addAddress,
        fetchAddresses,
        loading,
        authenticatedUser,
    };
};
