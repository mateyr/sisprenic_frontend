import { z } from "zod";

export type Payment = {
  id: number;
  principal: number;
  interest: number;
  paymentDay: string;
  note?: string;
  loanId: number;
};

export class PaymentValidationError extends Error {
  public readonly messages: string[]
  constructor(messages: string[]) {
    super(messages.join("; "));
    this.messages = messages
    this.name = "PaymentValidationError";
  }
}

export const paymentFormSchema = z.object({
  interest: z.number().min(0, "El interés debe ser mayor o igual a 0"),
  principal: z.number().min(0, "El capital debe ser mayor o igual a 0"),
  paymentDay: z.string().min(1, "La fecha de pago es requerida"),
  note: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentFormSchema>;
