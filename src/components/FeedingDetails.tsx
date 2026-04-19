import { useState } from "preact/hooks";

const DURATION_OPTIONS = [5, 10, 15, 20];

interface Props {
  breast: "left" | "right";
  onSave: (durationMinutes: number | null, note: string | null) => void;
  onCancel: () => void;
}

export function FeedingDetails({ breast, onSave, onCancel }: Props) {
  const [duration, setDuration] = useState<number | null>(null);
  const [customDuration, setCustomDuration] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [note, setNote] = useState("");

  function handleSave() {
    const mins = showCustom
      ? customDuration
        ? parseInt(customDuration, 10) || null
        : null
      : duration;
    onSave(mins, note.trim() || null);
  }

  return (
    <div class="feeding-details">
      <button class="cancel-btn" onClick={onCancel}>
        Cancel
      </button>

      <div class="details-content">
        <span class={`details-breast ${breast}`}>
          {breast === "left" ? "Left" : "Right"}
        </span>

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
