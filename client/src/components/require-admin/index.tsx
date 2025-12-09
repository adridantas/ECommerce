import { useAuth } from "@/context/hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export function RequireAdmin() {
  const { authenticatedUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [authLoading]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  const isAdmin = authenticatedUser?.authorities?.some(
    (auth) => auth.authority === "ROLE_ADMIN"
  );

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
