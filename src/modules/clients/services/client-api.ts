import type { Client, ClientDetail, ClientFormData } from "../types/client-types";

const API_BASE_URL = "http://localhost:5162";

export async function getClients(): Promise<Client[]> {
  const response = await fetch(`${API_BASE_URL}/clients`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al obtener los clientes.");
  }

  return response.json() as Promise<Client[]>;
}

export async function getClient(id: number): Promise<Client> {
  const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al obtener el cliente.");
  }

  return response.json() as Promise<Client>;
}

export async function getClientDetail(id: number): Promise<ClientDetail> {
  const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al obtener el cliente.");
  }

  return response.json() as Promise<ClientDetail>;
}

export async function createClient(data: ClientFormData): Promise<Client> {
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al crear el cliente.");
  }

  return response.json() as Promise<Client>;
}

export async function updateClient(
  id: number,
  data: ClientFormData,
): Promise<Client> {
  const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el cliente.");
  }

  return response.json() as Promise<Client>;
}

export async function deleteClient(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el cliente.");
  }
}
