import { initAurora } from "../components/AuroraScene";

function start() {
  const el = document.getElementById("aurora") as HTMLDivElement | null;
  console.log("SCRIPT CLIENTE", el);

  if (el) {
    initAurora(el);
  }
}

// 🔥 CLAVE: esperar DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
