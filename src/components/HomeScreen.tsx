import { getLastSession, getNextBreast, getSessions } from "../lib/storage";
import { HeatMap } from "./HeatMap";

function fmtTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatTimeRange(endIso: string, durationMinutes: number | null): string {
  const end = new Date(endIso);
  if (durationMinutes == null) return fmtTime(end);
  const start = new Date(end.getTime() - durationMinutes * 60000);
  return `${fmtTime(start)} - ${fmtTime(end)}`;
}

interface Props {
  onStart: (breast: "left" | "right") => void;
  onShowHistory: () => void;
}

export function HomeScreen({ onStart, onShowHistory }: Props) {
  const next = getNextBreast();
  const last = getLastSession();

  return (
    <div class="home">
      <h1 class="app-title">Gloutozore</h1>

      {last && (
        <div class="session-row last-feed-row">
          <span class={`session-breast ${last.breast}`}>
            {last.breast === "left" ? "L" : "R"}
          </span>
          <span class="session-time">
            {formatTimeRange(last.startedAt, last.durationMinutes)}
          </span>
          <span class="session-duration">
            {last.durationMinutes != null ? `${last.durationMinutes}min` : ""}
          </span>
          {last.note && <span class="session-note">{last.note}</span>}
        </div>
      )}

      <p class="next-hint">
        {last ? `Next: ${next === "left" ? "Left" : "Right"}` : "Ready to start"}
      </p>

      <div class="breast-buttons">
        <button
          class={`breast-btn left ${next === "left" ? "suggested" : ""}`}
          onClick={() => onStart("left")}
        >
          L
        </button>
        <button
          class={`breast-btn right ${next === "right" ? "suggested" : ""}`}
          onClick={() => onStart("right")}
        >
          R
        </button>
      </div>

      <HeatMap sessions={getSessions()} />

      <button class="history-btn" onClick={onShowHistory}>
        History
      </button>
    </div>
  );
}
