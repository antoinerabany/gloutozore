import { useState } from "preact/hooks";
import type { FeedingType } from "../lib/types";

const DURATION_OPTIONS = [5, 10, 15, 20];

function toTimeInputValue(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function timeInputToIso(value: string, reference: Date): string {
  const [hh, mm] = value.split(":").map((n) => parseInt(n, 10));
  const d = new Date(reference);
  d.setHours(hh, mm, 0, 0);
  // If the selected time is in the future (e.g. clock past midnight),
  // assume the user meant the previous day.
  if (d.getTime() > Date.now() + 60_000) {
    d.setDate(d.getDate() - 1);
  }
  return d.toISOString();
}

interface Props {
  breast: FeedingType;
  onSave: (
    durationMinutes: number | null,
    note: string | null,
    endedAt: string
  ) => void;
  onCancel: () => void;
}

export function FeedingDetails({ breast, onSave, onCancel }: Props) {
  const [duration, setDuration] = useState<number | null>(null);
  const [customDuration, setCustomDuration] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [note, setNote] = useState("");
  const [endTime, setEndTime] = useState(toTimeInputValue(new Date()));

  function handleSave() {
    const mins = showCustom
      ? customDuration
        ? parseInt(customDuration, 10) || null
        : null
      : duration;
    const endedAt = timeInputToIso(endTime, new Date());
    onSave(mins, note.trim() || null, endedAt);
  }

  const label =
    breast === "left" ? "Left" : breast === "right" ? "Right" : "🍼 Bottle";

  return (
    <div class="feeding-details">
      <button class="cancel-btn" onClick={onCancel}>
        Cancel
      </button>

      <div class="details-content">
        <span class={`details-breast ${breast}`}>{label}</span>

        <div class="duration-section">
          <p class="section-label">Duration (optional)</p>
          <div class="duration-chips">
            {DURATION_OPTIONS.map((m) => (
              <button
                key={m}
                class={`chip ${!showCustom && duration === m ? "selected" : ""}`}
                onClick={() => {
                  setShowCustom(false);
                  setDuration(duration === m ? null : m);
                }}
              >
                {m}min
              </button>
            ))}
            <button
              class={`chip ${showCustom ? "selected" : ""}`}
              onClick={() => {
                setShowCustom(true);
                setDuration(null);
              }}
            >
              More
            </button>
          </div>
          {showCustom && (
            <div class="custom-duration">
              <input
                type="number"
                class="custom-input"
                placeholder="Minutes"
                value={customDuration}
                onInput={(e) =>
                  setCustomDuration((e.target as HTMLInputElement).value)
                }
                autoFocus
              />
              <span class="custom-unit">min</span>
            </div>
          )}
        </div>

        <div class="end-time-section">
          <p class="section-label">End time</p>
          <input
            type="time"
            class="time-input"
            value={endTime}
            onInput={(e) =>
              setEndTime((e.target as HTMLInputElement).value)
            }
          />
        </div>

        <div class="note-section">
          <p class="section-label">Note (optional)</p>
          <input
            type="text"
            class="note-input"
            placeholder="e.g. baby fussy, short feed..."
            value={note}
            onInput={(e) => setNote((e.target as HTMLInputElement).value)}
          />
        </div>
      </div>

      <button class="save-btn" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}
