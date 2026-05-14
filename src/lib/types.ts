export type FeedingType = "left" | "right" | "bottle";

export interface FeedingSession {
  id: string;
  breast: FeedingType;
  startedAt: string; // ISO 8601
  durationMinutes: number | null;
  note: string | null;
}
