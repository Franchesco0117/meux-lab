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
