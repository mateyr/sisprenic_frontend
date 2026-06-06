import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate, formatPercent } from "@/lib/formats";
import { getFullName } from "@/modules/clients/types/client-types";
import { LoanPaymentsSection } from "@/modules/payments/components/loan-payments-section";
import type { ApiMessage } from "@/types/api-response-type";
import {
  IconArrowLeft,
  IconEdit,
  IconFileText,
  IconX,
} from "@tabler/icons-react";
import { Link, useParams } from "@tanstack/react-router";
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { LoanContractDialog } from "../components/loan-contract-dialog";
import { useLoan } from "../hooks/use-loan";

export default function LoanDetail() {
  const { loanId } = useParams({ strict: false }) as { loanId: string };
  const id = Number(loanId);
  const { loan, client, isLoading, error } = useLoan(id);
  const [correctionMessages, setCorrectionMessages] = useState<
    ApiMessage[] | null
  >(null);
  const [contractOpen, setContractOpen] = useState(false);

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
        <h1 className="text-2xl font-semibold tracking-tight">
          Detalle del Préstamo
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setContractOpen(true)}
          >
            <IconFileText className="size-4" />
            Ver Contrato
          </Button>
          <Button asChild size="sm">
            <Link to={`/loans/${id}/edit`}>
              <IconEdit className="size-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      {correctionMessages && correctionMessages.length > 0 && (
        <div className="space-y-2">
          {correctionMessages.map((msg) => (
            <Alert
              key={msg.code}
              className="border-primary/40 bg-primary/10 pr-10 [&>svg]:text-primary"
            >
              <InfoIcon />
              <AlertDescription className="text-foreground/90 text-[13.5px] leading-relaxed">
                {msg.message}
              </AlertDescription>
              <AlertAction
                onClick={() =>
                  setCorrectionMessages(
                    (prev) => prev?.filter((m) => m.code !== msg.code) ?? null,
                  )
                }
                className="top-1/2 right-3 -translate-y-1/2 cursor-pointer text-primary/60 transition-colors hover:text-primary"
              >
                <IconX className="size-4" />
              </AlertAction>
            </Alert>
          ))}
        </div>
      )}

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
              <DetailRow label="Plazo" value={`${loan.termMonths} meses`} />
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

      <LoanPaymentsSection
        loan={loan}
        onPaymentCreated={({ messages }) => {
          setCorrectionMessages(messages ?? null);
        }}
      />

      {contractOpen && (
        <LoanContractDialog
          open={contractOpen}
          onOpenChange={setContractOpen}
          loanId={id}
        />
      )}
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
