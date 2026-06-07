import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ProblemDetailsError, type FieldErrors } from "@/lib/api-errors";
import { clientColumns } from "@/modules/clients/types/client-table-types";
import { IconX } from "@tabler/icons-react";
import type { RowSelectionState } from "@tanstack/react-table";
import { CircleAlertIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClientDeleteDialog } from "../components/client-delete-dialog";
import { ClientFormDialog } from "../components/client-form-dialog";
import { ClientTable } from "../components/client-table";
import { ClientToolbar } from "../components/client-toolbar";
import { useClients, useUpdateClient } from "../hooks/use-clients";
import { createClient, deleteClient } from "../services/client-api";
import type { ClientFormData } from "../types/client-types";
import { getFullName } from "../types/client-types";

export default function ClientIndex() {
  const { clients, isLoading, error, refetch } = useClients();
  const updateClientMutation = useUpdateClient();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteErrors, setDeleteErrors] = useState<FieldErrors | string | null>(
    null,
  );
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    if (!deleteErrors) {
      setIsDismissing(false);
      return;
    }
    const fadeTimer = setTimeout(() => setIsDismissing(true), 7000);
    const clearTimer = setTimeout(() => setDeleteErrors(null), 7700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(clearTimer);
    };
  }, [deleteErrors]);

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

  async function handleCreate(data: ClientFormData | Partial<ClientFormData>) {
    try {
      await createClient(data as ClientFormData);
      await refetch();
      setIsCreateOpen(false);
      toast.success("Cliente creado exitosamente.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al crear el cliente.",
      );
      throw err;
    }
  }

  async function handleEdit(data: Partial<ClientFormData>) {
    if (!selectedClient) return;
    try {
      await updateClientMutation.mutateAsync({
        id: selectedClient.id,
        data,
      });
      setRowSelection({});
      setIsEditOpen(false);
      toast.success("Cliente actualizado exitosamente.");
    } catch (err) {
      if (err instanceof ProblemDetailsError) {
        throw err;
      }
      throw err;
    }
  }

  // TODO: Implement bulk delete endpoint for multiple clients
  async function handleDelete() {
    if (selectedIds.length === 0) return;
    setDeleteErrors(null);
    try {
      for (const id of selectedIds) {
        await deleteClient(Number(id));
      }
      await refetch();
      setRowSelection({});
      setIsDeleteOpen(false);
      toast.success(
        selectedIds.length === 1
          ? "Cliente eliminado exitosamente."
          : `${selectedIds.length} clientes eliminados exitosamente.`,
      );
    } catch (err) {
      setIsDeleteOpen(false);
      if (err instanceof ProblemDetailsError) {
        setDeleteErrors(err.fieldErrors);
        return;
      }

      setDeleteErrors((err as Error).message);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>

      {deleteErrors && (
        <div
          className={`space-y-2 transition-opacity duration-700 ${isDismissing ? "opacity-0" : "opacity-100"}`}
        >
          {typeof deleteErrors === "string" ? (
            <Alert className="border-destructive/40 bg-destructive/10 pr-10 [&>svg]:text-destructive">
              <CircleAlertIcon />
              <AlertDescription className="text-foreground/90 text-[13.5px] leading-relaxed">
                {deleteErrors}
              </AlertDescription>
              <AlertAction
                onClick={() => setDeleteErrors(null)}
                className="top-1/2 right-3 -translate-y-1/2 cursor-pointer text-destructive/60 transition-colors hover:text-destructive"
              >
                <IconX className="size-4" />
              </AlertAction>
            </Alert>
          ) : (
            Object.entries(deleteErrors).map(([field, messages]) => (
              <Alert
                key={field}
                className="border-destructive/40 bg-destructive/10 pr-10 [&>svg]:text-destructive"
              >
                <CircleAlertIcon />
                <AlertDescription className="text-foreground/90 text-[13.5px] leading-relaxed">
                  {messages.join(", ")}
                </AlertDescription>
                <AlertAction
                  onClick={() =>
                    setDeleteErrors((prev) => {
                      const { [field]: _, ...rest } = prev as FieldErrors;
                      return Object.keys(rest).length > 0 ? rest : null;
                    })
                  }
                  className="top-1/2 right-3 -translate-y-1/2 cursor-pointer text-destructive/60 transition-colors hover:text-destructive"
                >
                  <IconX className="size-4" />
                </AlertAction>
              </Alert>
            ))
          )}
        </div>
      )}

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
