import { z } from "zod";

export const clientFormSchema = z.object({
  firstName: z.string().min(1, "El primer nombre es requerido"),
  secondName: z.string().optional().default(""),
  lastName: z.string().min(1, "El primer apellido es requerido"),
  secondLastName: z.string().optional().default(""),
  identification: z.string().min(1, "La identificación es requerida"),
  phoneNumber: z.string().min(1, "El teléfono es requerido"),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;

export type Client = {
  id: number;
  firstName: string;
  secondName: string;
  lastName: string;
  secondLastName: string;
  identification: string;
  phoneNumber: string;
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
