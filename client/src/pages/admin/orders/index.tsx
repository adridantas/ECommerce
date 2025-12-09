import { useState, useEffect, useMemo } from "react"
import { fetchOrders, updateOrderStatus } from "@/services/orders"
import type { Order } from "@/commons/types"
import { Loader2 } from "lucide-react"

import { Card } from "primereact/card"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Tag } from "primereact/tag"
import OrderAttachmentsList from "@/components/orders/OrderAttachmentsList"

const statusOptions = [
  { label: "Todos", value: "" },
  { label: "Aguardando Pagamento", value: "AGUARDANDO_PAGAMENTO" },
  { label: "Pago", value: "PAGO" },
  { label: "Em Transporte", value: "EM_TRANSPORTE" },
  { label: "Entregue", value: "ENTREGUE" },
  { label: "Cancelado", value: "CANCELADO" },
]

// cor do status
const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'ENTREGUE': return 'success';
    case 'PAGO': return 'info';
    case 'CANCELADO': return 'danger';
    case 'EM_TRANSPORTE': return 'warning';
    default: return null; 
  }
};


const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const [statusFilter, setStatusFilter] = useState<any>(null) 
  const [clientFilter, setClientFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  const loadOrders = async () => {
    setLoading(true)
    try {
      const { items } = await fetchOrders()
      setOrders(items)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [])

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter && statusFilter !== "" && o.status !== statusFilter) return false
      if (dateFilter && !o.data.startsWith(dateFilter)) return false
      if (clientFilter && !String(o.userId).includes(clientFilter)) return false
      return true
    })
  }, [orders, statusFilter, clientFilter, dateFilter])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex align-items-center justify-content-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Pedidos</h1>
          <span className="text-gray-500">Total: {filteredOrders.length}</span>
        </div>

        {/* Filtros com PrimeReact */}
        <Card className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 flex flex-col gap-2">
              <label className="font-medium">Status</label>
              <Dropdown
                value={statusFilter}
                options={statusOptions}
                onChange={(e) => setStatusFilter(e.value)}
                optionLabel="label"
                placeholder="Filtrar por Status"
                className="w-full"
                showClear
              />
            </div>

            <div className="md:col-span-3 flex flex-col gap-2">
              <label className="font-medium">ID Cliente</label>
              <InputText
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                placeholder="Digite o ID"
                className="w-full"
              />
            </div>

            <div className="md:col-span-3 flex flex-col gap-2">
              <label className="font-medium">Data</label>
              <InputText
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <Button
                label="Limpar Filtros"
                icon="pi pi-filter-slash"
                outlined
                className="w-full"
                onClick={() => {
                  setStatusFilter(null)
                  setClientFilter("")
                  setDateFilter("")
                }}
              />
            </div>
          </div>
        </Card>

        {/* Lista de Pedidos */}
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredOrders.length === 0 && <p className="text-center text-gray-500">Nenhum pedido encontrado.</p>}

            {filteredOrders.map((order) => (
              <Card key={order.id} className="shadow-sm border-l-4 border-primary">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      Pedido #{order.id}
                      <Tag value={order.status} severity={getStatusSeverity(order.status)} />
                    </h2>
                    <p className="text-sm text-gray-500">Data: {order.data} | Cliente ID: {order.userId}</p>
                  </div>

                  {/* Alterar Status */}
                  <div className="w-full md:w-auto">
                    <Dropdown
                      value={order.status}
                      options={statusOptions.filter(o => o.value !== "")} 
                      optionLabel="label"
                      onChange={(e) => updateOrderStatus(order.id, e.value).then(loadOrders)}
                      className="w-full md:w-16rem"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Itens</h3>
                    <ul className="text-sm space-y-1">
                      {order.items.map(item => (
                        <li key={item.id} className="flex justify-between">
                          <span>Produto #{item.productId} (x{item.quantidade})</span>
                          <span className="font-medium">R$ {item.preco.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <OrderAttachmentsList
                      orderId={order.id}
                      canUpload={order.status === "EM_TRANSPORTE"}
                    />
                    <div className="mt-4 text-xl">
                      Total: <span className="font-bold text-primary">R$ {order.items.reduce((a, b) => a + (b.preco * b.quantidade), 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrdersPage