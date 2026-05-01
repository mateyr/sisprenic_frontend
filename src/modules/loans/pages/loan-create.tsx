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
import { useClients } from "@/modules/clients/hooks/use-clients";
import { getFullName } from "@/modules/clients/types/client-types";
import { IconArrowLeft } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { LoanSummary } from "../components/loan-summary";
import { createLoan } from "../services/loan-api";
import { loanFormSchema } from "../types/loan-types";

export default function LoanCreate() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const { clients, isLoading: clientsLoading } = useClients();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      clientId: search.clientId ?? 0,
      principal: 0,
      interestRate: 0,
      termMonths: 0,
      startDate: new Date().toISOString().split("T")[0],
    },
    validators: {
      onSubmit: loanFormSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      try {
        await createLoan(value);
        toast.success("Préstamo creado exitosamente.");
        navigate({ to: "/loans" });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al crear el préstamo.";
        setSubmitError(message);
        toast.error(message);
      }
    },
  });

  // TODO: Improve UI for Volver and Detalle préstamo buttons
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
          Nuevo Préstamo
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Datos del Préstamo</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="loan-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                {submitError && (
                  <div className="text-destructive text-sm rounded-md border border-destructive/20 bg-destructive/5 p-3">
                    {submitError}
                  </div>
                )}

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
                <Link to="/loans">Cancelar</Link>
              </Button>
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    type="submit"
                    form="loan-form"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creando..." : "Crear Préstamo"}
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
