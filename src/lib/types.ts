export interface FeedingSession {
  id: string;
  breast: "left" | "right";
  startedAt: string; // ISO 8601
  durationSeconds: number;
}
