import type { FeedingSession } from "./types";
import { fetchSessions, pushSession, pushUpdate, pushDelete } from "./api";

const STORAGE_KEY = "gloutozore_sessions";

export function getSessions(): FeedingSession[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as FeedingSession[];
}

function saveSessions(sessions: FeedingSession[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function addSession(session: FeedingSession): void {
  const sessions = getSessions();
  sessions.unshift(session);
  saveSessions(sessions);
  pushSession(session).catch(console.error);
}

export function deleteSession(id: string): void {
  const sessions = getSessions().filter((s) => s.id !== id);
  saveSessions(sessions);
  pushDelete(id).catch(console.error);
}

export function updateSession(
  id: string,
  updates: Partial<Pick<FeedingSession, "breast" | "durationMinutes" | "note">>
): void {
  const sessions = getSessions().map((s) =>
    s.id === id ? { ...s, ...updates } : s
  );
  saveSessions(sessions);
  pushUpdate(id, updates).catch(console.error);
}

export function getLastSession(): FeedingSession | null {
  const sessions = getSessions();
  return sessions.length > 0 ? sessions[0] : null;
}

export function getNextBreast(): "left" | "right" {
  const last = getLastSession();
  if (!last) return "left";
  return last.breast === "left" ? "right" : "left";
}

/** Fetch sessions from API and replace local cache */
export async function syncFromServer(): Promise<FeedingSession[]> {
  const remote = await fetchSessions();
  saveSessions(remote);
  return remote;
}
