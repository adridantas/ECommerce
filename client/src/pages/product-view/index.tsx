import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { IProduct } from "@/commons/types.ts";
import ProductService from "@/services/product-service.ts";

export const ProductView = () => {
    const { id } = useParams(); 
    const [product, setProduct] = useState<IProduct | null>(null);
    const { findById } = ProductService;

    useEffect(() => {
        if (id) {
            loadProduct(parseInt(id));
        }
    }, [id]);

    const loadProduct = async (productId: number) => {
        const response = await findById(productId);
        if (response.status === 200 && response.data) {
            setProduct(response.data as IProduct);
        }
    };


    if (!product) return <p className="pt-24 px-4">Carregando produto..</p>;

    return (
        <div className="container mx-auto px-4 pt-24 text-white">
            <div className="flex flex-col md:flex-row gap-8">
                <img src={product.image} alt={product.name} className="w-1 md:w-2 rounded-xl" />
                <div>
                    <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                    <p className="text-lg mb-2 text-gray-300">{product.description}</p>
                    <p className="text-xl font-semibold text-green-400 mb-4">
                        R$ {product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">
                        Categoria: {product.category?.name}
                    </p>
                </div>
            </div>
        </div>
    );
};
