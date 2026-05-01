import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formats";
import { getFullName } from "@/modules/clients/types/client-types";
import type { RowSelectionState } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { LoanDeleteDialog } from "../components/loan-delete-dialog";
import { LoanTable } from "../components/loan-table";
import { LoanToolbar } from "../components/loan-toolbar";
import { useLoans } from "../hooks/use-loans";
import { deleteLoan } from "../services/loan-api";

export default function LoanIndex() {
  const { loans, isLoading, error, refetch } = useLoans();
  const navigate = useNavigate();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const selectedIds = Object.keys(rowSelection);
  const selectedLoan =
    selectedIds.length === 1
      ? loans.find((l) => l.id === Number(selectedIds[0]))
      : undefined;

  const canEdit = selectedIds.length === 1;
  const canDelete = selectedIds.length >= 1;

  const deleteLabel =
    selectedIds.length === 1 && selectedLoan
      ? `el préstamo de ${formatCurrency(selectedLoan.principal)} del cliente ${
          selectedLoan.client
            ? getFullName(selectedLoan.client)
            : `#${selectedLoan.clientId}`
        }`
      : `${selectedIds.length} préstamos`;

  const filteredLoans = useMemo(() => {
    if (!searchQuery.trim()) return loans;
    const query = searchQuery.toLowerCase();
    return loans.filter((loan) => {
      const clientName = loan.client
        ? getFullName(loan.client).toLowerCase()
        : "";
      return (
        clientName.includes(query) ||
        loan.principal.toString().includes(query) ||
        loan.termMonths.toString().includes(query)
      );
    });
  }, [loans, searchQuery]);

  function handleEdit() {
    if (!selectedLoan) return;
    navigate({ to: "/loans/$loanId/edit", params: { loanId: String(selectedLoan.id) } });
  }

  async function handleDelete() {
    if (selectedIds.length === 0) return;
    try {
      for (const id of selectedIds) {
        await deleteLoan(Number(id));
      }
      await refetch();
      setRowSelection({});
      setIsDeleteOpen(false);
      toast.success(
        selectedIds.length === 1
          ? "Préstamo eliminado exitosamente."
          : `${selectedIds.length} préstamos eliminados exitosamente.`,
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al eliminar el préstamo.",
      );
      throw err;
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Préstamos</h1>

      <LoanToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onEdit={handleEdit}
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
        <LoanTable
          loans={filteredLoans}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      )}

      <LoanDeleteDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) setRowSelection({});
        }}
        onConfirm={handleDelete}
        deleteLabel={deleteLabel}
      />
    </div>
  );
}
