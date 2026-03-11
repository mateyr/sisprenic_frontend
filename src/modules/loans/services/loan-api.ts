import type { Loan, LoanFormData } from "../types/loan-types";

const API_BASE_URL = "http://localhost:5162";

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
  const response = await fetch(`${API_BASE_URL}/loans`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      interestRate: data.interestRate / 100,
    }),
  });

  if (!response.ok) {
    throw new Error("Error al crear el préstamo.");
  }

  return response.json() as Promise<Loan>;
}

export async function deleteLoan(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el préstamo.");
  }
}
