import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPencil, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";

interface ClientToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNew: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

export function ClientToolbar({
  searchQuery,
  onSearchChange,
  onNew,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: ClientToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-sm flex-1">
        <IconSearch className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onNew} size="sm">
          <IconPlus className="size-4" />
          Nuevo
        </Button>
        <Button
          onClick={onEdit}
          variant="outline"
          size="sm"
          disabled={!canEdit}
        >
          <IconPencil className="size-4" />
          Editar
        </Button>
        <Button
          onClick={onDelete}
          variant="outline"
          size="sm"
          disabled={!canDelete}
        >
          <IconTrash className="size-4" />
          Eliminar
        </Button>
      </div>
    </div>
  );
}
