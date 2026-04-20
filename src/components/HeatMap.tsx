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

function dayLabel(daysAgo: number): string {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yest.";
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString([], { weekday: "short" });
}

function cellColor(value: number, max: number): string {
  if (value === 0) return "var(--heatmap-empty)";
  const intensity = Math.min(value / Math.max(max, 1), 1);
  if (intensity <= 0.25) return "var(--heatmap-1)";
  if (intensity <= 0.5) return "var(--heatmap-2)";
  if (intensity <= 0.75) return "var(--heatmap-3)";
  return "var(--heatmap-4)";
}

const AM_HOURS = Array.from({ length: 12 }, (_, i) => i);
const PM_HOURS = Array.from({ length: 12 }, (_, i) => i + 12);

interface Props {
  sessions: FeedingSession[];
}

export function HeatMap({ sessions }: Props) {
  const grid = buildGrid(sessions);
  const max = Math.max(...grid.flat(), 1);

  // Newest day first
  const rows = [...grid].reverse();

  // Build interleaved rows: Today AM, Today PM, Yest. AM, Yest. PM, ...
  const allRows: { label: string; hours: number[]; data: number[] }[] = [];
  for (let ri = 0; ri < rows.length; ri++) {
    const label = dayLabel(ri);
    allRows.push({
      label: `${label} AM`,
      hours: AM_HOURS,
      data: rows[ri],
    });
    allRows.push({
      label: `${label} PM`,
      hours: PM_HOURS,
      data: rows[ri],
    });
  }

  return (
    <div class="heatmap">
      <div class="heatmap-grid">
        {/* Hour labels */}
        <div class="heatmap-row heatmap-header">
          <span class="heatmap-day-label" />
          {AM_HOURS.map((h) => (
            <span key={h} class="heatmap-hour-label">
              {h % 3 === 0 ? `${h}` : ""}
            </span>
          ))}
        </div>

        {allRows.map((row) => (
          <div key={row.label} class="heatmap-row">
            <span class="heatmap-day-label">{row.label}</span>
            {row.hours.map((h) => (
              <span
                key={h}
                class="heatmap-cell"
                style={{ background: cellColor(row.data[h], max) }}
                title={row.data[h] > 0 ? `${row.data[h]}min` : ""}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
