import { useState, useEffect } from "preact/hooks";
import { addSession, syncFromServer } from "./lib/storage";
import { getToken } from "./lib/api";
import type { FeedingType } from "./lib/types";
import { Login } from "./components/Login";
import { HomeScreen } from "./components/HomeScreen";
import { FeedingDetails } from "./components/FeedingDetails";
import { History } from "./components/History";
import "./app.css";

type Screen = "login" | "home" | "feeding" | "history";

export function App() {
  const [screen, setScreen] = useState<Screen>(
    getToken() ? "home" : "login"
  );
  const [activeBreast, setActiveBreast] = useState<FeedingType>("left");
  const [, setSync] = useState(0);

  useEffect(() => {
    if (screen === "login") return;
    syncFromServer()
      .then(() => setSync((n) => n + 1))
      .catch(console.error);
  }, [screen === "login"]);

  function handleStart(breast: FeedingType) {
    setActiveBreast(breast);
    setScreen("feeding");
  }

  function handleSave(
    durationMinutes: number | null,
    note: string | null,
    endedAt: string
  ) {
    addSession({
      id: crypto.randomUUID(),
      breast: activeBreast,
      startedAt: endedAt,
      durationMinutes,
      note,
    });
    setScreen("home");
  }

  switch (screen) {
    case "login":
      return <Login onLogin={() => setScreen("home")} />;
    case "feeding":
      return (
        <FeedingDetails
          breast={activeBreast}
          onSave={handleSave}
          onCancel={() => setScreen("home")}
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
