import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
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
import type { Client, ClientFormData } from "../types/client-types";
import { getFullName } from "../types/client-types";

export default function ClientIndex() {
  const { clients, isLoading, error, refetch } = useClients();

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        getFullName(client).toLowerCase().includes(query) ||
        client.identification.toLowerCase().includes(query) ||
        client.phoneNumber.includes(query),
    );
  }, [clients, searchQuery]);

  async function handleCreate(data: ClientFormData) {
    await createClient(data);
    await refetch();
    setIsCreateOpen(false);
  }

  async function handleEdit(data: ClientFormData) {
    if (!selectedClient) return;
    await updateClient(selectedClient.id, data);
    await refetch();
    setSelectedClient(null);
    setIsEditOpen(false);
  }

  async function handleDelete() {
    if (!selectedClient) return;
    await deleteClient(selectedClient.id);
    await refetch();
    setSelectedClient(null);
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
        hasSelection={!!selectedClient}
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
          clients={filteredClients}
          selectedClient={selectedClient}
          onSelect={setSelectedClient}
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
        key={selectedClient?.id}
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setSelectedClient(null);
        }}
        onSubmit={handleEdit}
        title="Editar cliente"
        description="Modifica los datos del cliente seleccionado."
        defaultValues={selectedClient}
      />

      <ClientDeleteDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) setSelectedClient(null);
        }}
        onConfirm={handleDelete}
        clientName={selectedClient ? getFullName(selectedClient) : ""}
      />
    </div>
  );
}
