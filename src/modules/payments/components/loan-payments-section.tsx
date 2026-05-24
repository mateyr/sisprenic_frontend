import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreatePayment,
  useDeletePayment,
  usePayments,
} from "../hooks/use-payments";
import type { Payment, PaymentFormData } from "../types/payment-types";
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
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const { payments, isLoading, error } = usePayments(loan.id);
  const createPaymentMutation = useCreatePayment(loan.id);
  const deletePaymentMutation = useDeletePayment(loan.id);

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

  async function handleConfirmDelete() {
    if (!paymentToDelete) return;
    try {
      await deletePaymentMutation.mutateAsync(paymentToDelete.id);
      toast.success("Pago eliminado exitosamente.");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar el pago.");
    } finally {
      setPaymentToDelete(null);
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
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
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
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setPaymentToDelete(payment)}
                          >
                            <IconTrash className="size-4" />
                            <span className="sr-only">Eliminar pago</span>
                          </Button>
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

      <AlertDialog
        open={paymentToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPaymentToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este pago?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Estás a punto de eliminar el pago del{" "}
                  <span className="font-medium text-foreground">
                    {paymentToDelete
                      ? formatDate(paymentToDelete.paymentDay)
                      : ""}
                  </span>
                  . Esta acción no se puede deshacer.
                </p>
                <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                  <p className="mb-1 font-medium">Esta acción afectará:</p>
                  <ul className="ml-4 list-disc space-y-0.5">
                    <li>Saldo pendiente del préstamo</li>
                    <li>Capital actual registrado</li>
                    <li>Cálculo de intereses futuros</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Sí, eliminar pago
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
