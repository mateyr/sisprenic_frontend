import type { UserInfo } from "../types/user-types";

const API_BASE_URL = "http://localhost:5162";

export async function loginRequest(
  email: string,
  password: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/login?useCookies=true&useSessionCookies=true`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    },
  );

  if (!response.ok) {
    throw new Error("Credenciales incorrectas. Por favor, intenta de nuevo.");
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
