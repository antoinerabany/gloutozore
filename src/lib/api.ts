import type { FeedingSession } from "./types";

const API_BASE = "/api/sessions";

export async function fetchSessions(): Promise<FeedingSession[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
}

export async function pushSession(session: FeedingSession): Promise<void> {
  await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });
}

export async function pushUpdate(
  id: string,
  updates: Partial<Pick<FeedingSession, "breast" | "durationSeconds">>
): Promise<void> {
  await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
}

export async function pushDelete(id: string): Promise<void> {
  await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
}
