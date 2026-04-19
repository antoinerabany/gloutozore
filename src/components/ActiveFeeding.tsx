import { useEffect, useState, useRef } from "preact/hooks";

interface Props {
  breast: "left" | "right";
  onStop: (durationSeconds: number) => void;
  onCancel: () => void;
}

export function ActiveFeeding({ breast, onStop, onCancel }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const display = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    <div class={`active-feeding ${breast}`}>
      <button class="cancel-btn" onClick={onCancel}>
        Cancel
      </button>

      <div class="feeding-info">
        <span class="feeding-breast">{breast === "left" ? "Left" : "Right"}</span>
        <span class="feeding-timer">{display}</span>
      </div>

      <button class="stop-btn" onClick={() => onStop(elapsed)}>
        Stop
      </button>
    </div>
  );
}
