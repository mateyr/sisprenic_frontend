import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Client } from "../types/client-types";
import { getFullName } from "../types/client-types";

interface ClientTableProps {
  clients: Client[];
  selectedClient: Client | null;
  onSelect: (client: Client | null) => void;
}

export function ClientTable({
  clients,
  selectedClient,
  onSelect,
}: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-md border p-12">
        <p className="text-muted-foreground text-sm">
          No se encontraron clientes.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre completo</TableHead>
            <TableHead>Identificación</TableHead>
            <TableHead>Teléfono</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => {
            const isSelected = selectedClient?.id === client.id;
            return (
              <TableRow
                key={client.id}
                data-state={isSelected ? "selected" : undefined}
                className="cursor-pointer"
                onClick={() => onSelect(isSelected ? null : client)}
              >
                <TableCell className="font-medium">
                  {getFullName(client)}
                </TableCell>
                <TableCell>{client.identification}</TableCell>
                <TableCell>{client.phoneNumber}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
