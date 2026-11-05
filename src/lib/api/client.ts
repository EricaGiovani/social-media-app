const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: (() => void) | null) => {
  onUnauthorized = fn;
};

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isForm = init.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (res.status === 401 && token && !path.startsWith("/api/auth/")) {
    onUnauthorized?.();
  }

  if (!res.ok) {
    throw new ApiError(res.status, data?.message ?? "There is an error");
  }
  if (data === null) {
    throw new ApiError(
      res.status,
      "Invalid server response. Check NEXT_PUBLIC_API_URL.",
    );
  }
  return data as T;
}