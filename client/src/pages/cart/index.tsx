import { useCart } from "@/context/CartContext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export const CartPage = () => {
  const { cart, removeFromCart, total, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto pt-24 px-4">
      <h2 className="text-2xl mb-4">Carrinho de Compras</h2>
      {cart.length === 0 ? (
        <p>Carrinho vazio.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {cart.map((item) => (
              <li
                key={item.product.id}
                className="flex items-center justify-between bg-gray-900 p-4 rounded-lg"
              >
                <div className="flex items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-1 h-1 object-cover rounded mr-4"
                  />
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {item.product.name}
                      <Button
                        icon="pi pi-minus"
                        className="p-button-text p-button-sm"
                        onClick={() => decreaseQuantity(item.product.id ?? 0)}
                        disabled={item.quantity <= 1}
                        style={{ width: 28, height: 28 }}
                      />
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        icon="pi pi-plus"
                        className="p-button-text p-button-sm"
                        onClick={() => increaseQuantity(item.product.id ?? 0)}
                        style={{ width: 28, height: 28 }}
                      />
                    </p>
                    <p className="flex items-right">{item.product.description}</p>
                    <p className="text-white font-semibold">
                      R${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>

                <Button
                  icon="pi pi-times"
                  className="p-button-danger p-button-text"
                  onClick={() => removeFromCart(item.product.id!)}
                />
              </li>
            ))}
          </ul>
          <div className="mt-4 font-bold">Total: R${total.toFixed(2)}</div>
          <Button
            label="Finalizar Compra"
            onClick={() => navigate("/checkout")}
            className="mt-4"
          />
        </>
      )}
    </div>
  );
};
