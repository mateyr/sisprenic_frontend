import { z } from "zod";

export const clientFormSchema = z.object({
  firstName: z.string().min(1, "El primer nombre es requerido"),
  secondName: z.string(),
  lastName: z.string().min(1, "El primer apellido es requerido"),
  secondLastName: z.string(),
  identification: z.string().min(1, "La identificación es requerida"),
  phoneNumber: z.string().min(1, "El teléfono es requerido"),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;

export type ClientPayload = Partial<{
  firstName: string;
  secondName: string | null;
  lastName: string;
  secondLastName: string | null;
  identification: string;
  phoneNumber: string;
}>;

export type Client = {
  id: number;
  firstName: string;
  secondName: string;
  lastName: string;
  secondLastName: string;
  identification: string;
  phoneNumber: string;
};

export type ClientLoan = {
  id: number;
  principal: number;
  interestRate: number;
  termMonths: number;
  startDate: string;
};

export type ClientDetail = Client & {
  loans: ClientLoan[];
};

export function getFullName(client: Client): string {
  return [
    client.firstName,
    client.secondName,
    client.lastName,
    client.secondLastName,
  ]
    .filter(Boolean)
    .join(" ");
}
