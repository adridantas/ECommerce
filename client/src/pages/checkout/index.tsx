import { useCart } from "@/context/CartContext";
import { useAddresses } from "@/context/hooks/useAddresses";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useState } from "react";
import type { Address } from "@/context/hooks/useAddresses";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { buscarEnderecoPorCep, calcularFrete } from "@/services/cep-service";

export const CheckoutPage = () => {
  const { cart, total, clearCart } = useCart();
  const { addresses, authenticatedUser } = useAddresses();

  const navigate = useNavigate();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<number | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [enderecoViaCep, setEnderecoViaCep] = useState<any | null>(null); 

  const finalizar = async () => {
    if (!selectedAddress && !enderecoViaCep) {
      alert("Selecione ou busque um endereço para a entrega");
      return;
    }

    if (!cart || cart.length === 0) {
      alert("Seu carrinho esta vazio");
      return;
    }

    if (!authenticatedUser?.id) {
      alert(" Usuario nao autenticado. Faça login novamente");
      return;
    }

    setIsProcessingOrder(true);

    try {
      const orderData = {
        userId: authenticatedUser.id,
        addressId: selectedAddress?.id ?? null,
        enderecoManual: enderecoViaCep ?? null,
        totalAmount: total + (frete ?? 0),
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }))
      };

      const response = await api.post("/orders", orderData);

      if (response.status === 201 || response.status === 200) {
        alert("Pedido finalizado com sucesso!");
        clearCart();
        navigate("/orders");
      } else {
        alert("Erro ao finalizar pedido ");
        console.error("Erro na resposta do backend:", response.data);
      }

    } catch (error: any) {
      console.error("Erro ao enviar pedido para o backend:", error);
      alert("Erro ao processar seu pedido");

      if (error.response?.data?.message) {
        alert(`Erro: ${error.response.data.message}`);
      }

    } finally {
      setIsProcessingOrder(false);
    }
  };

  const formatAddress = (addr: Address) =>
    `${addr.logradouro}, ${addr.numero ?? "s/n"} - ${addr.cidade}/${addr.estado} (CEP: ${addr.cep})`;

  return (
    <div className="container mx-auto pt-24 px-4 max-w-xl text-white">
      <h2 className="text-2xl mb-4">Finalizar Pedido</h2>

      <Dropdown
        value={selectedAddress}
        onChange={(e) => {
          setSelectedAddress(e.value);
          setEnderecoViaCep(null); 
          const valorFrete = calcularFrete(e.value.estado);
          setFrete(valorFrete);
        }}
        options={addresses}
        optionLabel="logradouro"
        itemTemplate={formatAddress}
        placeholder="Selecione um endereço"
        className="w-full mb-4"
        emptyMessage="Nenhuma opcao disponivel"
      />

      <div className="mb-4">
        <label htmlFor="cep" className="block font-medium mb-1">
          Buscar endereço por CEP:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="cep"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            placeholder="Digite o CEP (ex: 01001-000)"
            className="p-inputtext p-component w-full"
          />
          <Button
            label={cepLoading ? "Buscando" : "Buscar"}
            disabled={cep.length < 8 || cepLoading}
            onClick={async () => {
              setCepLoading(true);
              try {
                const data = await buscarEnderecoPorCep(cep);
                if (data.erro) {
                  alert("CEP não encontrado.");
                } else {
                  const normalizarCep = (cep: string) => cep.replace(/\D/g, "");
                  const addressEncontrado = addresses.find(
                    (addr) => normalizarCep(addr.cep) === normalizarCep(data.cep)
                  );

                  if (addressEncontrado) {
                    setSelectedAddress(addressEncontrado);
                    setEnderecoViaCep(null);
                    const valorFrete = calcularFrete(data.uf);
                    setFrete(valorFrete);
                  } else {
                    setEnderecoViaCep(data);
                    setSelectedAddress(null);
                    const valorFrete = calcularFrete(data.uf);
                    setFrete(valorFrete);
                    alert("Endereço encontrado via CEP, mas não está cadastrado. Usaremos ele para calculo.");
                  }
                }
              } catch {
                alert("Erro ao buscar o CEP.");
              } finally {
                setCepLoading(false);
              }
            }}
          />
        </div>
      </div>

      {enderecoViaCep && (
        <div className="bg-gray-800 text-white p-4 rounded mb-4">
          <p><strong>Rua:</strong> {enderecoViaCep.logradouro}</p>
          <p><strong>Bairro:</strong> {enderecoViaCep.bairro}</p>
          <p><strong>Cidade:</strong> {enderecoViaCep.localidade}</p>
          <p><strong>Estado:</strong> {enderecoViaCep.uf}</p>
          <p><strong>CEP:</strong> {enderecoViaCep.cep}</p>
        </div>
      )}

      <div className="mb-4">
        <p className="font-semibold">Resumo:</p>
        {cart.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          cart.map((item) => (
            <p key={item.product.id}>
              {item.product.name} x{item.quantity} - R${(item.product.price * item.quantity).toFixed(2)}
            </p>
          ))
        )}
        {frete !== null && (
          <p className="mt-1">Frete: R$ {frete.toFixed(2)}</p>
        )}
        <p className="mt-2 font-bold">
          Total com Frete: R$ {(total + (frete ?? 0)).toFixed(2)}
        </p>
      </div>

      <Button
        label={isProcessingOrder ? "Processando..." : "Confirmar Pedido"}
        onClick={finalizar}
        disabled={(cart.length === 0) || (!selectedAddress && !enderecoViaCep) || isProcessingOrder}
        className="w-full"
      />
    </div>
  );
};
