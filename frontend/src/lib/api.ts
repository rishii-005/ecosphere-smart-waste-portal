import type { AdminUserProfile, PickupRequest, StatsSummary, User } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "";

interface AuthResponse {
  user: User;
  token: string;
}

function extractIssueMessage(data: unknown) {
  if (!data || typeof data !== "object" || !("issues" in data)) return "";
  const issues = (data as { issues?: Record<string, string[] | undefined> }).issues;
  if (!issues) return "";
  for (const value of Object.values(issues)) {
    if (Array.isArray(value) && value[0]) return value[0];
  }
  return "";
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("smartWasteToken");
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("Backend se connection nahi ban pa raha. Pehle backend terminal me `npm.cmd run dev` chalao, phir page refresh karo.");
  }
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    const message = String(data.message || "");
    if (
      message.toLowerCase().includes("token") ||
      message.toLowerCase().includes("auth") ||
      message.toLowerCase().includes("unauthorized")
    ) {
      window.dispatchEvent(new Event("smartWaste:auth-expired"));
      throw new ApiError("Session expired. Please login again.");
    }
  }
  if (!response.ok) throw new ApiError(data.message || extractIssueMessage(data) || "Request failed.");
  return data as T;
}

export const api = {
  warmup: () =>
    request<{ status: string; service?: string }>("/health", {
      method: "GET"
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),

  signup: (name: string, email: string, password: string) =>
    request<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    }),

  getRequests: () => request<{ requests: PickupRequest[]; users?: AdminUserProfile[] }>("/api/requests"),

  createRequest: (payload: Omit<PickupRequest, "id" | "userId" | "userName" | "status" | "createdAt" | "updatedAt">) =>
    request<{ request: PickupRequest }>("/api/requests", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  updateStatus: (id: string, status: PickupRequest["status"]) =>
    request<{ request: PickupRequest }>(`/api/requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),

  getStats: () => request<StatsSummary>("/api/requests/stats/summary"),

  reverseGeocode: (lat: number, lng: number) =>
    request<{ address: string; fullAddress: string }>(`/api/location/reverse-geocode?lat=${lat}&lng=${lng}`),

  askAi: (message: string, imageBase64?: string, mimeType?: string) =>
    request<{ answer: string }>("/api/ai/recycling-advice", {
      method: "POST",
      body: JSON.stringify({ message, imageBase64, mimeType })
    })
};
