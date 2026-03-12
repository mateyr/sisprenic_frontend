import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFullName } from "@/modules/clients/types/client-types";
import { IconArrowLeft, IconEdit } from "@tabler/icons-react";
import { Link, useParams } from "@tanstack/react-router";
import { useLoan } from "../hooks/use-loan";
import { formatCurrency, formatDate, formatPercent } from "@/lib/formats";

export default function LoanDetail() {
  const { loanId } = useParams({ strict: false }) as { loanId: string };
  const id = Number(loanId);
  const { loan, client, isLoading, error } = useLoan(id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </div>
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="flex flex-col gap-4">
        <Button asChild variant="ghost" size="sm" className="w-fit">
          <Link to="/loans">
            <IconArrowLeft className="size-4" />
            Volver a préstamos
          </Link>
        </Button>
        <div className="flex items-center justify-center rounded-md border border-destructive/20 bg-destructive/5 p-8">
          <p className="text-destructive text-sm">
            {error ?? "No se encontró el préstamo."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/loans">
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          Detalle del Préstamo
        </h1>
        <div className="ml-auto">
          <Button asChild size="sm">
            <Link to={`/loans/${id}/edit`}>
              <IconEdit className="size-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información del Préstamo</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="flex flex-col gap-4">
              <DetailRow
                label="Monto Principal"
                value={formatCurrency(loan.principal)}
              />
              <Separator />
              <DetailRow
                label="Tasa de Interés"
                value={formatPercent(loan.interestRate)}
              />
              <Separator />
              <DetailRow
                label="Plazo"
                value={`${loan.termMonths} meses`}
              />
              <Separator />
              <DetailRow
                label="Fecha de Inicio"
                value={formatDate(loan.startDate)}
              />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            {client ? (
              <dl className="flex flex-col gap-4">
                <DetailRow label="Nombre" value={getFullName(client)} />
                <Separator />
                <DetailRow
                  label="Identificación"
                  value={client.identification}
                />
                <Separator />
                <DetailRow label="Teléfono" value={client.phoneNumber} />
              </dl>
            ) : (
              <p className="text-muted-foreground text-sm">
                No se pudo cargar la información del cliente.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Monto del Pago</TableHead>
                  <TableHead className="text-right">Capital</TableHead>
                  <TableHead className="text-right">Interés</TableHead>
                  <TableHead className="text-right">Saldo Restante</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody />
            </Table>
          </div>
          <p className="text-muted-foreground mt-4 text-center text-sm">
            Aún no se han registrado pagos para este préstamo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
