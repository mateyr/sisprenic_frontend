import { Skeleton } from "@/components/ui/skeleton";
import { clientColumns } from "@/modules/clients/types/client-table-types";
import type { RowSelectionState } from "@tanstack/react-table";
import { toast } from "sonner";
import { useState } from "react";
import { ClientDeleteDialog } from "../components/client-delete-dialog";
import { ClientFormDialog } from "../components/client-form-dialog";
import { ClientTable } from "../components/client-table";
import { ClientToolbar } from "../components/client-toolbar";
import { useClients } from "../hooks/use-clients";
import {
  createClient,
  deleteClient,
  updateClient,
} from "../services/client-api";
import type { ClientFormData } from "../types/client-types";
import { getFullName } from "../types/client-types";

export default function ClientIndex() {
  const { clients, isLoading, error, refetch } = useClients();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const selectedIds = Object.keys(rowSelection);
  const selectedClient =
    selectedIds.length === 1
      ? clients.find((client) => client.id === Number(selectedIds[0]))
      : undefined;

  const canEdit = selectedIds.length === 1;
  const canDelete = selectedIds.length >= 1;

  const deleteLabel =
    selectedIds.length === 1 && selectedClient
      ? getFullName(selectedClient)
      : `${selectedIds.length} clientes`;

  const successToastStyle: React.CSSProperties = {
    background: "color-mix(in srgb, var(--primary) 10%, white)",
    color: "var(--primary)",
    border: "1px solid color-mix(in srgb, var(--primary) 35%, transparent)",
  };

  async function handleCreate(data: ClientFormData) {
    try {
      await createClient(data);
      await refetch();
      setIsCreateOpen(false);
      toast.success("Cliente creado exitosamente.", {
        style: successToastStyle
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al crear el cliente.",
      );
      throw err;
    }
  }

  async function handleEdit(data: ClientFormData) {
    if (!selectedClient) return;
    try {
      await updateClient(selectedClient.id, data);
      await refetch();
      setRowSelection({});
      setIsEditOpen(false);
      toast.success("Cliente actualizado exitosamente.", {
        style: successToastStyle,
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al actualizar el cliente.",
      );
      throw err;
    }
  }

  // TODO: Implement bulk delete endpoint for multiple clients
  async function handleDelete() {
    if (selectedIds.length === 0) return;
    for (const id of selectedIds) {
      await deleteClient(Number(id));
    }
    await refetch();
    setRowSelection({});
    setIsDeleteOpen(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>

      <ClientToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNew={() => setIsCreateOpen(true)}
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center rounded-md border border-destructive/20 bg-destructive/5 p-8">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      ) : (
        <ClientTable
          columns={clientColumns}
          data={clients}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      )}

      <ClientFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
        title="Nuevo cliente"
        description="Ingresa los datos del nuevo cliente."
      />

      <ClientFormDialog
        key={selectedIds[0]}
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setRowSelection({});
        }}
        onSubmit={handleEdit}
        title="Editar cliente"
        description="Modifica los datos del cliente seleccionado."
        defaultValues={selectedClient ?? null}
      />

      <ClientDeleteDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) setRowSelection({});
        }}
        onConfirm={handleDelete}
        clientName={deleteLabel}
      />
    </div>
  );
}
