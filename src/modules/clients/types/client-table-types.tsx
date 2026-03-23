import { Checkbox } from "@/components/ui/checkbox";
import type { Client } from "@/modules/clients/types/client-types";
import type { ColumnDef } from "@tanstack/react-table";

export const clientColumns: ColumnDef<Client>[] = [
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
    header: "Id",
  },
  {
    accessorKey: "fullName",
    header: "Nombre completo",
    accessorFn: (row) =>
      `${row.firstName} ${row.secondName ?? ""} ${row.lastName} ${row.secondLastName ?? ""}`,
  },
  {
    accessorKey: "identification",
    header: "Identificación",
  },
  {
    accessorKey: "phoneNumber",
    header: "Teléfono",
  },
];
