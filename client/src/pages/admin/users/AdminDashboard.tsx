import { Card } from "primereact/card";
import { useAdminOrders } from "@/context/hooks/useAdminOrders";

export const AdminDashboard = () => {
  const { dashboard, loading } = useAdminOrders();

  if (loading || !dashboard) {
    return <div className="p-6 text-white">Carregando...</div>;
  }

  const cards = [
    { label: "Aguardando Pagamento", value: dashboard.aguardandoPagamento },
    { label: "Pagos", value: dashboard.pago },
    { label: "Em Transporte", value: dashboard.emTransporte },
    { label: "Entregues", value: dashboard.entregue },
    { label: "Cancelados", value: dashboard.cancelado },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      {cards.map((c) => (
        <Card key={c.label} title={c.label} className="text-center">
          <p className="text-3xl font-bold">{c.value}</p>
        </Card>
      ))}
    </div>
  );
};
      