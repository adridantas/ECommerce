"use client"
import { useCart } from "@/context/CartContext"
import { useNavigate } from "react-router-dom"
import { ShoppingCart, Trash2 } from "lucide-react"

// Componentes PrimeReact
import { Card } from "primereact/card"
import { Button } from "primereact/button"
import { InputNumber, type InputNumberValueChangeEvent } from "primereact/inputnumber" // CORREÇÃO 1: Usando 'type' para importar o tipo

const CartPage = () => {
  const { cart, removeFromCart, total, increaseQuantity, decreaseQuantity } = useCart()
  const navigate = useNavigate()

  // Ajustamos a tipagem do evento para garantir compatibilidade com PrimeReact
  const handleQuantityChange = (
    productId: number,
    event: InputNumberValueChangeEvent // Usamos o tipo de evento do PrimeReact
  ) => {
    // O valor (quantity) vem de event.value
    const quantity = event.value

    // CORREÇÃO 2: Adicionando verificação explícita para 'undefined'
    if (quantity === null || quantity === undefined || quantity < 1) return

    const id = productId

    // Calcula a diferença para saber se deve aumentar ou diminuir a quantidade
    const currentItem = cart.find(item => item.product.id === id)
    if (!currentItem) return

    // CORREÇÃO 3: TypeScript agora confia que 'quantity' é number (não undefined/null)
    const difference = quantity - currentItem.quantity

    if (difference > 0) {
      for (let i = 0; i < difference; i++) {
        increaseQuantity(id)
      }
    } else if (difference < 0) {
      for (let i = 0; i < Math.abs(difference); i++) {
        decreaseQuantity(id)
      }
    }
  }

  // Novo corpo para centralizar o título
  const headerContent = (
    <div className="flex flex-col items-center justify-center text-center mb-12">
      <ShoppingCart className="w-10 h-10 text-primary mb-3" />
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Carrinho de Compras</h1>
      <p className="text-gray-500 mt-2">
        {cart.length} {cart.length === 1 ? "item" : "itens"} no carrinho
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 text-foreground px-4 py-12 md:px-6 md:py-16">
      <div className="max-w-5xl mx-auto">

        {/* Header Centralizado */}
        {headerContent}

        {/* Carrinho Vazio */}
        {cart.length === 0 ? (
          <Card className="text-center shadow-lg p-6">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4 opacity-70" />
            <p className="text-gray-500 text-lg mb-6">Seu carrinho está vazio</p>
            <Button
              onClick={() => navigate("/products")}
              label="Continuar Comprando"
              icon="pi pi-arrow-left"
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Itens do Carrinho */}
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.product.id} className="p-4 shadow-sm">
                  <div className="flex gap-4">

                    {/* Imagem do Produto */}
                    <div className="w-2 h-2 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        // CORREÇÃO: Usamos object-contain para garantir que a imagem inteira caiba.
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    {/* Informações do Produto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-1">{item.product.description}</p>

                      {/* Controle de Quantidade (InputNumber) */}
                      <InputNumber
                        value={item.quantity}
                        onValueChange={(e) => handleQuantityChange(item.product.id ?? 0, e)}
                        showButtons
                        mode="decimal"
                        min={1}
                        max={99}
                        className="w-24 mt-2"
                        inputClassName="text-center"
                        decrementButtonClassName="p-button-danger"
                        incrementButtonClassName="p-button-success"
                      />
                    </div>

                    {/* Preço e Ações */}
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        onClick={() => removeFromCart(item.product.id!)}
                        icon={<Trash2 className="w-4 h-4" />}
                        severity="danger"
                        text
                        aria-label="Remover do carrinho"
                        className="p-button-rounded"
                      />
                      <p className="text-lg font-bold text-primary whitespace-nowrap mt-4">
                        R$ {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Resumo do Carrinho */}
            <div className="md:col-span-1">
              <Card title="Resumo" className="shadow-lg sticky top-4">
                <div className="space-y-3 pb-4 border-b border-gray-200 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">R${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Frete</span>
                    <span className="font-medium text-emerald-600">Grátis</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-lg">Total</span>
                  <span className="text-2xl font-bold text-primary">R${total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={() => navigate("/checkout")}
                  label="Finalizar Compra"
                  icon="pi pi-credit-card"
                  className="w-full p-button-lg"
                />

                <Button
                  onClick={() => navigate("/products")}
                  label="Continuar Comprando"
                  severity="secondary"
                  outlined
                  className="w-full mt-3"
                />
              </Card>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage