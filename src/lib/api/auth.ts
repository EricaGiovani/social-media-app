import { api } from "./client";
import type { LoginValues, RegisterValues } from "@/schemas/auth";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type AuthUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
};

export type LoginData = {
  token: string;
  user: AuthUser;
};

export const login = (body: LoginValues) =>
  api<ApiResponse<LoginData>>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

export async function register(values: RegisterValues) {
  const { name, username, email, phone, password } = values;

  await api<ApiResponse<unknown>>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, username, email, phone, password }),
  });

  return login({ email, password });
}