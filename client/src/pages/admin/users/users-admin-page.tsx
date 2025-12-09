import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";

interface User {
  id: number;
  displayName: string;
  username: string;
  role: string;
  active: boolean;
}

export function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    const response = await api.get("/admin/users");
    setUsers(response.data);
  };

  const activateUser = async (id: number) => {
    await api.put(`/admin/users/${id}/activate`);
    loadUsers();
  };

  const changeRole = async (id: number, role: string) => {
    await api.put(`/admin/users/${id}/role`, { role });
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Card title="Gerenciamento de Usuários" className="mt-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Display Name</th>
            <th className="p-2">Username</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="p-2">{u.displayName}</td>
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">
                {u.active ? (
                  <Tag severity="success" value="Ativo" />
                ) : (
                  <Tag severity="danger" value="Inativo" />
                )}
              </td>

              <td className="p-2 flex gap-2">
                {!u.active && (
                  <Button
                    label="Ativar"
                    className="p-button-success p-button-sm"
                    onClick={() => activateUser(u.id)}
                  />
                )}

                <Button
                  label="Tornar Admin"
                  className="p-button-warning p-button-sm"
                  onClick={() => changeRole(u.id, "ADMIN")}
                />

                <Button
                  label="Tornar User"
                  className="p-button-secondary p-button-sm"
                  onClick={() => changeRole(u.id, "USER")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
