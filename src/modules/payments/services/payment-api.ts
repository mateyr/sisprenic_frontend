import type { ApiResponse } from "@/types/api-response-type";
import type { Payment, PaymentFormData } from "../types/payment-types";
import { PaymentValidationError } from "../types/payment-types";

const API_BASE_URL = "http://localhost:5162";

export async function getPayments(): Promise<Payment[]> {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al obtener los pagos.");
  }

  return response.json() as Promise<Payment[]>;
}

export async function getLoanPayments(loanId: number): Promise<Payment[]> {
  const response = await fetch(`${API_BASE_URL}/loans/${loanId}/payments`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al obtener los pagos.");
  }

  return response.json() as Promise<Payment[]>;
}

export async function createPayment(
  data: PaymentFormData & { loanId: number },
): Promise<ApiResponse<Payment>> {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.status === 400) {
    const body = (await response.json()) as {
      errors?: Record<string, string[]>;
    };
    const messages = Object.values(body.errors ?? {}).flat();
    throw new PaymentValidationError(
      messages.length > 0 ? messages : ["Error de validación."],
    );
  }

  if (!response.ok) {
    throw new Error("Error al registrar el pago.");
  }

  return response.json() as Promise<ApiResponse<Payment>>;
}
