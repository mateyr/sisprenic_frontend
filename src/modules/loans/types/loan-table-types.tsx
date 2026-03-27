import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency, formatDate, formatPercent } from "@/lib/formats";
import { getFullName } from "@/modules/clients/types/client-types";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import type { Loan } from "./loan-types";

export const loanColumns: ColumnDef<Loan>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Código",
    cell: ({ row }) => (
      <Link
        to="/loans/$loanId"
        params={{ loanId: String(row.original.id) }}
        className="font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
      >
        #{row.original.id}
      </Link>
    ),
  },
  {
    id: "clientName",
    header: "Cliente",
    cell: ({ row }) => {
      const loan = row.original;
      const clientName = loan.client
        ? getFullName(loan.client)
        : `Cliente #${loan.clientId}`;

      return (
        <Link
          to="/clients/$clientId"
          params={{ clientId: String(loan.clientId) }}
          className="text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
        >
          {clientName}
        </Link>
      );
    },
  },
  {
    accessorKey: "principal",
    header: "Monto",
    cell: ({ row }) => (
      <span className="tabular-nums">{formatCurrency(row.original.principal)}</span>
    ),
  },
  {
    accessorKey: "interestRate",
    header: "Tasa",
    cell: ({ row }) => (
      <span className="tabular-nums">{formatPercent(row.original.interestRate)}</span>
    ),
  },
  {
    accessorKey: "termMonths",
    header: "Plazo",
    cell: ({ row }) => `${row.original.termMonths} meses`,
  },
  {
    accessorKey: "startDate",
    header: "Fecha inicio",
    cell: ({ row }) => formatDate(row.original.startDate),
  },
];
