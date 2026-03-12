import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconEdit, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

interface LoanToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  hasSelection: boolean;
}

export function LoanToolbar({
  searchQuery,
  onSearchChange,
  onEdit,
  onDelete,
  hasSelection,
}: LoanToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-sm flex-1">
        <IconSearch className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar préstamos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button asChild size="sm">
          <Link to="/loans/new">
            <IconPlus className="size-4" />
            Nuevo
          </Link>
        </Button>
        <Button
          onClick={onEdit}
          variant="outline"
          size="sm"
          disabled={!hasSelection}
        >
          <IconEdit className="size-4" />
          Editar
        </Button>
        <Button
          onClick={onDelete}
          variant="outline"
          size="sm"
          disabled={!hasSelection}
        >
          <IconTrash className="size-4" />
          Eliminar
        </Button>
      </div>
    </div>
  );
}
