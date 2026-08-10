import { HttpError, throwApiError } from "@/lib/api-errors";
import { API_BASE_URL } from "@/lib/env";
import type {
  Client,
  ClientDetail,
  ClientPayload,
} from "../types/client-types";

export async function getClients(): Promise<Client[]> {
  const response = await fetch(`${API_BASE_URL}/clients`);

  if (!response.ok) {
    throw new HttpError(response.status, "Error al obtener los clientes.");
  }

  return response.json() as Promise<Client[]>;
}

export async function getClient(id: number): Promise<ClientDetail> {
  const response = await fetch(`${API_BASE_URL}/clients/${id}`);

  if (!response.ok) {
    throw new HttpError(response.status, "Error al obtener el cliente.");
  }

  return response.json() as Promise<ClientDetail>;
}

export async function createClient(data: ClientPayload): Promise<Client> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error("Ocurrió un error inesperado.");
  }

  if (!response.ok) {
    await throwApiError(response, "Error al crear el cliente.");
  }

  return response.json() as Promise<Client>;
}

export async function updateClient(
  id: number,
  data: ClientPayload,
): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error("Ocurrió un error inesperado.");
  }

  if (!response.ok) {
    await throwApiError(response, "Error al actualizar el cliente.");
  }
}

export async function deleteClient(id: number): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: "DELETE",
    });
  } catch {
    throw new Error("Ocurrió un error inesperado.");
  }

  if (!response.ok) {
    await throwApiError(response, "Error al eliminar el cliente.");
  }
}
