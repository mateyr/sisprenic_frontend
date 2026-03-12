import { Skeleton } from "@/components/ui/skeleton";
import { getFullName } from "@/modules/clients/types/client-types";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LoanDeleteDialog } from "../components/loan-delete-dialog";
import { LoanTable } from "../components/loan-table";
import { LoanToolbar } from "../components/loan-toolbar";
import { useLoans } from "../hooks/use-loans";
import { deleteLoan } from "../services/loan-api";
import type { Loan } from "../types/loan-types";

export default function LoanIndex() {
  const { loans, isLoading, error, refetch } = useLoans();
  const navigate = useNavigate();

  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

  async function handleDelete() {
    if (!selectedLoan) return;
    await deleteLoan(selectedLoan.id);
    await refetch();
    setSelectedLoan(null);
    setIsDeleteOpen(false);
  }

  function handleDoubleClick(loan: Loan) {
    navigate({ to: `/loans/${loan.id}` });
  }

  const selectedClientName = selectedLoan?.client
    ? getFullName(selectedLoan.client)
    : `Cliente #${selectedLoan?.clientId ?? ""}`;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Préstamos</h1>

      <LoanToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onEdit={() => {
          if (selectedLoan) navigate({ to: `/loans/${selectedLoan.id}/edit` });
        }}
        onDelete={() => setIsDeleteOpen(true)}
        hasSelection={!!selectedLoan}
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
          selectedLoan={selectedLoan}
          onSelect={setSelectedLoan}
          onDoubleClick={handleDoubleClick}
        />
      )}

      <LoanDeleteDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) setSelectedLoan(null);
        }}
        onConfirm={handleDelete}
        loanPrincipal={selectedLoan?.principal ?? 0}
        clientName={selectedClientName}
      />
    </div>
  );
}
