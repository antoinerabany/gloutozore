import { useState } from "preact/hooks";
import type { FeedingSession } from "../lib/types";
import { getSessions, deleteSession, updateSession } from "../lib/storage";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupByDay(
  sessions: FeedingSession[]
): Map<string, FeedingSession[]> {
  const groups = new Map<string, FeedingSession[]>();
  for (const s of sessions) {
    const day = new Date(s.startedAt).toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    const list = groups.get(day) ?? [];
    list.push(s);
    groups.set(day, list);
  }
  return groups;
}

interface Props {
  onBack: () => void;
}

export function History({ onBack }: Props) {
  const [sessions, setSessions] = useState(getSessions);
  const [editingId, setEditingId] = useState<string | null>(null);

  const grouped = groupByDay(sessions);

  function handleDelete(id: string) {
    deleteSession(id);
    setSessions(getSessions());
    setEditingId(null);
  }

  function handleToggleBreast(session: FeedingSession) {
    const newBreast = session.breast === "left" ? "right" : "left";
    updateSession(session.id, { breast: newBreast });
    setSessions(getSessions());
  }

  return (
    <div class="history">
      <div class="history-header">
        <button class="back-btn" onClick={onBack}>
          &larr; Back
        </button>
        <h2>History</h2>
      </div>

      {sessions.length === 0 && (
        <p class="empty">No feedings recorded yet.</p>
      )}

      {[...grouped.entries()].map(([day, items]) => (
        <div key={day} class="day-group">
          <h3 class="day-title">{day}</h3>
          {items.map((s) => (
            <div
              key={s.id}
              class={`session-row ${editingId === s.id ? "editing" : ""}`}
              onClick={() =>
                setEditingId(editingId === s.id ? null : s.id)
              }
            >
              <span class={`session-breast ${s.breast}`}>
                {s.breast === "left" ? "L" : "R"}
              </span>
              <span class="session-time">{formatTime(s.startedAt)}</span>
              <span class="session-duration">
                {s.durationMinutes != null ? `${s.durationMinutes}min` : ""}
              </span>
              {s.note && <span class="session-note">{s.note}</span>}
              {editingId === s.id && (
                <div class="session-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    class="action-btn"
                    onClick={() => handleToggleBreast(s)}
                  >
                    Switch to {s.breast === "left" ? "R" : "L"}
                  </button>
                  <button
                    class="action-btn delete"
                    onClick={() => handleDelete(s.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
