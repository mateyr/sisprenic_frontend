import { CustomTable } from "@/components/ui/custom-table";
import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table";
import { loanColumns } from "../types/loan-table-types";
import type { Loan } from "../types/loan-types";

interface LoanTableProps {
  loans: Loan[];
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
}

export function LoanTable({
  loans,
  rowSelection,
  onRowSelectionChange,
}: LoanTableProps) {
  return (
    <CustomTable
      data={loans}
      columns={loanColumns}
      rowSelection={rowSelection}
      onRowSelectionChange={onRowSelectionChange}
      emptyMessage="No se encontraron préstamos."
    />
  );
}
