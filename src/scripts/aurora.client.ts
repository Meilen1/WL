import { initAurora } from "../components/AuroraScene";

const el = document.getElementById("aurora") as HTMLDivElement | null;

console.log("SCRIPT CLIENTE", el);

if (el) {
  initAurora(el);
}