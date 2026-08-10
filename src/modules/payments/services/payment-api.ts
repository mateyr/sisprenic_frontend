import { HttpError, throwApiError } from "@/lib/api-errors";
import { API_BASE_URL } from "@/lib/env";
import type { ApiResponse } from "@/types/api-response-type";
import type { Payment, PaymentFormData } from "../types/payment-types";

export async function getPayments(): Promise<Payment[]> {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new HttpError(response.status, "Error al obtener los pagos.");
  }

  return response.json() as Promise<Payment[]>;
}

export async function getLoanPayments(loanId: number): Promise<Payment[]> {
  const response = await fetch(`${API_BASE_URL}/loans/${loanId}/payments`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new HttpError(response.status, "Error al obtener los pagos.");
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

  if (!response.ok) {
    await throwApiError(response, "Error al registrar el pago.");
  }

  return response.json() as Promise<ApiResponse<Payment>>;
}

export async function deletePayment(paymentId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    await throwApiError(response, "Error al eliminar el pago.");
  }
}
