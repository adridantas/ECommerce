"use client"
import { useOrders } from "@/context/hooks/useOrders"
import type { OrderStatus } from "@/commons/types"
import { Package, Calendar, DollarSign, Tag } from "lucide-react"
import OrderAttachmentsList from "@/components/orders/OrderAttachmentsList"

const statusColors: Record<OrderStatus, string> = {
  AGUARDANDO_PAGAMENTO: "bg-yellow-50 text-yellow-900 border border-yellow-200",
  PAGO: "bg-emerald-50 text-emerald-900 border border-emerald-200",
  EM_TRANSPORTE: "bg-blue-50 text-blue-900 border border-blue-200",
  ENTREGUE: "bg-green-50 text-green-900 border border-green-200",
  CANCELADO: "bg-red-50 text-red-900 border border-red-200",
}

const statusLabels: Record<OrderStatus, string> = {
  AGUARDANDO_PAGAMENTO: "Aguardando Pagamento",
  PAGO: "Pago",
  EM_TRANSPORTE: "Em Transporte",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
}

export default function OrdersPage() {
  const { orders, loading, error } = useOrders()

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-12 md:px-6 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-balance mb-2">Meus Pedidos</h1>
          <p className="text-center text-muted-foreground">Acompanhe o status de suas compras</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-border border-t-primary"></div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center text-destructive">
            {error}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">Você ainda não possui pedidos.</p>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Header */}
              <div className={`${statusColors[order.status]} px-6 py-4 flex justify-between items-center`}>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Pedido #{order.id}</h2>
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/50">
                  {statusLabels[order.status]}
                </span>
              </div>

              {/* Content */}
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Data</p>
                      <p className="text-sm font-medium">{new Date(order.data).toLocaleString("pt-BR")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Total</p>
                      <p className="text-sm font-bold text-primary">
                        R$ {order.items.reduce((acc, item) => acc + item.preco * item.quantidade, 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {order.items.length} Itens
                    </p>
                  </div>
                  <ul className="space-y-2 pl-6">
                    {order.items.map((item) => (
                      <li key={item.id} className="text-sm text-foreground/80">
                        <span className="font-medium">Produto #{item.productId}</span>
                        <span className="text-muted-foreground"> — </span>
                        <span>R${item.preco.toFixed(2)}</span>
                        <span className="text-muted-foreground"> × </span>
                        <span>{item.quantidade}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Attachments */}
                <OrderAttachmentsList orderId={order.id} canUpload={false}/>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
