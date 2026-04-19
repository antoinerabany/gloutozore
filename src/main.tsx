import { render } from "preact";
import "./index.css";
import { App } from "./app.tsx";

render(<App />, document.getElementById("app")!);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(import.meta.env.BASE_URL + "sw.js");
}
