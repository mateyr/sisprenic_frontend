import { z } from "zod";
import type { Client } from "@/modules/clients/types/client-types";

export type Loan = {
  id: number;
  principal: number;
  interestRate: number;
  termMonths: number;
  startDate: string;
  clientId: number;
  client?: Client;
};

export const loanFormSchema = z.object({
  clientId: z.number().min(1, "Debe seleccionar un cliente"),
  principal: z.number().min(1, "El monto principal es requerido"),
  interestRate: z.number().min(0.01, "La tasa de interés es requerida"),
  termMonths: z.number().int().min(1, "El plazo es requerido"),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
});

export type LoanFormData = z.infer<typeof loanFormSchema>;
