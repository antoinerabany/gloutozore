import { getLastSession, getNextBreast, getSessions } from "../lib/storage";
import { HeatMap } from "./HeatMap";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDuration(minutes: number | null): string {
  if (minutes == null) return "";
  return `${minutes}min`;
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
        <p class="last-feed">
          Last: {last.breast === "left" ? "L" : "R"}
          {last.durationMinutes != null && ` \u00b7 ${formatDuration(last.durationMinutes)}`}
          {" \u00b7 "}{timeAgo(last.startedAt)}
        </p>
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
