export interface FeedingSession {
  id: string;
  breast: "left" | "right";
  startedAt: string; // ISO 8601
  durationMinutes: number | null;
  note: string | null;
}
