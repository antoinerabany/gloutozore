import { useState, useEffect } from "preact/hooks";
import { addSession, syncFromServer } from "./lib/storage";
import { getToken } from "./lib/api";
import { Login } from "./components/Login";
import { HomeScreen } from "./components/HomeScreen";
import { ActiveFeeding } from "./components/ActiveFeeding";
import { History } from "./components/History";
import "./app.css";

type Screen = "login" | "home" | "feeding" | "history";

export function App() {
  const [screen, setScreen] = useState<Screen>(
    getToken() ? "home" : "login"
  );
  const [activeBreast, setActiveBreast] = useState<"left" | "right">("left");
  const [, setSync] = useState(0);

  useEffect(() => {
    if (screen === "login") return;
    syncFromServer()
      .then(() => setSync((n) => n + 1))
      .catch(console.error);
  }, [screen === "login"]);

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
    case "login":
      return <Login onLogin={() => setScreen("home")} />;
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
