import { Outlet } from "react-router-dom";
import TopMenu from "../Top-Menu";

export function Layout() {
  return (
    <>
      <TopMenu />
      <main style={{ paddingTop: "40px" }}>
        <Outlet />
      </main>
    </>
  );
}