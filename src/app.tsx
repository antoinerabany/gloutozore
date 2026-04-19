import { useState, useEffect } from "preact/hooks";
import { addSession, syncFromServer } from "./lib/storage";
import { HomeScreen } from "./components/HomeScreen";
import { ActiveFeeding } from "./components/ActiveFeeding";
import { History } from "./components/History";
import "./app.css";

type Screen = "home" | "feeding" | "history";

export function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activeBreast, setActiveBreast] = useState<"left" | "right">("left");
  const [, setSync] = useState(0);

  useEffect(() => {
    syncFromServer()
      .then(() => setSync((n) => n + 1))
      .catch(console.error);
  }, []);

  function handleStart(breast: "left" | "right") {
    setActiveBreast(breast);
    setScreen("feeding");
  }

  function handleStop(durationSeconds: number) {
    addSession({
      id: crypto.randomUUID(),
      breast: activeBreast,
      startedAt: new Date(Date.now() - durationSeconds * 1000).toISOString(),
      durationSeconds,
    });
    setScreen("home");
  }

  function handleCancel() {
    setScreen("home");
  }

  switch (screen) {
    case "feeding":
      return (
        <ActiveFeeding
          breast={activeBreast}
          onStop={handleStop}
          onCancel={handleCancel}
        />
      );
    case "history":
      return <History onBack={() => setScreen("home")} />;
    default:
      return (
        <HomeScreen
          onStart={handleStart}
          onShowHistory={() => setScreen("history")}
        />
      );
  }
}
