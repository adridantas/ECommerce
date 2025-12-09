import { Outlet } from "react-router-dom";
import TopMenu from "../Top-Menu";
import { useAuth } from "@/context/hooks/use-auth";
import { Link } from "react-router-dom";

export function Layout() {
  const { authenticatedUser } = useAuth();

  const isAdmin = authenticatedUser?.authorities?.some(
    (auth) => auth.authority === "ROLE_ADMIN"
  );

  return (
    <>
      <TopMenu />
      <header>
        {isAdmin && (
          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-2"
          >
            Painel Administrativo
          </Link>
        )}
      </header>
      <main style={{ paddingTop: "40px" }}>
        <Outlet />
      </main>
    </>
  );
}