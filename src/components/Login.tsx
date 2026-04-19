import { useState } from "preact/hooks";
import { setToken } from "../lib/api";

interface Props {
  onLogin: () => void;
}

export function Login({ onLogin }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!password.trim()) return;

    setToken(password.trim());

    try {
      const res = await fetch("/api/sessions", {
        headers: { Authorization: `Bearer ${password.trim()}` },
      });
      if (res.status === 401) {
        setError(true);
        return;
      }
      onLogin();
    } catch {
      // Offline — accept the token and let them use the app
      onLogin();
    }
  }

  return (
    <div class="login">
      <h1 class="app-title">Gloutozore</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          class="login-input"
          placeholder="Password"
          value={password}
          onInput={(e) => {
            setPassword((e.target as HTMLInputElement).value);
            setError(false);
          }}
          autoFocus
        />
        {error && <p class="login-error">Wrong password</p>}
        <button type="submit" class="login-btn">
          Enter
        </button>
      </form>
    </div>
  );
}
