import React, { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useRef } from "react";

interface User {
  id: number;
  username: string;
  displayName: string;
  active: boolean;
  role: "ADMIN" | "USER";
}

const roleOptions = [
  { label: "Administrador", value: "ADMIN" },
  { label: "Usuário", value: "USER" },
];

export const UsersAdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);

  const loadUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível carregar os usuários.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const activateUser = async (id: number) => {
    try {
      await api.put(`/admin/users/${id}/activate`);
      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Usuário ativado!",
      });
      loadUsers();
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível ativar o usuário.",
      });
    }
  };

  const changeRole = async (id: number, role: "ADMIN" | "USER") => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Permissão atualizada!",
      });
      loadUsers();
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível alterar a permissão.",
      });
    }
  };

  const roleEditor = (rowData: User) => {
    return (
      <Dropdown
        value={rowData.role}
        options={roleOptions}
        onChange={(e) => changeRole(rowData.id, e.value)}
      />
    );
  };

  const activeTemplate = (rowData: User) => {
    return rowData.active ? (
      <Tag severity="success" value="Ativo" />
    ) : (
      <Tag severity="danger" value="Inativo" />
    );
  };

  const activateButtonTemplate = (rowData: User) => {
    if (rowData.active) return null;

    return (
      <Button
        label="Ativar"
        icon="pi pi-check"
        className="p-button-success"
        onClick={() => activateUser(rowData.id)}
      />
    );
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <Card title="Gerenciamento de Usuários">
        <DataTable value={users} loading={loading} paginator rows={10}>
          <Column field="id" header="ID" />
          <Column field="username" header="Usuário" />
          <Column field="displayName" header="Nome" />
          <Column header="Status" body={activeTemplate} />
          <Column header="Permissão" body={roleEditor} />
          <Column body={activateButtonTemplate} header="Ação" />
        </DataTable>
      </Card>
    </div>
  );
};
