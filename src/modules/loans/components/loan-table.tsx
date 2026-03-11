import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate, formatPercent } from "@/lib/formats";
import { getFullName } from "@/modules/clients/types/client-types";
import type { Loan } from "../types/loan-types";

interface LoanTableProps {
  loans: Loan[];
  selectedLoan: Loan | null;
  onSelect: (loan: Loan | null) => void;
  onDoubleClick: (loan: Loan) => void;
}

export function LoanTable({
  loans,
  selectedLoan,
  onSelect,
  onDoubleClick,
}: LoanTableProps) {
  if (loans.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-md border p-12">
        <p className="text-muted-foreground text-sm">
          No se encontraron préstamos.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="text-right">Tasa</TableHead>
            <TableHead className="text-right">Plazo</TableHead>
            <TableHead>Fecha inicio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => {
            const isSelected = selectedLoan?.id === loan.id;
            const clientName = loan.client
              ? getFullName(loan.client)
              : `Cliente #${loan.clientId}`;

            return (
              <TableRow
                key={loan.id}
                data-state={isSelected ? "selected" : undefined}
                className="cursor-pointer"
                onClick={() => onSelect(isSelected ? null : loan)}
                onDoubleClick={() => onDoubleClick(loan)}
              >
                <TableCell className="font-medium">{clientName}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(loan.principal)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPercent(loan.interestRate)}
                </TableCell>
                <TableCell className="text-right">
                  {loan.termMonths} meses
                </TableCell>
                <TableCell>{formatDate(loan.startDate)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
