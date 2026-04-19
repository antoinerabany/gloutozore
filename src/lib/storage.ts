import type { FeedingSession } from "./types";

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
}

export function deleteSession(id: string): void {
  const sessions = getSessions().filter((s) => s.id !== id);
  saveSessions(sessions);
}

export function updateSession(
  id: string,
  updates: Partial<Pick<FeedingSession, "breast" | "durationSeconds">>
): void {
  const sessions = getSessions().map((s) =>
    s.id === id ? { ...s, ...updates } : s
  );
  saveSessions(sessions);
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
