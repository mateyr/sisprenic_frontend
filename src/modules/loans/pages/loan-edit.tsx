import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ProblemDetailsError } from "@/lib/api-errors";
import { useClients } from "@/modules/clients/hooks/use-clients";
import { getFullName } from "@/modules/clients/types/client-types";
import { IconArrowLeft, IconX } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { CircleAlertIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LoanSummary } from "../components/loan-summary";
import { useLoan } from "../hooks/use-loan";
import { updateLoan } from "../services/loan-api";
import type { Loan, LoanFormData } from "../types/loan-types";
import { loanFormSchema } from "../types/loan-types";

type SubmitError = { id: string; message: string };

// Generate stable IDs for rendering since backend may not provide identifiers for messages
let submitErrorSeq = 0;
function toSubmitErrors(messages: string[]): SubmitError[] {
  return messages.map((message) => ({
    id: `err-${++submitErrorSeq}`,
    message,
  }));
}

export default function LoanEdit() {
  const { loanId } = useParams({ strict: false }) as { loanId: string };
  const id = Number(loanId);
  const { loan, isLoading: loanLoading, error: loanError } = useLoan(id);
  const { clients, isLoading: clientsLoading } = useClients();
  const navigate = useNavigate();

  if (loanLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-56" />
        </div>
      </div>
    );
  }

  if (loanError || !loan) {
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
            {loanError ?? "No se encontró el préstamo."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <LoanEditForm
      loan={loan}
      clients={clients}
      clientsLoading={clientsLoading}
      onSuccess={() => navigate({ to: `/loans/${id}` })}
    />
  );
}

function LoanEditForm({
  loan,
  clients,
  clientsLoading,
  onSuccess,
}: {
  loan: Loan;
  clients: {
    id: number;
    firstName: string;
    secondName: string;
    lastName: string;
    secondLastName: string;
    identification: string;
    phoneNumber: string;
  }[];
  clientsLoading: boolean;
  onSuccess: () => void;
}) {
  const [submitErrors, setSubmitErrors] = useState<SubmitError[]>([]);

  useEffect(() => {
    if (submitErrors.length === 0) return;
    const timer = setTimeout(() => setSubmitErrors([]), 10_000);
    return () => clearTimeout(timer);
  }, [submitErrors]);

  const originalValues: LoanFormData = {
    clientId: loan.client.id,
    principal: loan.principal,
    interestRate: loan.interestRate * 100,
    termMonths: loan.termMonths,
    startDate: loan.startDate.split("T")[0],
  };

  const form = useForm({
    defaultValues: originalValues,
    validators: {
      onSubmit: loanFormSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitErrors([]);

      const diff: Partial<LoanFormData> = {};
      if (value.clientId !== originalValues.clientId)
        diff.clientId = value.clientId;
      if (value.principal !== originalValues.principal)
        diff.principal = value.principal;
      if (value.interestRate !== originalValues.interestRate)
        diff.interestRate = value.interestRate / 100;
      if (value.termMonths !== originalValues.termMonths)
        diff.termMonths = value.termMonths;
      if (value.startDate !== originalValues.startDate)
        diff.startDate = value.startDate;

      if (Object.keys(diff).length === 0) {
        onSuccess();
        return;
      }

      try {
        await updateLoan(loan.id, diff);
        toast.success("Préstamo actualizado exitosamente.");
        onSuccess();
      } catch (err) {
        if (err instanceof ProblemDetailsError) {
          setSubmitErrors(toSubmitErrors(err.messages));
        } else {
          console.error(err);
          setSubmitErrors(
            toSubmitErrors([
              "Ocurrió un error inesperado. Por favor contacta a TI.",
            ]),
          );
        }
      }
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link to={`/loans/${loan.id}`}>
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          Editar Préstamo
        </h1>
      </div>

      {submitErrors.length > 0 && (
        <div className="space-y-2">
          {submitErrors.map((error) => (
            <Alert
              key={error.id}
              className="border-destructive/40 bg-destructive/10 pr-10 [&>svg]:text-destructive"
            >
              <CircleAlertIcon />
              <AlertDescription className="text-foreground/90 text-[13.5px] leading-relaxed">
                {error.message}
              </AlertDescription>
              <AlertAction
                onClick={() =>
                  setSubmitErrors((prev) =>
                    prev.filter((e) => e.id !== error.id),
                  )
                }
                className="top-1/2 right-3 -translate-y-1/2 cursor-pointer text-destructive/60 transition-colors hover:text-destructive"
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
            <CardTitle>Datos del Préstamo</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="loan-edit-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.Field
                  name="clientId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Cliente</FieldLabel>
                        {clientsLoading ? (
                          <Skeleton className="h-9 w-full" />
                        ) : (
                          <select
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                            aria-invalid={isInvalid}
                            className="border-input bg-transparent flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-[border-color,box-shadow] duration-150 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/15 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value={0}>Seleccionar cliente...</option>
                            {clients.map((client) => (
                              <option key={client.id} value={client.id}>
                                {getFullName(client)}
                              </option>
                            ))}
                          </select>
                        )}
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
                        <FieldLabel htmlFor={field.name}>
                          Monto Principal
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="number"
                          min={0}
                          step="0.01"
                          value={field.state.value || ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            const val = e.target.valueAsNumber;
                            field.handleChange(Number.isNaN(val) ? 0 : val);
                          }}
                          aria-invalid={isInvalid}
                          placeholder="Ej: 10000"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="interestRate"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Tasa de Interés (%)
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="number"
                          min={0}
                          step="0.01"
                          value={field.state.value || ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            const val = e.target.valueAsNumber;
                            field.handleChange(Number.isNaN(val) ? 0 : val);
                          }}
                          aria-invalid={isInvalid}
                          placeholder="Ej: 15"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="termMonths"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Plazo (meses)
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="number"
                          min={1}
                          step={1}
                          value={field.state.value || ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            const val = e.target.valueAsNumber;
                            field.handleChange(Number.isNaN(val) ? 0 : val);
                          }}
                          aria-invalid={isInvalid}
                          placeholder="Ej: 12"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="startDate"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Fecha de Inicio
                        </FieldLabel>
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
              </FieldGroup>
            </form>

            <div className="mt-6 flex justify-end gap-2">
              <Button asChild variant="outline">
                <Link to={`/loans/${loan.id}`}>Cancelar</Link>
              </Button>
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    type="submit"
                    form="loan-edit-form"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </CardContent>
        </Card>

        <div className="lg:sticky lg:top-4 lg:self-start">
          <form.Subscribe
            selector={(state) => ({
              principal: state.values.principal,
              interestRate: state.values.interestRate,
              termMonths: state.values.termMonths,
            })}
          >
            {({ principal, interestRate, termMonths }) => (
              <LoanSummary
                principal={principal}
                interestRate={interestRate}
                termMonths={termMonths}
              />
            )}
          </form.Subscribe>
        </div>
      </div>
    </div>
  );
}
