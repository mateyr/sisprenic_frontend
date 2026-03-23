import { CustomTable } from "@/components/ui/custom-table";
import type { ColumnDef, OnChangeFn, RowSelectionState } from "@tanstack/react-table";
import type { Client } from "../types/client-types";

interface ClientTableProps {
  columns: ColumnDef<Client>[];
  data: Client[];
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
}

export function ClientTable({
  columns,
  data,
  rowSelection,
  onRowSelectionChange,
}: ClientTableProps) {
  return (
    <CustomTable
      data={data}
      columns={columns}
      rowSelection={rowSelection}
      onRowSelectionChange={onRowSelectionChange}
      emptyMessage="No se encontraron clientes."
    />
  );
}
