import { useAuth } from "@/context/hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";

export function RequireAuth() {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
}