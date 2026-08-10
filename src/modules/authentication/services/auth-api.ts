import { throwApiError } from "@/lib/api-errors";
import { API_BASE_URL } from "@/lib/env";
import type { UserInfo } from "../types/user-types";

export async function loginRequest(
  userName: string,
  password: string,
): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      body: JSON.stringify({ userName, password }),
    });
  } catch (error) {
    console.error(error);
    throw new Error("No se pudo conectar con el servidor. Inténtalo de nuevo.");
  }

  if (!response.ok) {
    await throwApiError(
      response,
      "Credenciales incorrectas. Por favor, intenta de nuevo.",
    );
  }
}

export async function logoutRequest(): Promise<void> {
  await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function getMe(): Promise<UserInfo> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la información del usuario.");
  }

  return response.json() as Promise<UserInfo>;
}
