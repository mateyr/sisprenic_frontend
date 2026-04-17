import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { paymentFormSchema } from "../types/payment-types";
import type { PaymentFormData } from "../types/payment-types";
import type { Loan } from "@/modules/loans/types/loan-types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NewPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: Loan;
  onSubmit: (data: PaymentFormData) => Promise<void>;
}

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function getSuggestedInterest(loan: Loan) {
  return parseFloat((loan.principal * loan.interestRate).toFixed(2));
}

export function NewPaymentDialog({
  open,
  onOpenChange,
  loan,
  onSubmit,
}: NewPaymentDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      interest: getSuggestedInterest(loan),
      principal: 0,
      paymentDay: getTodayString(),
      note: "",
    },
    validators: {
      onSubmit: paymentFormSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      try {
        await onSubmit(value);
        form.reset();
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        );
      }
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset();
      setSubmitError(null);
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Pago</DialogTitle>
          <DialogDescription>
            Ingrese los detalles del pago para el préstamo #{loan.id}.
          </DialogDescription>
        </DialogHeader>

        <form
          id="payment-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {submitError && (
              <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                {submitError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <form.Field
                name="interest"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Interés
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          (sugerido)
                        </span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        step="0.01"
                        min="0"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(parseFloat(e.target.value) || 0)
                        }
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="principal"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Capital</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        step="0.01"
                        min="0"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(parseFloat(e.target.value) || 0)
                        }
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>

            <form.Field
              name="paymentDay"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Fecha de Pago</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="date"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="note"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Nota
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <textarea
                    id={field.name}
                    name={field.name}
                    rows={3}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Observaciones del pago..."
                    className={cn(
                      "placeholder:text-muted-foreground dark:bg-input/30 border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow,border-color] duration-150 outline-none",
                      "focus-visible:border-primary focus-visible:ring-primary/15 focus-visible:ring-[3px]",
                      "disabled:pointer-events-none disabled:opacity-50 resize-none",
                    )}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                form="payment-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar Pago"}
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
