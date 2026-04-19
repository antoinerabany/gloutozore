import type { FeedingSession } from "./types";

const API_BASE = "/api/sessions";
const TOKEN_KEY = "gloutozore_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchSessions(): Promise<FeedingSession[]> {
  const res = await fetch(API_BASE, { headers: authHeaders() });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
}

export async function pushSession(session: FeedingSession): Promise<void> {
  await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(session),
  });
}

export async function pushUpdate(
  id: string,
  updates: Partial<Pick<FeedingSession, "breast" | "durationMinutes" | "note">>
): Promise<void> {
  await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(updates),
  });
}

export async function pushDelete(id: string): Promise<void> {
  await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}
