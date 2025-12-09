import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { HomePage } from "@/pages/home";
import { RequireAuth } from "@/components/require-auth";
import { Layout } from "@/components/layout";
import { CategoryListPage } from "@/pages/category-list";
import { CategoryFormPage } from "@/pages/category-form";
import { ProductListPage } from "@/pages/product-list";
import { ProductFormPage } from "@/pages/product-form";
import { NotFound } from "@/pages/not-found";
import { AddressPage } from "@/pages/address";
import { ProductView } from "@/pages/product-view";
import { RequireAdmin } from "@/components/require-admin";
import { UsersAdminPage } from "@/pages/admin/users";
import OrdersPage from "@/pages/orders";
import CartPage from "@/pages/cart";
import CheckoutPage from "@/pages/checkout";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminOrdersPage from "@/pages/admin/orders";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route index element={<HomePage />} />
          <Route path="categories" element={<CategoryListPage />} />
          <Route path="categories/new" element={<CategoryFormPage />} />
          <Route path="categories/:id" element={<CategoryFormPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id" element={<ProductFormPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="addresses" element={<AddressPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="/products/view" element={<ProductView />} />
          <Route path="/product-view/:id" element={<ProductView />} />

          {/* admin routes */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminOrdersPage />} />

            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/users" element={<UsersAdminPage />} />
          </Route>
        </Route>
        {/* fallback route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}