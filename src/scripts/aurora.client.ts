import { initAurora } from "../components/AuroraScene";

const el = document.getElementById("aurora") as HTMLDivElement | null;

if (!el) {
  console.error("❌ #aurora no encontrado");
} else {
  startAurora(el);
}

export function startAurora(element: HTMLDivElement) {
  if (element.clientWidth === 0 || element.clientHeight === 0) {
    requestAnimationFrame(() => startAurora(element));
    return;
  }

  initAurora(element);
}
