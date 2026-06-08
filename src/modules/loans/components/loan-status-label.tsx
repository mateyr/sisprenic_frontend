import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Pagado:
    "bg-green-100 text-green-800 border-green-300 hover:bg-green-100 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700",
  Activo:
    "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700",
  Vencido:
    "bg-red-100 text-red-800 border-red-300 hover:bg-red-100 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700",
};

const defaultStyle =
  "bg-muted text-muted-foreground border-border hover:bg-muted";

interface LoanStatusLabelProps {
  status: string;
}

export function LoanStatusLabel({ status }: LoanStatusLabelProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-7 min-w-[4.75rem] text-sm",
        statusStyles[status] ?? defaultStyle,
      )}
    >
      {status}
    </Badge>
  );
}
