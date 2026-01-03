import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { logResourceTiming } from "./hooks/useWebVitals";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

if (import.meta.env.PROD) {
  window.addEventListener("load", () => {
    setTimeout(logResourceTiming, 3000);
  });
}

