import { throwApiError } from "@/lib/api-errors";
import { API_BASE_URL } from "@/lib/env";
import type { Loan, LoanFormData } from "../types/loan-types";

export async function getLoans(): Promise<Loan[]> {
  const response = await fetch(`${API_BASE_URL}/loans`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al obtener los préstamos.");
  }

  return response.json() as Promise<Loan[]>;
}

export async function getLoan(id: number): Promise<Loan> {
  const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al obtener el préstamo.");
  }

  return response.json() as Promise<Loan>;
}

export async function createLoan(data: LoanFormData): Promise<Loan> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/loans`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        interestRate: data.interestRate / 100,
      }),
    });
  } catch {
    throw new Error("Ocurrió un error inesperado.");
  }

  if (!response.ok) {
    await throwApiError(response, "Error al crear el préstamo.");
  }

  return response.json() as Promise<Loan>;
}

export async function updateLoan(
  id: number,
  data: Partial<LoanFormData>,
): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/loans/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error("Ocurrió un error inesperado.");
  }

  if (!response.ok) {
    await throwApiError(response, "Error al actualizar el préstamo.");
  }
}

export async function getLoanContract(id: number): Promise<Blob> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/loans/${id}/contract`, {
      credentials: "include",
    });
  } catch {
    throw new Error("Ocurrió un error inesperado.");
  }

  if (!response.ok) {
    await throwApiError(
      response,
      "No se pudo obtener el contrato del préstamo.",
    );
  }

  return response.blob();
}

export async function deleteLoan(id: number): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/loans/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (error) {
    console.error(error);

    throw new Error("Ocurrió un error inesperado.");
  }

  if (!response.ok) {
    await throwApiError(response, "Error al eliminar el préstamo.");
  }
}
