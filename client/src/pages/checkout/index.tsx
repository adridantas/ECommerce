import { useCart } from "@/context/CartContext"
import { useAddresses } from "@/context/hooks/useAddresses"
import { useState, useRef } from "react"
import type { Address } from "@/context/hooks/useAddresses"
import { api } from "@/lib/axios"
import { useNavigate } from "react-router-dom"
import { buscarEnderecoPorCep, calcularFrete } from "@/services/cep-service"
import { useAuth } from "@/context/hooks/use-auth"
import { Loader2 } from "lucide-react"

// Componentes PrimeReact
import { Card } from "primereact/card"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { Dropdown } from "primereact/dropdown"
import { Toast } from "primereact/toast"
import { InputMask } from "primereact/inputmask" // Opcional: para máscara de CEP

const CheckoutPage = () => {
  const { cart, total, clearCart } = useCart()
  const { authenticatedUser } = useAuth()
  const { addresses } = useAddresses()
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  const [cep, setCep] = useState("")
  const [frete, setFrete] = useState<number | null>(null)
  const [cepLoading, setCepLoading] = useState(false)
  const [enderecoViaCep, setEnderecoViaCep] = useState<any | null>(null)

  // Prepara opções para o Dropdown do PrimeReact
  const addressOptions = addresses.map((addr) => ({
    label: `${addr.logradouro}, ${addr.numero ?? "s/n"} - ${addr.cidade}/${addr.estado}`,
    value: addr
  }))

  const finalizar = async () => {
    if (!selectedAddress && !enderecoViaCep) {
      toast.current?.show({ severity: 'warn', summary: 'Atenção', detail: 'Selecione ou busque um endereço para a entrega' })
      return
    }

    if (!cart || cart.length === 0) {
      toast.current?.show({ severity: 'warn', summary: 'Carrinho Vazio', detail: 'Adicione itens antes de finalizar.' })
      return
    }

    setIsProcessingOrder(true)
    try {
      const orderData = {
        userId: authenticatedUser?.id,
        addressId: selectedAddress?.id ?? null,
        enderecoManual: enderecoViaCep ?? null,
        totalAmount: total + (frete ?? 0),
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      }
      const response = await api.post("/orders", orderData)
      
      if (response.status === 201 || response.status === 200) {
        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Pedido realizado com sucesso!' })
        clearCart()
        setTimeout(() => navigate("/orders"), 1500)
      } else {
        throw new Error("Erro na resposta")
      }
    } catch (error) {
      console.error(error)
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível processar seu pedido.' })
    } finally {
      setIsProcessingOrder(false)
    }
  }

  const handleCepSearch = async () => {
    if (cep.replace(/\D/g, "").length < 8) return
    setCepLoading(true)
    try {
      const data = await buscarEnderecoPorCep(cep)
      if (data.erro) {
        toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'CEP não encontrado.' })
      } else {
        setEnderecoViaCep(data)
        setSelectedAddress(null)
        setFrete(calcularFrete(data.uf))
        toast.current?.show({ severity: 'info', summary: 'Endereço Encontrado', detail: `${data.logradouro} - ${data.bairro}` })
      }
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar CEP.' })
    } finally {
      setCepLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-6 md:py-12">
      <Toast ref={toast} />
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">Finalizar Pedido</h1>
        <p className="text-gray-500 mb-8">Revise seus dados e conclua a compra</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Esquerda: Endereço */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Endereço de Entrega" className="shadow-sm">
              <div className="flex flex-col gap-4">
                
                {/* Seleção de Endereço */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700">Seus endereços salvos</label>
                  <Dropdown 
                    value={selectedAddress} 
                    onChange={(e) => {
                        setSelectedAddress(e.value);
                        setEnderecoViaCep(null);
                        if(e.value) setFrete(calcularFrete(e.value.estado));
                    }} 
                    options={addressOptions} 
                    optionLabel="label" 
                    placeholder="Selecione um endereço..." 
                    className="w-full"
                    emptyMessage="Nenhum endereço cadastrado"
                  />
                </div>

                <div className="flex items-center gap-4 py-2">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <span className="text-sm text-gray-500 font-medium">OU BUSCAR POR CEP</span>
                    <div className="h-px bg-gray-300 flex-1"></div>
                </div>

                {/* Busca por CEP */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="cep" className="font-medium text-gray-700">Novo Endereço</label>
                  <div className="p-inputgroup">
                    <InputMask 
                        id="cep" 
                        mask="99999-999" 
                        value={cep} 
                        onChange={(e) => setCep(e.target.value ?? "")} 
                        placeholder="Digite o CEP"
                    />
                    <Button 
                        icon={cepLoading ? <Loader2 className="animate-spin" /> : "pi pi-search"} 
                        onClick={handleCepSearch}
                        disabled={cep.length < 8 || cepLoading}
                    />
                  </div>
                </div>

                {/* Resultado CEP */}
                {enderecoViaCep && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-2">
                    <p className="font-semibold text-blue-800">Endereço Localizado:</p>
                    <p className="text-sm text-blue-700">{enderecoViaCep.logradouro}, {enderecoViaCep.bairro}</p>
                    <p className="text-sm text-blue-700">{enderecoViaCep.localidade} - {enderecoViaCep.uf}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Coluna Direita: Resumo */}
          <div className="lg:col-span-1">
            <Card title="Resumo do Pedido" className="shadow-sm sticky top-6">
              {cart.length === 0 ? (
                <p className="text-gray-500">Seu carrinho está vazio.</p>
              ) : (
                <ul className="mb-4 space-y-2">
                  {cart.map((item) => (
                    <li key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.quantity}x {item.product.name}</span>
                      <span className="font-semibold">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span className="text-green-600 font-medium">{frete !== null ? `R$ ${frete.toFixed(2)}` : '--'}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-primary mt-4 pt-2 border-t">
                  <span>Total</span>
                  <span>R$ {(total + (frete ?? 0)).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                    label="Confirmar Pedido" 
                    icon="pi pi-check" 
                    className="w-full" 
                    onClick={finalizar}
                    loading={isProcessingOrder}
                    disabled={cart.length === 0 || (!selectedAddress && !enderecoViaCep)}
                />
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CheckoutPage