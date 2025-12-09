"use client"
import { Card } from "@/components/ui/card"
import { useAdminOrders } from "@/context/hooks/useAdminOrders"
import { BarChart3, AlertCircle, CheckCircle2, Truck, Package, TrendingUp } from "lucide-react"

const statusConfig = [
  {
    key: "aguardandoPagamento",
    label: "Aguardando Pagamento",
    icon: AlertCircle,
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    bgColor: "bg-yellow-100/20",
  },
  {
    key: "pago",
    label: "Pagos",
    icon: CheckCircle2,
    color: "bg-blue-50 border-blue-200 text-blue-700",
    bgColor: "bg-blue-100/20",
  },
  {
    key: "emTransporte",
    label: "Em Transporte",
    icon: Truck,
    color: "bg-purple-50 border-purple-200 text-purple-700",
    bgColor: "bg-purple-100/20",
  },
  {
    key: "entregue",
    label: "Entregues",
    icon: CheckCircle2,
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    bgColor: "bg-emerald-100/20",
  },
  {
    key: "cancelado",
    label: "Cancelados",
    icon: AlertCircle,
    color: "bg-red-50 border-red-200 text-red-700",
    bgColor: "bg-red-100/20",
  },
]

const AdminDashboard = () => {
  const { dashboard, loading } = useAdminOrders()

  if (loading || !dashboard) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-border border-t-primary"></div>
      </div>
    )
  }

  const stats = [
    { key: "aguardandoPagamento", value: dashboard.aguardandoPagamento },
    { key: "pago", value: dashboard.pago },
    { key: "emTransporte", value: dashboard.emTransporte },
    { key: "entregue", value: dashboard.entregue },
    { key: "cancelado", value: dashboard.cancelado },
  ]

  const total = stats.reduce((sum, s) => sum + s.value, 0)
  const completedOrders = dashboard.entregue + dashboard.pago

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-6 md:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Painel Administrativo</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            <span className="font-bold text-foreground">{total}</span> pedidos no total
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border rounded-2xl p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wide mb-2">
                  Pedidos Completos
                </p>
                <p className="text-4xl font-bold text-primary">{completedOrders}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {((completedOrders / total) * 100).toFixed(0)}% do total
                </p>
              </div>
              <Package className="w-12 h-12 text-primary/20" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wide mb-2">
                  Taxa de Conclusão
                </p>
                <p className="text-4xl font-bold text-primary">
                  {total > 0 ? ((completedOrders / total) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {completedOrders} de {total} pedidos
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-primary/20" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Status dos Pedidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {statusConfig.map((config) => {
              const stat = stats.find((s) => s.key === config.key)!
              const Icon = config.icon

              return (
                <Card
                  key={config.key}
                  className={`border-2 p-6 rounded-2xl ${config.color} hover:shadow-md transition-all`}
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${config.bgColor} mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold mb-2">{config.label}</p>
                  <p className="text-4xl font-bold">{stat.value}</p>
                  <p className="text-xs mt-3 opacity-70">{((stat.value / total) * 100).toFixed(1)}% do total</p>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
