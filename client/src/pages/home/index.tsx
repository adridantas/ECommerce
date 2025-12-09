import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";

export const HomePage = () => {
  const { authenticatedUser } = useAuth();

  const isAdmin = authenticatedUser?.authorities?.some(
    (auth) => auth.authority === "ROLE_ADMIN"
  );

  if (isAdmin) {
    return <Navigate to="/admin/orders" replace />;
  }

  return (
    <>
      <h1>Bem-vindo à Página Inicial</h1>
    </>
  );
};
