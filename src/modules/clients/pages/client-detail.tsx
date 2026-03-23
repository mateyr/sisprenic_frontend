import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate, formatPercent } from "@/lib/formats";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { useClientDetail } from "../hooks/use-client-detail";
import { getFullName } from "../types/client-types";

export default function ClientDetail() {
  const { clientId } = useParams({ strict: false }) as { clientId: string };
  const id = Number(clientId);
  const { client, isLoading, error } = useClientDetail(id);
  const navigate = useNavigate();

  const financialSummary = useMemo(() => {
    if (!client) return { activeLoans: 0, totalLoans: 0, currentDebt: 0 };
    const loans = client.loans ?? [];
    return {
      activeLoans: loans.length,
      totalLoans: loans.length,
      currentDebt: loans.reduce((sum, loan) => sum + loan.principal, 0),
    };
  }, [client]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-56 lg:col-span-2" />
          <Skeleton className="h-56" />
        </div>
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex flex-col gap-4">
        <Button asChild variant="ghost" size="sm" className="w-fit">
          <Link to="/clients">
            <IconArrowLeft className="size-4" />
            Volver a clientes
          </Link>
        </Button>
        <div className="flex items-center justify-center rounded-md border border-destructive/20 bg-destructive/5 p-8">
          <p className="text-destructive text-sm">
            {error ?? "No se encontró el cliente."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-solid py-3">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">{getFullName(client)}</h1>

          <p className="text-sm text-muted-foreground">
            {client.identification}
          </p>
        </div>

        <Button
          onClick={() =>
            navigate({ to: "/loans/new", search: { clientId: client.id } })
          }
        >
          <IconPlus className="size-4 mr-2" />
          Nuevo Préstamo
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow label="Primer Nombre" value={client.firstName} />
              <InfoRow
                label="Segundo Nombre"
                value={client.secondName || "—"}
              />
              <InfoRow label="Primer Apellido" value={client.lastName} />
              <InfoRow
                label="Segundo Apellido"
                value={client.secondLastName || "—"}
              />
              <InfoRow label="Identificación" value={client.identification} />
              <InfoRow label="Teléfono" value={client.phoneNumber} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen Financiero</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <SummaryItem
                label="Préstamos Activos"
                value={String(financialSummary.activeLoans)}
              />
              <Separator />
              <SummaryItem
                label="Total Préstamos"
                value={String(financialSummary.totalLoans)}
              />
              <Separator />
              <SummaryItem
                label="Deuda Actual"
                value={formatCurrency(financialSummary.currentDebt)}
                highlight
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Préstamos</CardTitle>
        </CardHeader>
        <CardContent>
          {client.loans.length === 0 ? (
            <div className="flex items-center justify-center rounded-md border p-12">
              <p className="text-muted-foreground text-sm">
                Este cliente no tiene préstamos registrados.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Tasa</TableHead>
                    <TableHead className="text-right">Plazo</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.loans.map((loan) => (
                    <TableRow
                      key={loan.id}
                      className="cursor-pointer"
                      onDoubleClick={() =>
                        navigate({ to: `/loans/${loan.id}` })
                      }
                    >
                      <TableCell className="font-medium">#{loan.id}</TableCell>
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className={highlight ? "text-lg font-semibold" : "font-medium"}>
        {value}
      </span>
    </div>
  );
}
