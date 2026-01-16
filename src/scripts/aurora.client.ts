import { initAurora } from "../components/AuroraScene";

function start() {
  const el = document.getElementById("aurora");
  if (el) initAurora(el as HTMLDivElement);
}

// 🔑 CLAVE ABSOLUTA
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}
