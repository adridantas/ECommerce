import React, { useContext, useEffect, useState } from "react";
import { Menubar } from "primereact/menubar";
import type { MenuItem } from "primereact/menuitem";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import { InputSwitch } from "primereact/inputswitch";
import { AuthContext } from "@/context/AuthContext";

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const { authenticatedUser } = useContext(AuthContext);
  const user = authenticatedUser?.username;
  const isAdmin = authenticatedUser?.authorities?.some(
    (auth) => auth.authority === "ROLE_ADMIN"
  );
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const { authenticated, handleLogout } = useAuth();

  useEffect(() => {
    const themeLink = document.getElementById("theme-link") as HTMLLinkElement;
    themeLink.href = darkMode
      ? "https://unpkg.com/primereact/resources/themes/lara-dark-blue/theme.css"
      : "https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  const items: MenuItem[] = authenticated
    ? [
      { label: "Home", icon: "pi pi-home", command: () => navigate("/") },
      {
        label: "Categorias",
        icon: "pi pi-box",
        items: [
          {
            label: "Listar",
            icon: "pi pi-list",
            command: () => navigate("/categories"),
          },
          {
            label: "Novo",
            icon: "pi pi-plus",
            command: () => navigate("/categories/new"),
          },
        ],
      },
      {
        label: "Produtos",
        icon: "pi pi-box",
        items: [
          {
            label: "Listar",
            icon: "pi pi-list",
            command: () => navigate("/products"),
          },
          {
            label: "Novo",
            icon: "pi pi-plus",
            command: () => navigate("/products/new"),
          },
        ],
      },
      {
        label: "Carrinho",
        icon: "pi pi-shopping-cart",
        command: () => navigate("/cart"),
      },
      {
        label: "Endereços",
        icon: "pi pi-address-book",
        command: () => navigate("/addresses"),
      },
      {
        label: "Pedidos",
        icon: "pi pi-shopping-bag",
        command: () => navigate("/orders"),
      },


    ]
    : [];

  const start = (
    <div
      className="flex align-items-center gap-2 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <img
        src="src/assets/logoUtfpr.png"
        alt="Logo"
        height={32}
        style={{ objectFit: "contain" }}

      />
      <span className="font-bold text-lg hidden sm:block">PW44S</span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-3">
      <div className="flex items-center gap-2">
        <i
          className={`pi pi-sun ${darkMode ? "text-gray-400" : "text-yellow-500"
            }`}
          style={{ marginTop: "5px" }}
        />
        <InputSwitch
          checked={darkMode}
          onChange={(e) => setDarkMode(e.value ?? false)}
        />
        <i
          className={`pi pi-moon ${darkMode ? "text-blue-300" : "text-gray-400"
            }`}
          style={{ marginTop: "5px" }}
        />
      </div>
      {isAdmin && (
        <div className="flex align-items-center">
          <Button
            label="Admin"
            icon="pi pi-shield"
            className="p-button-text text-yellow-500"
            onClick={() => navigate("/admin/users")}
          />
        </div>
      )}



      {authenticated && (

        <>
          <span className="font-semibold hidden sm:block">{user}</span>
          <Avatar
            image="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Caleb"
            shape="square"
          />
          <Button
            icon="pi pi-sign-out"
            className="p-button-text"
            onClick={handleLogoutClick}
          />
        </>
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: "var(--surface-ground)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
      className="fixed top-0 left-0 w-full z-50"
    >
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};

export default TopMenu;