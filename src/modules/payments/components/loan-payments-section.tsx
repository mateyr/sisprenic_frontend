import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/formats";
import type { Loan } from "@/modules/loans/types/loan-types";
import type { ApiMessage } from "@/types/api-response-type";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreatePayment, usePayments } from "../hooks/use-payments";
import type { PaymentFormData } from "../types/payment-types";
import { NewPaymentDialog } from "./new-payment-dialog";

interface LoanPaymentsSectionProps {
  loan: Loan;
  onPaymentCreated?: (result: { messages?: ApiMessage[] }) => void;
}

export function LoanPaymentsSection({
  loan,
  onPaymentCreated,
}: LoanPaymentsSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { payments, isLoading, error } = usePayments(loan.id);
  const createPaymentMutation = useCreatePayment(loan.id);

  async function handleCreatePayment(data: PaymentFormData) {
    try {
      const result = await createPaymentMutation.mutateAsync(data);
      setDialogOpen(false);
      toast.success("Pago registrado exitosamente.");
      onPaymentCreated?.({ messages: result.messages });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pagos</CardTitle>
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <IconPlus className="size-4" />
              Nuevo Pago
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center rounded-md border border-destructive/20 bg-destructive/5 p-6">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Interés</TableHead>
                    <TableHead className="text-right">Capital</TableHead>
                    <TableHead>Nota</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-8 text-center text-sm text-muted-foreground"
                      >
                        Aún no se han registrado pagos para este préstamo.
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.paymentDay)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(payment.interest)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(payment.principal)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {payment.note ?? "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <NewPaymentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        loan={loan}
        onSubmit={handleCreatePayment}
      />
    </>
  );
}
