import type { FeedingSession } from "../lib/types";

const DAYS = 3;

function getLastNDays(n: number): Date[] {
  const days: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }
  return days;
}

function buildGrid(sessions: FeedingSession[]): number[][] {
  const days = getLastNDays(DAYS);
  const grid: number[][] = Array.from({ length: DAYS }, () =>
    Array(24).fill(0)
  );

  for (const s of sessions) {
    const end = new Date(s.startedAt);
    const mins = s.durationMinutes ?? 0;
    const start = new Date(end.getTime() - mins * 60000);
    const hour = start.getHours();

    const dayStart = new Date(start);
    dayStart.setHours(0, 0, 0, 0);

    const dayIndex = days.findIndex(
      (d) => d.getTime() === dayStart.getTime()
    );
    if (dayIndex >= 0) {
      grid[dayIndex][hour] += mins || 1;
    }
  }

  return grid;
}

function cellColor(value: number, max: number): string {
  if (value === 0) return "var(--heatmap-empty)";
  const intensity = Math.min(value / Math.max(max, 1), 1);
  if (intensity <= 0.25) return "var(--heatmap-1)";
  if (intensity <= 0.5) return "var(--heatmap-2)";
  if (intensity <= 0.75) return "var(--heatmap-3)";
  return "var(--heatmap-4)";
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface Props {
  sessions: FeedingSession[];
}

export function HeatMap({ sessions }: Props) {
  const grid = buildGrid(sessions);
  const max = Math.max(...grid.flat(), 1);
  const rows = [...grid].reverse();

  return (
    <div class="heatmap">
      <div class="heatmap-grid">
        <div class="heatmap-row heatmap-header">
          {HOURS.map((h) => (
            <span key={h} class="heatmap-hour-label">
              {h % 6 === 0 ? `${h}h` : ""}
            </span>
          ))}
        </div>

        {rows.map((row, ri) => (
          <div key={ri} class="heatmap-row">
            {HOURS.map((h) => (
              <span
                key={h}
                class="heatmap-cell"
                style={{ background: cellColor(row[h], max) }}
                title={row[h] > 0 ? `${row[h]}min` : ""}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
