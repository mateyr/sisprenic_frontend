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
import { ProblemDetailsError, type FieldErrors } from "@/lib/api-errors";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import type { Client, ClientFormData } from "../types/client-types";
import { clientFormSchema } from "../types/client-types";

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClientFormData | Partial<ClientFormData>) => Promise<void>;
  title: string;
  description?: string;
  defaultValues?: Client | null;
}

export function ClientFormDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  defaultValues,
}: ClientFormDialogProps) {
  const [submitErrors, setSubmitErrors] = useState<FieldErrors | string | null>(
    null,
  );

  const originalValues: ClientFormData = {
    firstName: defaultValues?.firstName ?? "",
    secondName: defaultValues?.secondName ?? "",
    lastName: defaultValues?.lastName ?? "",
    secondLastName: defaultValues?.secondLastName ?? "",
    identification: defaultValues?.identification ?? "",
    phoneNumber: defaultValues?.phoneNumber ?? "",
  };

  const form = useForm({
    defaultValues: originalValues,
    validators: {
      onSubmit: clientFormSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitErrors(null);

      let payload: ClientFormData | Partial<ClientFormData> = value;

      if (defaultValues) {
        const diff: Partial<ClientFormData> = {};
        if (value.firstName !== originalValues.firstName)
          diff.firstName = value.firstName;
        if (value.secondName !== originalValues.secondName)
          diff.secondName = value.secondName;
        if (value.lastName !== originalValues.lastName)
          diff.lastName = value.lastName;
        if (value.secondLastName !== originalValues.secondLastName)
          diff.secondLastName = value.secondLastName;
        if (value.identification !== originalValues.identification)
          diff.identification = value.identification;
        if (value.phoneNumber !== originalValues.phoneNumber)
          diff.phoneNumber = value.phoneNumber;

        if (Object.keys(diff).length === 0) {
          handleOpenChange(false);
          return;
        }

        payload = diff;
      }

      try {
        await onSubmit(payload);
        form.reset();
      } catch (err) {
        console.error(err);

        if (err instanceof ProblemDetailsError) {
          setSubmitErrors(err.fieldErrors);
          return;
        }

        setSubmitErrors((err as Error).message);
      }
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset();
      setSubmitErrors(null);
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form
          id="client-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {submitErrors && (
              <div className="space-y-2">
                {typeof submitErrors === "string" ? (
                  <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                    {submitErrors}
                  </div>
                ) : (
                  Object.entries(submitErrors).map(([field, messages]) => (
                    <div
                      key={field}
                      className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
                    >
                      {messages.join(", ")}
                    </div>
                  ))
                )}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <form.Field
                name="firstName"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Primer nombre
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Ej: Juan"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="secondName"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Segundo nombre</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ej: Carlos"
                    />
                  </Field>
                )}
              />
              <form.Field
                name="lastName"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Primer apellido
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Ej: Pérez"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="secondLastName"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Segundo apellido
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ej: López"
                    />
                  </Field>
                )}
              />
            </div>
            <form.Field
              name="identification"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Identificación</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Ej: 001-010190-0001A"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="phoneNumber"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Teléfono</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Ej: 88887777"
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
              <Button type="submit" form="client-form" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
