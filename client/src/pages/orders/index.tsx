import { useOrders } from "@/context/hooks/useOrders";

export const OrdersPage = () => {
  const { orders, loading, error } = useOrders();

  const formatDate = (isoString: string) => {
    if (!isoString) return "N/A";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Erro ao formatar data:", isoString, e);
      return isoString;
    }
  };

  return (
    <div className="container mx-auto pt-24 px-4 max-w-xl bg-white text-gray-800 rounded-lg shadow-lg p-6"
      style={{
        backgroundColor: "#ffffff", 
        color: "#1f2937"
      }}>
      <h2
        className="text-2xl mb-4 font-bold"
        style={{
          color: "#1f2937" 
        }}
      >
        Meus Pedidos
      </h2>
      {loading && (
        <div className="text-center text-gray-600">Carregando pedidos</div>
      )}

      {error && (
        <div className="text-center text-red-500">Erro: {error}</div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center text-gray-600">Você ainda não tem nenhum pedido.</div>
      )}

      {!loading && !error && orders.length > 0 && (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="shadow-md rounded-lg p-4 border border-gray-200"
              style={{
                backgroundColor: "#ffffff",
                color: "#1f2937"
              }}
            >              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-lg text-indigo-700">Pedido #{order.id}</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                 ${order.status === 'Entregue'
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : order.status === 'Em transporte'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'}
                  `}>
                  {order.status || 'Pendente'}
                </span>

              </div>
              <p className="text-gray-700">Data: {formatDate(order.data)}</p>
              <p className="text-gray-700 font-bold">Total: R$ {order.totalAmount?.toFixed(2) || '0.00'}</p>

              {order.items && order.items.length > 0 && (
                <div className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
                  <p className="font-semibold">Itens:</p>
                  <ul className="list-disc list-inside">
                    {order.items.map((item, index) => (
                      <li key={item.id || index} className="text-gray-800 dark:text-gray-200">
                        {item.product?.name } x {item.quantity} - R$ {item.preco?.toFixed(2) || '0.00'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
