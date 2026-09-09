import type { Role } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kns_token");
}

export function getRole(): Role | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kns_role") as Role | null;
}

export function getName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kns_name");
}

export function clearSession() {
  localStorage.removeItem("kns_token");
  localStorage.removeItem("kns_role");
  localStorage.removeItem("kns_name");
}

export function logout() {
  clearSession();
  // Hard navigation (not router.push) to fully reset in-memory app state on
  // logout; this is also called from plain utility code with no router access.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = "/login";
}

export function roleHome(role: Role | null): string {
  if (role === "admin") return "/admin";
  if (role === "uploader") return "/upload";
  return "/dashboard";
}

/**
 * fetch wrapper that attaches the Authorization header and normalizes
 * error handling. Throws ApiError with the backend's `detail` message
 * (or a fallback) on non-2xx responses.
 */
export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearSession();
    // Called from plain fetch-wrapper code with no router access; see logout().
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/login";
    throw new ApiError("Session expired", 401);
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const detail =
      typeof data.detail === "string"
        ? data.detail
        : `Request failed (${res.status})`;
    throw new ApiError(detail, res.status);
  }

  if (res.status === 204) return null;
  return res.json().catch(() => null);
}

export function apiErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
