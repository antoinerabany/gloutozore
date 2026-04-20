import type { FeedingSession } from "../lib/types";

const DAYS = 7;
const HOURS = 24;

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
  // grid[day][hour] = total minutes
  const grid: number[][] = Array.from({ length: DAYS }, () =>
    Array(HOURS).fill(0)
  );

  for (const s of sessions) {
    // startedAt is the end time, compute start from duration
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
      grid[dayIndex][hour] += mins || 1; // count 1 if no duration set
    }
  }

  return grid;
}

function dayLabel(daysAgo: number): string {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString([], { weekday: "short" });
}

function cellColor(value: number, max: number): string {
  if (value === 0) return "var(--heatmap-empty)";
  const intensity = Math.min(value / Math.max(max, 1), 1);
  // 4 levels like GitHub
  if (intensity <= 0.25) return "var(--heatmap-1)";
  if (intensity <= 0.5) return "var(--heatmap-2)";
  if (intensity <= 0.75) return "var(--heatmap-3)";
  return "var(--heatmap-4)";
}

interface Props {
  sessions: FeedingSession[];
}

export function HeatMap({ sessions }: Props) {
  const grid = buildGrid(sessions);
  const max = Math.max(...grid.flat(), 1);

  // Only show hours 6-23 to save space (feedings between midnight-5am are rare-ish)
  const hourStart = 0;
  const hourEnd = 24;
  const visibleHours = Array.from(
    { length: hourEnd - hourStart },
    (_, i) => i + hourStart
  );

  return (
    <div class="heatmap">
      <div class="heatmap-grid">
        {/* Hour labels row */}
        <div class="heatmap-row heatmap-header">
          <span class="heatmap-day-label" />
          {visibleHours.map((h) => (
            <span key={h} class="heatmap-hour-label">
              {h % 6 === 0 ? `${h}h` : ""}
            </span>
          ))}
        </div>

        {/* Data rows — newest day first */}
        {[...grid].reverse().map((row, ri) => (
          <div key={ri} class="heatmap-row">
            <span class="heatmap-day-label">{dayLabel(ri)}</span>
            {visibleHours.map((h) => (
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
