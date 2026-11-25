export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  termsAccepted: boolean;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface LoginPayLoad {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface LoginResponse {
  user?: AuthUser;
  id?: string;
  name?: string;
  email?: string;
}

export class ApiError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(". ")
      : data?.message || "No se pudo completar el registro.";

    throw new ApiError(response.status, message);
  }

  return data as RegisterResponse;
}

export async function loginUser(payload: LoginPayLoad): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(". ")
      : data?.message || "No se pudo iniciar sesión.";

    throw new ApiError(response.status, message);
  }

  return (data ?? {}) as LoginResponse;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(". ")
      : data?.message || "No hay sesión activa.";

    throw new ApiError(response.status, message);
  }

  return (data?.user ?? data) as AuthUser;
}

export async function logoutUser(): Promise<void> {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message = Array.isArray(data?.message)
      ? data.message.join(". ")
      : data?.message || "No se pudo cerrar sesión.";

    throw new ApiError(response.status, message);
  }
}
